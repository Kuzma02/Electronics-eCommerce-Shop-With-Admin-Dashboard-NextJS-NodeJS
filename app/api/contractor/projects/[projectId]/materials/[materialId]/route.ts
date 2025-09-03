import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/utils/db";

// PUT handler: Update a material
export async function PUT(
  request: Request,
  { params }: { params: { projectId: string; materialId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First verify that the project exists
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Parse the request body
    const body = await request.json();
    const { quantity } = body;

    const projectProduct = await prisma.projectProduct.update({
      where: {
        id: params.materialId,
        projectId: params.projectId,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    });

    // Transform to match expected format
    const material = {
      id: projectProduct.id,
      name: projectProduct.product.title,
      description: projectProduct.product.description,
      quantity: projectProduct.quantity,
      unit: "piece",
      productId: projectProduct.product.id
    };

    return NextResponse.json(material);
  } catch (error) {
    console.error("[MATERIALS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE handler: Delete a material
export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string; materialId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First verify that the project exists and get current itemCount
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      prisma.projectProduct.delete({
        where: {
          id: params.materialId,
          projectId: params.projectId,
        },
      }),
      prisma.project.update({
        where: {
          id: params.projectId,
        },
        data: {
          // Ensure itemCount never goes below 0
          itemCount: Math.max(0, (project.itemCount || 0) - 1),
        },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[MATERIALS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 