import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/server/utills/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { contractorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, filePaths } = await req.json();

    // Create project using backend API
    const projectResponse = await fetch("http://localhost:3001/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        contractorId: session.user.id,
      }),
    });

    if (!projectResponse.ok) {
      throw new Error("Failed to create project");
    }

    const project = await projectResponse.json();

    // If there are files, move them from temp to project directory
    if (filePaths && filePaths.length > 0) {
      // Create project directory
      const projectDir = path.join(process.cwd(), "server", "uploads", project.id);
      await fs.mkdir(projectDir, { recursive: true });

      // Move each file and create file records
      for (const tempPath of filePaths) {
        const fileName = path.basename(tempPath);
        const sourcePath = path.join(process.cwd(), "server", tempPath);
        const targetPath = path.join(projectDir, fileName);

        // Move file from temp to project directory
        await fs.rename(sourcePath, targetPath);

        // Create file record in database
        await fetch(`http://localhost:3001/api/projects/${project.id}/files`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: fileName,
            originalname: fileName.substring(37), // Remove UUID prefix
            path: `uploads/${project.id}/${fileName}`,
            mimetype: "application/pdf",
            size: (await fs.stat(targetPath)).size,
          }),
        });
      }
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
} 