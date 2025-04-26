import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/utils/db";

export async function PUT(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = await request.json();
    if (!name || typeof name !== "string") {
      return new NextResponse("Invalid project name", { status: 400 });
    }

    const project = await prisma.Project.update({
      where: {
        id: params.projectId,
        contractorId: session.user.id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First delete all project products associated with this project
    await prisma.ProjectProduct.deleteMany({
      where: {
        projectId: params.projectId,
      },
    });

    // Then delete the project itself
    await prisma.Project.delete({
      where: {
        id: params.projectId,
        contractorId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 