import { organizationConnectInput } from "./Organization";
import { Prisma } from "@prisma/client";
import {
  arg,
  enumType,
  extendType,
  floatArg,
  inputObjectType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { ClaimOrderByInput } from "./Claim";
import { branchConnectInput } from "./Branch";

export const ClaimUnInsured = objectType({
  name: "ClaimUnInsured",
  definition(t) {
    t.string("id");
    t.string("claimNumber");
    t.float("damageEstimate");
    t.string("vehiclePlateNumber");
    t.date("claimedAt");
    t.date("updatedAt");
    t.field("unInsuredPoliceReports", {
      type: "UnInsuredPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.claimUnInsured
          .findUnique({
            where: { id: _parent.id },
          })
          .unInsuredPoliceReports();
      },
    });
    t.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.claimUnInsured
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
  },
});

export const claimUnInsuredPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedClaimUnInsured", {
      type: FeedClaimUnInsured,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(ClaimOrderByInput)) }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              claimNumber: args.filter,
            }
          : {};

        const claimUnInsured = await ctx.prisma.claimUnInsured.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.ClaimOrderByWithRelationInput>
            | undefined,
        });

        const totalClaimUnInsured = await ctx.prisma.claimUnInsured.count({
          where,
        });
        const maxPage = Math.ceil(totalClaimUnInsured / args?.take);

        return {
          claimUnInsured,
          maxPage,
          totalClaimUnInsured,
        };
      },
    });
  },
});

export const claimUnInsuredByPolicePagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedClaimUnInsuredByPoliceBranch", {
      type: FeedClaimUnInsuredByPoliceBranch,
      args: {
        branchId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(ClaimOrderByInput)) }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              unInsuredPoliceReports: {
                policeBranch: {
                  id: args.branchId,
                },
              },
              claimNumber: args.filter,
            }
          : {
              unInsuredPoliceReports: {
                policeBranch: {
                  id: args.branchId,
                },
              },
            };

        const claimUnInsured = await ctx.prisma.claimUnInsured.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.ClaimOrderByWithRelationInput>
            | undefined,
        });

        const totalClaimUnInsured = await ctx.prisma.claimUnInsured.count({
          where,
        });
        const maxPage = Math.ceil(totalClaimUnInsured / args?.take);

        return {
          claimUnInsured,
          maxPage,
          totalClaimUnInsured,
        };
      },
    });
  },
});

export const claimUnInsuredByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("claimUnInsuredByID", {
      type: ClaimUnInsured,
      args: { id: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.claimUnInsured.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const claimUnInsuredByClaimNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("claimUnInsuredByClaimNumber", {
      type: ClaimUnInsured,
      args: { claimNumber: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.claimUnInsured.findUnique({
          where: {
            claimNumber: args.claimNumber,
          },
        });
      },
    });
  },
});

export const updateUnInsuredClaimMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateUnInsuredClaim", {
      type: ClaimUnInsured,
      args: {
        id: nonNull(stringArg()),
        damageEstimate: nonNull(floatArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.session.user.email,
          },
          include: {
            memberships: true,
          },
        });
        if (
          !user ||
          (user.memberships.role !== "SUPERADMIN" &&
            user.memberships.role !== "TRAFFICPOLICEADMIN" &&
            user.memberships.role !== "TRAFFICPOLICEMEMBER")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.claimUnInsured.update({
          where: { id: args.id },
          data: {
            damageEstimate: args.damageEstimate,
          },
        });
      },
    });
  },
});

export const exportUnInsuredClaimRunQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportUnInsuredClaim", {
      type: ClaimUnInsured,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.claimUnInsured.findMany({
          where: {
            updatedAt: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      },
    });
  },
});

export const exportUnInsuredClaimInsurerQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportUnInsuredClaimInsurer", {
      type: ClaimUnInsured,
      args: {
        orgId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.claimUnInsured.findMany({
          where: {
            branchs: {
              orgId: args.orgId,
            },
            updatedAt: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      },
    });
  },
});

export const exportUnInsuredClaimBranchQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportUnInsuredClaimBranch", {
      type: ClaimUnInsured,
      args: {
        branchId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.claimUnInsured.findMany({
          where: {
            branchId: args.branchId,
            updatedAt: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      },
    });
  },
});

export const FeedClaimUnInsured = objectType({
  name: "FeedClaimUnInsured",
  definition(t) {
    t.nonNull.list.nonNull.field("claimUnInsured", { type: ClaimUnInsured });
    t.nonNull.int("totalClaimUnInsured");
    t.int("maxPage");
  },
});

export const FeedClaimUnInsuredByPoliceBranch = objectType({
  name: "FeedClaimUnInsuredByPoliceBranch",
  definition(t) {
    t.nonNull.list.nonNull.field("claimUnInsured", { type: ClaimUnInsured });
    t.nonNull.int("totalClaimUnInsured");
    t.int("maxPage");
  },
});

export const ClaimUnInsuredCreateInput = inputObjectType({
  name: "ClaimUnInsuredCreateInput",
  definition(t) {
    t.float("damageEstimate");
    t.string("vehiclePlateNumber");
    t.field("branchs", { type: branchConnectInput });
  },
});
