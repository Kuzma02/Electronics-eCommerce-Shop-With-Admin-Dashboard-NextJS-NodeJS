// *********************
// Role: Materials API Route Handler
// Purpose: Manages materials for a specific project
// Endpoints:
// - GET: Retrieves all materials for a project
// - POST: Adds a new material to a project
// Security: Requires authenticated session
// *********************

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/utils/db";

// Helper function to ensure image URL is absolute
function getAbsoluteImageUrl(imagePath: string | null) {
  // Use placeholder if image path is missing or empty
  if (!imagePath) {
    return 'https://placehold.co/400x400?text=Product';
  }
  if (imagePath.startsWith('http')) return imagePath;
  // For relative paths, first ensure they start with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${normalizedPath}`;
}

type ProjectProductWithProduct = {
  id: string;
  quantity: number;
  projectId: string;
  productId: string;
  product: {
    title: string;
    description: string;
    id: string;
    price: number;
    mainImage: string;
  };
}

// GET handler: Fetch all materials for a project
export async function GET(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch materials with associated product data
    const materials = await prisma.projectProduct.findMany({
      where: {
        projectId: params.projectId,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            mainImage: true,
            description: true,
          },
        },
      },
    });

    // Transform the data to include name property
    const transformedMaterials = materials.map((material: any) => ({
      ...material,
      name: material.product?.title || "Unknown Material",
      unit: "piece", // Default unit
    }));

    return NextResponse.json(transformedMaterials);
  } catch (error) {
    console.error("Error fetching materials:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST handler: Add a new material to a project
export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { productId, quantity } = body;

    // Validate required fields
    if (!productId || !quantity) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Create new project product entry
    const material = await prisma.projectProduct.create({
      data: {
        projectId: params.projectId,
        productId,
        quantity,
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            mainImage: true,
            description: true,
          },
        },
      },
    });

    // Add name property to response
    const transformedMaterial = {
      ...material,
      name: material.product.title,
      unit: "piece",
    };

    return NextResponse.json(transformedMaterial);
  } catch (error) {
    console.error("Error creating material:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}