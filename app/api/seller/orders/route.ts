import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sellerId = url.searchParams.get('sellerId');

  if (!sellerId) {
    return NextResponse.json({ error: 'sellerId is required' }, { status: 400 });
  }

  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            sellerId: sellerId,
          },
        },
      },
    },
    include: {
      buyer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}
