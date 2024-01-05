import { authMiddleware } from "@clerk/nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
	publicRoutes: ["/"],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// export function middleware(request: NextRequest) {
// 	return NextResponse.rewrite(new URL("/checkout-sessions", request.url));
// }
