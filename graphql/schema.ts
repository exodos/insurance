// import { connectionPlugin, makeSchema } from "nexus";
// import { join } from "path";
// import * as types from "./types";
// import { nexusShield, allow } from "nexus-shield";
// import { ForbiddenError } from "apollo-server-micro";

// export const schema = makeSchema({
//   plugins: [
//     connectionPlugin(),
//     nexusShield({
//       defaultError: new ForbiddenError("Not allowed"),
//       defaultRule: allow,
//     }),
//   ],
//   types,
//   outputs: {
//     typegen: join(process.cwd(), "generated/nexus-typegen.ts"),
//     schema: join(process.cwd(), "generated/schema.graphql"),
//   },
// });

import { fieldAuthorizePlugin, makeSchema } from "nexus";
import { join, resolve } from "path";
import * as types from "./types";
import { ForbiddenError } from "apollo-server-micro";

export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(process.cwd(), "generated/nexus-typegen.ts"),
    schema: join(process.cwd(), "generated/schema.graphql"),
  },
  contextType: {
    export: "Context",
    module: join(process.cwd(), "graphql", "context.ts"),
  },
});
