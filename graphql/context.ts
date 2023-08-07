import { NextApiRequest } from "next";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { getSession } from "next-auth/react";
import { Session } from "next-auth";

export type Context = {
  session: Session;
  prisma: PrismaClient;
};

export const createContext = async ({
  req,
}: {
  req: NextApiRequest;
}): Promise<Context> => {
  const session = await getSession({ req });

  return { prisma, session };
};
