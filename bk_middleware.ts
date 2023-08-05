import { MembershipRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

const ROLES_ALLOWED_TO_AUTH = new Set<MembershipRole>([
  MembershipRole.SUPERADMIN,
  MembershipRole.INSURER,
  MembershipRole.BRANCHADMIN,
  MembershipRole.MEMBER,
  MembershipRole.TRAFFICPOLICEADMIN,
  MembershipRole.TRAFFICPOLICEMEMBER,
]);

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    if (
      req?.nextUrl?.pathname?.startsWith("/admin") &&
      req?.nextauth?.token?.memberships?.role !== MembershipRole.SUPERADMIN
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (
      req.nextUrl.pathname.startsWith("/insurer") &&
      req.nextauth.token?.memberships.role !== MembershipRole.INSURER
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (
      req.nextUrl.pathname.startsWith("/branch") &&
      req.nextauth.token?.memberships.role !==
        (MembershipRole.BRANCHADMIN && MembershipRole.MEMBER)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (
      req.nextUrl.pathname.startsWith("/police/admin") &&
      req.nextauth.token?.memberships.role !== MembershipRole.TRAFFICPOLICEADMIN
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (
      req.nextUrl.pathname.startsWith("/police/user") &&
      req.nextauth.token?.memberships.role !==
        MembershipRole.TRAFFICPOLICEMEMBER
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) =>
        token?.memberships?.role !== undefined &&
        ROLES_ALLOWED_TO_AUTH.has(token.memberships.role),
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/insurer/:path*",
    "/branch/:path*",
    "/police/:path*",
    // "/police/admin/:path*",
    // "/police/user/:path*",
  ],
};
