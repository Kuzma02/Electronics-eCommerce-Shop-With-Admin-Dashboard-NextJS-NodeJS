import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/utils/db";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";

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
    const files = await prisma.ProjectFile.findMany({
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

    const formData = await request.formData();
    const file = formData.get("files") as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return new NextResponse("Only PDF files are allowed", { status: 400 });
    }

    // Create unique filename
    const uniqueFileName = `${Date.now()}-${file.name}`;
    
    // Create project-specific directory
    const projectUploadPath = path.join(
      process.cwd(),
      "server",
      "uploads",
      params.projectId
    );

    await fs.mkdir(projectUploadPath, { recursive: true });

    // Save file to disk
    const filePath = path.join('uploads', params.projectId, uniqueFileName);
    const fullPath = path.join(process.cwd(), 'server', filePath);
    const buffer = await file.arrayBuffer();
    await fs.writeFile(fullPath, new Uint8Array(buffer));

    // Create file record in database
    const projectFile = await prisma.ProjectFile.create({
      data: {
        projectId: params.projectId,
        filename: uniqueFileName,
        originalname: file.name,
        mimetype: file.type,
        size: buffer.byteLength,
        path: filePath,
      }
    });

    return NextResponse.json(projectFile);
  } catch (error) {
    console.error("Error creating project file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 