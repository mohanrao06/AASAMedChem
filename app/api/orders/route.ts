import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const product = await prisma.product.findUnique({
    where: {
      id: body.productId,
    },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  // convert ordered quantity to product's base unit before calculating price
  function toBaseQuantity(qty: number, unit: string) {
    const u = (unit || "G").toUpperCase();
    switch (u) {
      case "KG":
        return qty * 1000;
      case "G":
        return qty;
      case "L":
        return qty * 1000;
      case "ML":
        return qty;
      case "UNIT":
        return qty;
      default:
        return qty;
    }
  }

  const convertedQty = toBaseQuantity(Number(body.quantity), body.unit || product.baseUnit);

  const totalAmount = Number(product.pricePerUnit) * Number(convertedQty);

  const order = await prisma.order.create({
    data: {
      buyerId: body.buyerId,
      totalAmount,

      items: {
        create: [
          {
            productId: product.id,
            orderedQuantity: body.quantity,
            orderedUnit: body.unit,
            convertedBaseQuantity: convertedQty,
            price: totalAmount,
          },
        ],
      },
    },
    include: {
      items: true,
    },
  });

  return NextResponse.json(order);
}