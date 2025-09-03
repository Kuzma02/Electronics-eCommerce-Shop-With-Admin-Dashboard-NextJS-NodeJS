import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("uploadedFile") as File;
  const projectId = formData.get("projectId") as string;

  if (!file) {
    return new NextResponse("No file uploaded", { status: 400 });
  }

  if (!projectId) {
    return new NextResponse("Project ID is required", { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return new NextResponse("Only PDF files are allowed", { status: 400 });
  }

  const uniqueFileName = `${uuidv4()}-${file.name}`;
  
  // Create project-specific directory
  const projectUploadPath = path.join(
    process.cwd(),
    "server",
    "uploads",
    projectId
  );

  await fs.mkdir(projectUploadPath, { recursive: true });

  const uploadPath = path.join(projectUploadPath, uniqueFileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(uploadPath, Uint8Array.from(buffer));

  return NextResponse.json({ 
    filePath: `uploads/${projectId}/${uniqueFileName}`,
    fileName: uniqueFileName,
    originalName: file.name,
    size: buffer.length,
    mimeType: file.type
  });
}
