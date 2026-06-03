import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const ordersCount = await prisma.order.count();
  const ordersSum = await prisma.order.aggregate({
    _sum: { totalAmount: true },
  });

  return NextResponse.json({
    buyers: await prisma.user.count({ where: { role: "BUYER" } }),
    sellers: await prisma.user.count({ where: { role: "SELLER" } }),
    products: await prisma.product.count(),
    orders: ordersCount,
    totalOrderValue: ordersSum._sum.totalAmount || 0,
  });
}