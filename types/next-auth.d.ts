import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { MembershipRole, Membership, USER_TYPE } from "@prisma/client";

declare module "next-auth/jwt" {
  interface JWT {
    memberships: {
      role: MembershipRole;
    };
  }
}
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      mobileNumber: string;
      adminRestPassword: boolean;
      userType: USER_TYPE;
      memberships: {
        role: MembershipRole;
      };
    } & DefaultSession["user"];
  }

  interface User {
    memberships: {
      role: MembershipRole;
    };
  }
}
