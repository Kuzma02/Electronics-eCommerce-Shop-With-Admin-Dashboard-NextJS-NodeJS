import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const uploadDir = path.join(process.cwd(), "server", "uploads");

  try {
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
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
