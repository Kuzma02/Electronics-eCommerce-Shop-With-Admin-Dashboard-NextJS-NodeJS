import { NextRequest, NextResponse } from "next/server";
import schema from "@/utils/schema";
import prisma from "@/utils/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}
