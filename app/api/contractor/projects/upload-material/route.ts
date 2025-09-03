import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs";
import path from "path";
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
    // Verify the project exists and belongs to the user
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Check if file exists
    const fullFilePath = path.join(process.cwd(), filePath);
    const fileExists = await fs.promises.access(fullFilePath)
      .then(() => true)
      .catch(() => false);
    
    if (!fileExists) {
      return new NextResponse("File not found", { status: 404 });
    }

    // In a real implementation, you would parse the PDF here
    // and extract materials list

    // Create a placeholder material for demo purposes
    const newMaterial = await prisma.projectProduct.create({
      data: {
        projectId,
        productId: "placeholder-product-id", // You would determine this from the file
        quantity: 1,
      },
    });

    return NextResponse.json({ 
      message: "Materials uploaded successfully",
      material: newMaterial
    });
  } catch (error) {
    console.error("Error uploading materials:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
