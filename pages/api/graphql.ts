import { ApolloServer } from "apollo-server-micro";
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import { createContext } from "../../graphql/context";
import { schema } from "../../graphql/schema";
import Cors from "micro-cors";

const cors = Cors();

// const IS_DEV = process.env.NODE_ENV === "development";
// const localOrigins = [/^http:\/\/localhost:\d{4}$/];
// const prodOrigins = [/^https:\/\/.*\.insurancefund.gov\.et$/];

const apolloServer = new ApolloServer({
  schema,
  context: createContext,
  persistedQueries: false,
  introspection: process.env.NODE_ENV !== "production",
});

const startServer = apolloServer.start();

export default cors(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
});

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://studio.apollographql.com"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   if (req.method === "OPTIONS") {
//     res.end();
//     return false;
//   }
//   await startServer;
//   await apolloServer.createHandler({
//     path: "/api/graphql",
//   })(req, res);
// };

// export default handler;

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
