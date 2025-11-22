import { NextResponse } from "next/server";
import { createProduct } from "@/lib/data/provider";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const required = ["name", "sku", "min_stock_level", "initial_stock", "cost"];
    for (const key of required) {
      if (body[key] === undefined || body[key] === null) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
      }
    }
    const result = await createProduct({
      name: String(body.name),
      sku: String(body.sku),
      category: body.category ?? null,
      uom: body.uom ?? null,
      min_stock_level: Number(body.min_stock_level) || 0,
      initial_stock: Number(body.initial_stock) || 0,
      cost: Number(body.cost) || 0,
    });
    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}