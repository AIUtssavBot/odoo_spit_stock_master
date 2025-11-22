import { NextResponse } from "next/server";
import { listProducts } from "@/lib/data/provider";

export async function GET() {
  try {
    const products = await listProducts();
    const headers = ["id", "name", "sku", "category", "uom", "min_stock_level", "current_stock", "cost"];
    const rows = products.map(p => [
      p.id,
      p.name,
      p.sku,
      p.category ?? "",
      p.uom ?? "",
      String(p.min_stock_level ?? 0),
      String(p.current_stock ?? 0),
      String(p.cost ?? 0),
    ]);

    const escapeCsv = (val: string) => {
      if (val == null) return "";
      if (val.includes('\"') || val.includes(',') || val.includes('\n')) {
        return `\"${val.replace(/\"/g, '""')}\"`;
      }
      return val;
    };

    const csv = [headers.join(","), ...rows.map(r => r.map(c => escapeCsv(String(c))).join(","))].join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="products-export.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
