import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/server/utills/db";

interface Material {
  productId: string;
  quantity: number;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { projectId, filePath } = await req.json();

  if (!projectId || !filePath) {
    return new NextResponse("Project ID and file path are required", {
      status: 400,
    });
  }

  try {
    const materials: Material[] = [];

    for (const material of materials) {
      await prisma.projectProduct.create({
        data: {
          projectId: projectId,
          productId: material.productId,
          quantity: material.quantity,
        },
      });
    }

    return NextResponse.json({ message: "Materials uploaded successfully" });
  } catch (error) {
    console.error("Error uploading materials:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
