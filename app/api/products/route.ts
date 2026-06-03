import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      seller: true,
    },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();


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

  function toBasePrice(pricePerUnit: number, unit: string) {
    const u = (unit || "G").toUpperCase();
    switch (u) {
      case "KG":
        return pricePerUnit / 1000; 
      case "G":
        return pricePerUnit;
      case "L":
        return pricePerUnit / 1000; 
      case "ML":
        return pricePerUnit;
      case "UNIT":
        return pricePerUnit;
      default:
        return pricePerUnit;
    }
  }

  const stockBase = toBaseQuantity(Number(body.stockQuantity), body.baseUnit);
  const priceBase = toBasePrice(Number(body.pricePerUnit), body.baseUnit);

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      sku: body.sku,
      dimension: body.dimension,
      baseUnit: body.baseUnit,
      stockQuantity: stockBase,
      pricePerUnit: priceBase,
      sellerId: body.sellerId,
    },
  });

  return NextResponse.json(product);
}