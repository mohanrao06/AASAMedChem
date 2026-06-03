import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, context: any) {
  let id: string | undefined;
  try {
    if (context && context.params) {
      if (typeof context.params.then === 'function') {
        const p = await context.params;
        id = p?.id;
      } else {
        id = context.params.id;
      }
    }
  } catch (e) {
    // ignore
  }

  if (!id) {
    try {
      const url = new URL(req.url);
      id = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '');
    } catch (e) {}
  }

  if (!id) return NextResponse.json({ error: 'product id required' }, { status: 400 });

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}