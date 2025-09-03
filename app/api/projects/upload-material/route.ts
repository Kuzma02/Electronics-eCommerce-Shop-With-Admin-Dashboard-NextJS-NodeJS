import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs";
import path from "path";
import prisma from "@/utils/db";

export async function POST(request: Request) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse request body
    const { projectId, filePath } = await request.json();

    if (!projectId || !filePath) {
      return new NextResponse("Project ID and file path are required", {
        status: 400,
      });
    }

    // Verify the project exists
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

    // Create a placeholder material for demo purposes
    const newMaterial = await prisma.projectProduct.create({
      data: {
        projectId,
        productId: "default-product-id", // Use a default product ID
        quantity: 1,
      },
      include: {
        product: true,
      },
    });

    // Update the project's item count
    await prisma.project.update({
      where: { id: projectId },
      data: { itemCount: { increment: 1 } },
    });

    return NextResponse.json({ 
      message: "Materials uploaded successfully",
      material: {
        id: newMaterial.id,
        name: newMaterial.product.title,
        description: newMaterial.product.description,
        quantity: newMaterial.quantity,
        unit: "piece",
        productId: newMaterial.product.id
      }
    });
  } catch (error) {
    console.error("Error uploading material from file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 