import { supabase } from "@/lib/supabaseClient";

export type KPIResult = {
  totalProductsQty: number;
  lowStockCount: number;
  outOfStockCount: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  internalTransfersScheduled: number;
};

// Always use MySQL/Prisma for data operations
async function getPrisma(): Promise<any> {
  const prismaModule = (await (eval('import("@prisma/client")') as Promise<any>).catch(() => null)) as any;
  if (!prismaModule || !prismaModule.PrismaClient) {
    throw new Error("Prisma client not available. Install @prisma/client.");
  }
  const prisma = new prismaModule.PrismaClient();
  
  // Test the connection
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error: any) {
    throw new Error(`Database connection failed: ${error.message}. Please ensure your MySQL database is running and DATABASE_URL is correctly configured.`);
  }
  
  return prisma;
}

export async function getKPIs(): Promise<KPIResult> {
  try {
    const prisma = await getPrisma();
    try {
      const products = await prisma.$queryRaw<any[]>`SELECT id, current_stock, min_stock_level FROM products`;
      const totalQty = (products || []).reduce((sum: number, p: any) => sum + (Number(p.current_stock) || 0), 0);
      const lowStockCount = (products || []).filter((p: any) => Number(p.current_stock) <= Number(p.min_stock_level)).length;
      const outOfStockCount = (products || []).filter((p: any) => Number(p.current_stock) === 0).length;

      const pendingReceipts = await prisma.operation.count({ where: { type: "INCOMING", status: { in: ["WAITING", "READY"] } } });
      const pendingDeliveries = await prisma.operation.count({ where: { type: "OUTGOING", status: { in: ["WAITING", "READY"] } } });
      const internalTransfersScheduled = await prisma.operation.count({ where: { type: "INTERNAL", status: { in: ["WAITING", "READY"] } } });

      return {
        totalProductsQty: totalQty,
        lowStockCount,
        outOfStockCount,
        pendingReceipts,
        pendingDeliveries,
        internalTransfersScheduled,
      };
    } finally {
      await prisma.$disconnect();
    }
  } catch (error: any) {
    console.error("Database error in getKPIs:", error.message);
    // Return default values when database is not accessible
    return {
      totalProductsQty: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      pendingReceipts: 0,
      pendingDeliveries: 0,
      internalTransfersScheduled: 0,
    };
  }
}

export type ProductRow = {
  id: string;
  name: string;
  sku: string;
  category?: string | null;
  uom?: string | null;
  min_stock_level: number;
  current_stock: number;
  cost: number;
};

export async function listProducts(q?: string): Promise<ProductRow[]> {
  try {
    const prisma = await getPrisma();
    try {
      const where: any = q
        ? { OR: [{ name: { contains: q } }, { sku: { contains: q } }] }
        : {};
      const products = await prisma.product.findMany({
        where,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          sku: true,
          category: true,
          uom: true,
          min_stock_level: true,
          current_stock: true,
          cost: true,
        },
      });
      return products as ProductRow[];
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("Database error in listProducts:", error);
    return [];
  }
}

export async function createProduct(payload: {
  name: string;
  sku: string;
  category?: string | null;
  uom?: string | null;
  min_stock_level: number;
  initial_stock: number;
  cost: number;
}): Promise<{ id: string }>
{
  try {
    const prisma = await getPrisma();
    try {
      const created = await prisma.product.create({
        data: {
          name: payload.name,
          sku: payload.sku,
          category: payload.category || null,
          uom: payload.uom || null,
          min_stock_level: Math.max(0, Number(payload.min_stock_level) || 0),
          current_stock: Math.max(0, Number(payload.initial_stock) || 0),
          cost: Math.max(0, Number(payload.cost) || 0),
        },
        select: { id: true },
      });
      return { id: created.id };
    } finally {
      await prisma.$disconnect();
    }
  } catch (error: any) {
    console.error("Database error in createProduct:", error);
    throw new Error(`Failed to create product: ${error.message}`);
  }
}

export type OperationRow = {
  id: string;
  reference: string | null;
  type: "INCOMING" | "OUTGOING" | "INTERNAL" | "ADJUSTMENT";
  partner: string;
  schedule_date: string;
  source_location: string;
  destination_location: string;
  status: "DRAFT" | "WAITING" | "READY" | "DONE" | "CANCELED";
};

export async function listOperations(type?: string, status?: string): Promise<OperationRow[]> {
  try {
    const prisma = await getPrisma();
    try {
      const where: any = {};
      if (type && ["INCOMING","OUTGOING","INTERNAL","ADJUSTMENT"].includes(type)) where.type = type;
      if (status && ["DRAFT","WAITING","READY","DONE","CANCELED"].includes(status)) where.status = status;
      const ops = await prisma.operation.findMany({
        where,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          reference: true,
          type: true,
          partner: true,
          schedule_date: true,
          source_location: true,
          destination_location: true,
          status: true,
        },
      });
      return ops.map((o: any) => ({ ...o, schedule_date: (o.schedule_date as Date).toISOString() })) as OperationRow[];
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("Database error in listOperations:", error);
    return [];
  }
}

export async function createAdjustmentOperation(payload: {
  productId: string;
  location: string;
  countedQty: number;
  reason?: string;
}): Promise<{ id: string; error?: string }> {
  try {
    // Get current stock for the product
    const product = await getProductById(payload.productId);
    if (!product) {
      return { id: "", error: "Product not found" };
    }
    
    const difference = payload.countedQty - product.current_stock;
    
    const prisma = await getPrisma();
    try {
      // Create adjustment operation
      const op = await prisma.operation.create({
        data: {
          type: "ADJUSTMENT",
          partner: payload.reason || "Stock Adjustment",
          schedule_date: new Date(),
          source_location: payload.location,
          destination_location: payload.location,
          status: "DONE",
          items: {
            create: [{
              product_id: payload.productId,
              qty: Math.abs(difference),
              done_qty: Math.abs(difference)
            }]
          }
        },
        select: { id: true }
      });
      
      // Update product stock
      await prisma.product.update({
        where: { id: payload.productId },
        data: { current_stock: payload.countedQty }
      });
      
      // Create stock move record
      await prisma.stockMove.create({
        data: {
          date: new Date(),
          product_id: payload.productId,
          qty: Math.abs(difference),
          from_location: payload.location,
          to_location: payload.location,
          reference_doc: `Adjustment for ${product.name}`,
          status: "DONE"
        }
      });
      
      return { id: op.id };
    } catch (err: any) {
      return { id: "", error: err?.message || String(err) };
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("Database error in createAdjustmentOperation:", error);
    return { id: "", error: "Failed to create adjustment operation due to database error" };
  }
}

export async function validateOperation(operationId: string): Promise<{ ok: boolean; error?: string }>{
  try {
    const prisma = await getPrisma();
    try {
      const op = await prisma.operation.findUnique({ where: { id: operationId } });
      if (!op) return { ok: false, error: "Operation not found" };
      if (op.status !== "READY") return { ok: false, error: "Operation must be in READY state to validate" };
      const items = await prisma.operationItem.findMany({ where: { operation_id: operationId } });
      if (!items || items.length === 0) return { ok: false, error: "No items to validate for this operation" };

      const productIds = Array.from(new Set(items.map((i: any) => i.product_id)));
      const products = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, current_stock: true } });
      const stockMap = new Map<string, number>();
      for (const p of products) stockMap.set(p.id, Number(p.current_stock) || 0);

      // Quantities must be non-negative
      for (const it of items) {
        const moveQtyRaw = Number(it.done_qty) > 0 ? Number(it.done_qty) : Number(it.qty);
        if (moveQtyRaw < 0) {
          return { ok: false, error: "Quantities must be non-negative" };
        }
      }
      if (op.type === "OUTGOING") {
        for (const it of items) {
          const current = stockMap.get(it.product_id) || 0;
          const required = Math.max(0, Number(it.done_qty) > 0 ? Number(it.done_qty) : Number(it.qty));
          if (current < required) {
            return { ok: false, error: "Insufficient stock for one or more items" };
          }
        }
      }

      for (const it of items) {
        const moveQty = Math.max(0, Number(it.done_qty) > 0 ? Number(it.done_qty) : Number(it.qty));
        const current = stockMap.get(it.product_id) || 0;
        let newStock = current;
        if (op.type === "INCOMING") newStock = current + moveQty;
        if (op.type === "OUTGOING") newStock = current - moveQty;
        if (op.type === "ADJUSTMENT") newStock = current + (moveQty * (op.destination_location === op.source_location ? 1 : -1));
        if (newStock < 0) {
          return { ok: false, error: "Resulting stock cannot be negative" };
        }
        await prisma.product.update({ where: { id: it.product_id }, data: { current_stock: newStock } });
        stockMap.set(it.product_id, newStock);
        await prisma.stockMove.create({
          data: {
            date: new Date(),
            product_id: it.product_id,
            qty: moveQty,
            from_location: op.source_location,
            to_location: op.destination_location,
            reference_doc: op.reference || "",
            status: op.type === "INTERNAL" ? op.status : "DONE",
          },
        });
      }

      for (const it of items) {
      const normalized = Math.max(0, Number(it.done_qty) > 0 ? Number(it.done_qty) : Number(it.qty));
      await prisma.operationItem.update({ where: { id: it.id }, data: { done_qty: normalized } });
      }
      await prisma.operation.update({ where: { id: operationId }, data: { status: "DONE" } });

      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || String(err) };
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("Database error in validateOperation:", error);
    return { ok: false, error: "Failed to validate operation due to database error" };
  }
}

export type MoveRow = {
  id: string;
  date: string;
  product_id: string;
  product_name?: string;
  qty: number;
  from_location: string;
  to_location: string;
  reference_doc: string;
  status: "DRAFT" | "WAITING" | "READY" | "DONE" | "CANCELED";
};

export async function listMoves(): Promise<MoveRow[]> {
  try {
    const prisma = await getPrisma();
    try {
      const moves = await prisma.stockMove.findMany({
        orderBy: { date: "desc" },
        select: {
          id: true,
          date: true,
          product_id: true,
          qty: true,
          from_location: true,
          to_location: true,
          reference_doc: true,
          status: true,
          product: { select: { name: true } },
        },
      });
      return moves.map((m: any) => ({
        id: m.id,
        date: (m.date as Date).toISOString(),
        product_id: m.product_id,
        product_name: m.product?.name,
        qty: Number(m.qty),
        from_location: m.from_location,
        to_location: m.to_location,
        reference_doc: m.reference_doc,
        status: m.status,
      })) as MoveRow[];
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("Database error in listMoves:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<ProductRow | null> {
  try {
    const prisma = await getPrisma();
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          sku: true,
          category: true,
          uom: true,
          min_stock_level: true,
          current_stock: true,
          cost: true,
        },
      });
      return product as ProductRow;
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("Database error in getProductById:", error);
    return null;
  }
}

export type StockByLocation = {
  location: string;
  quantity: number;
  last_updated: string;
};

export async function getProductStockByLocation(productId: string): Promise<StockByLocation[]> {
  // This is a simplified implementation - in a real system, you'd have a proper stock_by_location table
  // For now, we'll simulate with stock moves and return current stock by destination location
  try {
    const prisma = await getPrisma();
    try {
      const moves = await prisma.stockMove.groupBy({
        by: ['to_location'],
        where: { product_id: productId },
        _sum: { qty: true },
        _max: { date: true },
      });
      
      return moves.map((move: any) => ({
        location: move.to_location,
        quantity: Number(move._sum.qty) || 0,
        last_updated: (move._max.date as Date)?.toISOString() || new Date().toISOString(),
      }));
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("Database error in getProductStockByLocation:", error);
    return [];
  }
}