import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "server", "uploads");
    await fs.promises.mkdir(uploadDir, { recursive: true });
    
    // Check if directory exists before reading
    const dirExists = await fs.promises.access(uploadDir)
      .then(() => true)
      .catch(() => false);
    
    if (!dirExists) {
      return NextResponse.json([]);
    }
    
    // Read the directory
    const files = await fs.promises.readdir(uploadDir);
    
    // Filter for PDF files
    const pdfFiles = files
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => ({
        name: file,
        path: `uploads/${file}`,
      }));

    return NextResponse.json(pdfFiles);
  } catch (error) {
    console.error("Error fetching uploaded files:", error);
    return NextResponse.json([]); // Return empty array instead of error
  }
} 