import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/utils/db";

export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get project files from database
    const files = await prisma.projectfile.findMany({
      where: {
        projectId: params.projectId
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching project files:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { filename, originalname, path, mimetype, size } = body;

    // Create file record in database
    const file = await prisma.projectfile.create({
      data: {
        projectId: params.projectId,
        filename,
        originalname,
        path,
        mimetype,
        size,
      }
    });

    return NextResponse.json(file);
  } catch (error) {
    console.error("Error creating project file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 