// *********************
// Role: Cart API Route Handler
// Purpose: Manages shopping cart operations
// Endpoints:
// - GET: Retrieves all items in the user's cart with product details
// - POST: Adds a new item to the cart
// - DELETE: Clears the user's cart
// Storage: Uses global server-side storage keyed by user email
// Security: Requires authenticated session
// *********************

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/utils/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET handler: Retrieve cart items with product details
export async function GET() {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get cart items from session storage
    const cartItems = global.cartItems?.[session.user?.email as string] || [];
    
    // Fetch full product details for all cart items
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: cartItems.map(item => item.productId)
        }
      }
    });

    // Combine cart quantities with product details
    const cartWithDetails = cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product
      };
    });

    return NextResponse.json(cartWithDetails);
  } catch (error) {
    console.error("[CART_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST handler: Add new item to cart
export async function POST(request: Request) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse request body for product details
    const body = await request.json();
    const { productId, quantity } = body;

    // Initialize global cart storage if needed
    if (!global.cartItems) {
      global.cartItems = {};
    }

    // Initialize user's cart array if needed
    const userEmail = session.user?.email as string;
    if (!global.cartItems[userEmail]) {
      global.cartItems[userEmail] = [];
    }

    // Add new item to user's cart
    global.cartItems[userEmail].push({ productId, quantity });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CART_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE handler: Clear all items from cart
export async function DELETE() {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Reset user's cart to empty array
    const userEmail = session.user?.email as string;
    if (global.cartItems?.[userEmail]) {
      global.cartItems[userEmail] = [];
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[CART_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 