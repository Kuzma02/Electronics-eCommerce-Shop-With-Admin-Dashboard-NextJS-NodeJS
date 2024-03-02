import { NextRequest, NextResponse } from "next/server";
import schema from "@/utils/schema";
import prisma from "@/utils/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const images = await prisma.image.findMany({
    where: { productID: params.productId },
  });
  if (!images) {
    return NextResponse.json({ error: "Images not found" }, { status: 404 });
  }
  return NextResponse.json(images);
}
