// *********************
// Role: Bulk Cart Operations API Route
// Purpose: Handles bulk operations for the shopping cart
// Endpoints:
// - POST: Adds all materials from a project to the cart
// Features:
// - Fetches all products from a project
// - Replaces current cart contents with project materials
// - Maintains quantities from project specifications
// Security: Requires authenticated session
// *********************

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Type declaration for global cart storage
declare global {
  var cartItems: { [key: string]: Array<{ productId: string; quantity: number }> };
}

// Initialize global cart storage if not exists
if (!global.cartItems) {
  global.cartItems = {};
}

// POST handler: Add all project materials to cart
export async function POST(request: Request) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse request body for project ID
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return new NextResponse("Project ID is required", { status: 400 });
    }

    // Fetch all products associated with the project
    const projectProducts = await prisma.projectProduct.findMany({
      where: {
        projectId: projectId
      },
      include: {
        product: true
      }
    });

    if (!projectProducts.length) {
      return new NextResponse("Project has no products", { status: 400 });
    }

    // Ensure cart storage is initialized
    if (!global.cartItems) {
      global.cartItems = {};
    }

    // Initialize or clear user's cart
    const userEmail = session.user.email as string;
    if (!global.cartItems[userEmail]) {
      global.cartItems[userEmail] = [];
    }

    // Transform project products to cart format
    const cartItems = projectProducts.map(pp => ({
      productId: pp.productId,
      quantity: pp.quantity
    }));

    // Replace current cart contents with project materials
    global.cartItems[userEmail] = cartItems;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CART_BULK_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 