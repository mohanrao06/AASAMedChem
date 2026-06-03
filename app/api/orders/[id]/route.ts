import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

function toBaseQuantity(qty: number, unit: string) {
  const u = (unit || 'G').toUpperCase();
  switch (u) {
    case 'KG':
      return qty * 1000;
    case 'G':
      return qty;
    case 'L':
      return qty * 1000;
    case 'ML':
      return qty;
    case 'UNIT':
      return qty;
    default:
      return qty;
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const url = new URL(req.url);
    const sellerId = url.searchParams.get('sellerId');
    const orderId = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '');

    if (!sellerId) {
      return NextResponse.json({ error: 'sellerId required' }, { status: 400 });
    }

    if (!orderId) {
      return NextResponse.json({ error: 'order id required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const hasSellerItem = order.items.some((it) => it.product.sellerId === sellerId);
    if (!hasSellerItem) {
      return NextResponse.json({ error: 'Not authorized to delete this order' }, { status: 403 });
    }

    await prisma.order.delete({ where: { id: orderId } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, context: any) {
  try {
    const url = new URL(req.url);
    const orderId = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '');
    const body = await req.json();
    const sellerId = body.sellerId;
    const updates = body.updates || [];

    if (!sellerId) return NextResponse.json({ error: 'sellerId required' }, { status: 400 });
    if (!orderId) return NextResponse.json({ error: 'order id required' }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // ensure seller is authorized to modify items
    const sellerItemIds = order.items.filter((it) => it.product.sellerId === sellerId).map((i) => i.id);
    if (sellerItemIds.length === 0) return NextResponse.json({ error: 'No items for seller in this order' }, { status: 403 });

    // apply updates to items that belong to seller
    for (const u of updates) {
      if (!sellerItemIds.includes(u.itemId)) continue;

      const qty = Number(u.orderedQuantity);
      const unit = u.orderedUnit || 'G';
      const converted = toBaseQuantity(qty, unit);

      // fetch product pricePerUnit
      const item = order.items.find((it) => it.id === u.itemId);
      if (!item) continue;

      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) continue;

      const price = Number(product.pricePerUnit) * Number(converted);

      await prisma.orderItem.update({
        where: { id: u.itemId },
        data: {
          orderedQuantity: String(qty),
          orderedUnit: unit,
          convertedBaseQuantity: String(converted),
          price: String(price),
        },
      });
    }

    // recompute order total
    const items = await prisma.orderItem.findMany({ where: { orderId } });
    const total = items.reduce((s, it) => s + Number(it.price), 0);

    await prisma.order.update({ where: { id: orderId }, data: { totalAmount: String(total) } });

    const updated = await prisma.order.findUnique({ where: { id: orderId }, include: { items: { include: { product: true } }, buyer: true } });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
