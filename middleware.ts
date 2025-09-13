import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Additional server-side check for admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (req.nextauth.token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin routes only if user is authenticated and has admin role
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
