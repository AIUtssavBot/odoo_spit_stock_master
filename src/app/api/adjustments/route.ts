import { NextResponse } from "next/server";
import { createAdjustmentOperation } from "@/lib/data/provider";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const required = ["productId", "location", "countedQty"];
    for (const key of required) {
      if (body[key] === undefined || body[key] === null) {
        return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
      }
    }
    const result = await createAdjustmentOperation({
      productId: String(body.productId),
      location: String(body.location),
      countedQty: Number(body.countedQty),
      reason: body.reason ? String(body.reason) : undefined,
    });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}