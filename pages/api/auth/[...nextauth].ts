import NextAuth, { NextAuthOptions } from "next-auth";
import { prisma } from "../../../lib/prisma";
import { verifyPassword } from "../../../lib/auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
          include: {
            memberships: {
              include: {
                branchs: true,
              },
            },
          },
        });
        if (!user) {
          return null;
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (isValid) {
          return user;
        } else {
          console.log("Hash Not Matched To Logging In");
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    jwt: async ({ token, user }) => {
      return { ...token, ...user };
    },
    session: async ({ session, token, user }) => {
      return { ...session, user: token };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

export default NextAuth(authOptions);
