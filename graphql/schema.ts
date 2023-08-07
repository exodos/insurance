import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./types";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "./permissions";

export const baseSchema = makeSchema({
  types,
  plugins: [],
  outputs: {
    typegen: join(process.cwd(), "generated/nexus-typegen.ts"),
    schema: join(process.cwd(), "generated/schema.graphql"),
  },
  contextType: {
    export: "Context",
    module: join(process.cwd(), "graphql", "context.ts"),
  },
});

export const schema = applyMiddleware(baseSchema, permissions);
