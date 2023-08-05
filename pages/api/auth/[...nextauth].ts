import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { baseUrl } from "@/lib/config";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        mobileNumber: { label: "mobileNumber", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _) {
        if (!credentials?.mobileNumber || !credentials?.password) {
          throw new Error("Wrong credentials!!");
        }
        const response = await fetch(baseUrl + `/api/user`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const user = await response.json();
        console.log("🚀 ~ file: [...nextauth].ts:23 ~ authorize ~ user:", user);

        if (response.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      return url.startsWith(baseUrl) ? baseUrl : url;
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

// export default NextAuth(authOptions);

const authHandler = NextAuth(authOptions);

export default async function handler(...params: any[]) {
  await authHandler(...params);
}
