import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { status } = await req.json();
  const { id } = await params;

  const order = await prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });

  return NextResponse.json(order);
}