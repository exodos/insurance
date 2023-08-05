import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { applyMiddleware, getRateLimitMiddlewares } from "@/login-middleware";
import { changePhone } from "@/lib/config";

const middlewares = getRateLimitMiddlewares({ limit: 10 }).map(applyMiddleware);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { mobileNumber, password } = req.body;

  try {
    await Promise.all(middlewares.map((middleware) => middleware(req, res)));
    const checkUser = await prisma.user.findFirst({
      where: {
        mobileNumber: changePhone(mobileNumber),
      },
      include: {
        memberships: {
          include: {
            branchs: true,
          },
        },
      },
    });

    if (!checkUser || !(await verifyPassword(password, checkUser.password))) {
      // res.status(404).json("Wrong credentials!!");

      res.status(500).end("Wrong credentials!!");
    } else {
      // res.status(200).json(checkUser);
      res.send(checkUser);
    }
  } catch {
    // return res.status(429).send("Too Many Requests");

    res.status(500).end("Too Many Requests");
  }
};

export default handler;
