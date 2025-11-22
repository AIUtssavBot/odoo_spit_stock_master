import { NextResponse } from "next/server";
import { validateOperation } from "@/lib/data/provider";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing operation id" }, { status: 400 });
    }
    const result = await validateOperation(id);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error || "Validation failed" }, { status: 400 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}