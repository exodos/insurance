import { MembershipRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const ROLES_ALLOWED_TO_AUTH = new Set<MembershipRole>([
  MembershipRole.SUPERADMIN,
  MembershipRole.INSURER,
  MembershipRole.MEMBER,
  MembershipRole.BRANCHADMIN,
  MembershipRole.TRAFFICPOLICEADMIN,
  MembershipRole.TRAFFICPOLICEMEMBER,
  //   MembershipRole.USER,
]);

const legacyPrefixes = ["/admin", "/insurer", "/branch", "/police"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    if (
      req.nextUrl.pathname.startsWith("/") &&
      req.nextauth.token?.memberships?.role !== MembershipRole.SUPERADMIN
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    } else if (
      req.nextUrl.pathname.startsWith("/admin") &&
      req.nextauth.token?.memberships?.role !== MembershipRole.SUPERADMIN
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    } else if (
      req.nextUrl.pathname.startsWith("/insurer") &&
      req.nextauth.token?.memberships?.role !== MembershipRole.INSURER
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    } else if (
      req.nextUrl.pathname.startsWith("/branch") &&
      req.nextauth.token?.memberships?.role !==
        (MembershipRole.MEMBER || MembershipRole.BRANCHADMIN)
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    } else if (
      req.nextUrl.pathname.startsWith("/police/admin") &&
      req.nextauth.token?.memberships?.role !==
        MembershipRole.TRAFFICPOLICEADMIN
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    } else if (
      req.nextUrl.pathname.startsWith("/police/user") &&
      req.nextauth.token?.memberships?.role !==
        MembershipRole.TRAFFICPOLICEMEMBER
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      !pathname.endsWith("/") &&
      !pathname.match(/((?!\.well-known(?:\/.*)?)(?:[^/]+\/)*[^/]+\.\w+)/)
    ) {
      req.nextUrl.pathname += "/";
      return NextResponse.redirect(req.nextUrl);
    }
  },
  {
    callbacks: {
      authorized: ({ token }) =>
        token?.memberships.role !== undefined &&
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
  ],
};
