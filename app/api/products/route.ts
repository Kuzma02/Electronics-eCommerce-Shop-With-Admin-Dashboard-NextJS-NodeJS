import { NextResponse } from "next/server";
import prisma from "@/utils/db";

// GET /api/products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        inStock: true,
      },
      where: {
        inStock: {
          gt: 0
        }
      },
      orderBy: {
        title: 'asc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 