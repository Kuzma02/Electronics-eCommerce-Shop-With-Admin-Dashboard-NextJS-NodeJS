import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST handler: Recalculate project item count
export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
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
      include: {
        products: true,
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // Count the actual number of materials
    const actualCount = project.products.length;

    // Update the project with the correct count
    const updatedProject = await prisma.project.update({
      where: {
        id: params.projectId,
      },
      data: {
        itemCount: actualCount,
      },
    });

    return NextResponse.json({ itemCount: updatedProject.itemCount });
  } catch (error) {
    console.error("[PROJECT_RECALCULATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 