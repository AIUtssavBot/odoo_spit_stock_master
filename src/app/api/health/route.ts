import { NextResponse } from "next/server";
import { listProducts } from "@/lib/data/provider";

export async function GET() {
  try {
    const products = await listProducts("");
    const sampleCount = products.length > 0 ? 1 : 0;
    return NextResponse.json({ ok: true, sampleCount });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}