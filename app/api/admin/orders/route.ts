import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      buyer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json(orders);
}