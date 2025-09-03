import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const uploadDir = path.join(process.cwd(), "server", "uploads");

  try {
    // Create the uploads directory if it doesn't exist
    await fs.promises.mkdir(uploadDir, { recursive: true });
    
    // Check if directory exists before reading
    const dirExists = await fs.promises.access(uploadDir)
      .then(() => true)
      .catch(() => false);
    
    if (!dirExists) {
      return NextResponse.json([]);
    }
    
    const files = await fs.promises.readdir(uploadDir);
    const pdfFiles = files
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => ({
        name: file,
        path: `uploads/${file}`,
      }));

    return NextResponse.json(pdfFiles);
  } catch (error) {
    console.error("Error reading upload directory:", error);
    // Return empty array instead of error when directory doesn't exist or can't be read
    return NextResponse.json([]);
  }
}
