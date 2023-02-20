import { useSession } from "next-auth/react";
import { hash, compare } from "bcryptjs";

type GetUser = {
  userId: string;
};

const hashPassword = async (password: any) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

const verifyPassword = async (password: any, hashedPassword: any) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};

export { hashPassword, verifyPassword };
