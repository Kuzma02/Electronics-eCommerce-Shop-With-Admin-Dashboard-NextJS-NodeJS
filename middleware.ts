import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check for admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (req.nextauth.token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Admin routes require admin token
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return !!token && token.role === "admin";
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"]
};
