import { Prisma } from "@prisma/client";
import {
  arg,
  extendType,
  inputObjectType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { Sort } from "./User";

export const Policy = objectType({
  name: "Policy",
  definition(t) {
    t.string("id");
    t.string("policyNumber");
    t.date("policyStartDate");
    t.date("policyExpireDate");
    t.string("policyIssuedConditions");
    t.string("personsEntitledToUse");
    t.date("createdAt");
    t.date("updatedAt");
    t.field("certificates", {
      type: "Certificate",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.policy
          .findUnique({
            where: { id: _parent.id },
          })
          .certificates();
      },
    });
  },
});

export const PolicyPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedPolicy", {
      type: FeedPolicy,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(PolicyOrderByInput)) }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              policyNumber: args.filter,
            }
          : {};

        const policy = await ctx.prisma.policy.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.PolicyOrderByWithRelationInput>
            | undefined,
        });

        const totalPolicy = await ctx.prisma.policy.count({
          where,
        }); // 2
        const maxPage = Math.ceil(totalPolicy / args?.take);

        return {
          // 4
          policy,
          maxPage,
          totalPolicy,
        };
      },
    });
  },
});

export const policyByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("policyByID", {
      type: Policy,
      args: { id: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.policy.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const policyByPolicyNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("policyByPolicyNumber", {
      type: Policy,
      args: { policyNumber: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.policy.findFirst({
          where: {
            policyNumber: args.policyNumber,
          },
        });
      },
    });
  },
});

export const createPolicyMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createPolicy", {
      type: Policy,
      args: {
        input: nonNull(PolicyCreateInput),
      },
      resolve: async (_parent, args, ctx) => {
        // const user = await ctx.prisma.user.findUnique({
        //   where: {
        //     email: ctx.session.user.email,
        //   },
        // });
        // if (
        //   !user ||
        //   (user.roleName !== "SUPERADMIN" && user.roleName !== "ADMIN")
        // ) {
        //   throw new Error(`You do not have permission to perform action`);
        // }
        return await ctx.prisma.policy.create({
          data: {
            // ...args.input,
            policyNumber: args.input.policyNumber,
            policyStartDate: args.input.policyStartDate,
            policyExpireDate: args.input.policyExpireDate,
            policyIssuedConditions: args.input.policyIssuedConditions,
            personsEntitledToUse: args.input.personsEntitledToUse,
          },
        });
      },
    });
  },
});

export const updatePolicyMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updatePolicy", {
      type: Policy,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(PolicyUpdateInput),
      },
      resolve: async (_parent, args, ctx) => {
        // const user = await ctx.prisma.user.findUnique({
        //   where: {
        //     email: ctx.session.user.email,
        //   },
        // });
        // if (
        //   !user ||
        //   (user.roleName !== "SUPERADMIN" && user.roleName !== "ADMIN")
        // ) {
        //   throw new Error(`You do not have permission to perform action`);
        // }
        return await ctx.prisma.policy.update({
          where: { id: args.id },
          data: {
            ...args.input,
          },
        });
      },
    });
  },
});

export const deletePolicyMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deletePolicy", {
      type: Policy,
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        // const user = await ctx.prisma.user.findUnique({
        //   where: {
        //     email: ctx.session.user.email,
        //   },
        // });
        // if (!user || user.roleName !== "SUPERADMIN") {
        //   throw new Error(`You do not have permission to perform action`);
        // }

        return await ctx.prisma.policy.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const FeedPolicy = objectType({
  name: "FeedPolicy",
  definition(t) {
    t.nonNull.list.nonNull.field("policy", { type: Policy }); // 1
    t.nonNull.int("totalPolicy"); // 2
    t.int("maxPage");
  },
});

export const PolicyOrderByInput = inputObjectType({
  name: "PolicyOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});

export const PolicyCreateInput = inputObjectType({
  name: "PolicyCreateInput",
  definition(t) {
    t.string("policyNumber");
    t.date("policyStartDate");
    t.date("policyExpireDate");
    t.string("policyIssuedConditions");
    t.string("personsEntitledToUse");
    // t.field("thirdPartyLog", { type: thirdPartyLogCreateInput });
  },
});

export const PolicyUpdateInput = inputObjectType({
  name: "PolicyUpdateInput",
  definition(t) {
    // t.string("policyNumber");
    t.date("policyStartDate");
    t.date("policyExpireDate");
    t.string("policyIssuedConditions");
    t.string("personsEntitledToUse");
    // t.nonNull.field("thirdPartyLog", { type: thirdPartyLogEditInput });
  },
});

export const policyConnectInput = inputObjectType({
  name: "policyConnectInput",
  definition(t) {
    t.string("policyNumber");
  },
});

export const policyCreateInput = inputObjectType({
  name: "policyCreateInput",
  definition(t) {
    t.date("policyStartDate");
    t.string("policyIssuedConditions");
    t.string("personsEntitledToUse");
  },
});

export const policyInsuranceCreateInput = inputObjectType({
  name: "policyInsuranceCreateInput",
  definition(t) {
    t.date("policyStartDate");
    t.string("policyIssuedConditions");
    t.string("personsEntitledToUse");
  },
});

export const policyUpdateInput = inputObjectType({
  name: "policyUpdateInput",
  definition(t) {
    t.date("policyStartDate");
    t.string("policyIssuedConditions");
    t.string("personsEntitledToUse");
  },
});
