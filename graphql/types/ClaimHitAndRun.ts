import { branchConnectInput } from "./Branch";
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
import { format } from "date-fns";
import { ClaimOrderByInput } from "./Claim";
import { hitAndRunPoliceReportConnectInput } from "./HitAndRunPoliceReport";

export const ClaimHitAndRun = objectType({
  name: "ClaimHitAndRun",
  definition(t) {
    t.string("id");
    t.string("claimNumber");
    t.float("damageEstimate");
    t.date("claimedAt");
    t.string("claimerFullName");
    t.string("claimerRegion");
    t.string("claimerCity");
    t.string("claimerPhoneNumber");
    t.date("updatedAt");
    t.field("hitAndRunPoliceReports", {
      type: "HitAndRunPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.claimHitAndRun
          .findUnique({
            where: { id: _parent.id },
          })
          .hitAndRunPoliceReports();
      },
    });
    t.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.claimHitAndRun
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
  },
});

export const ClaimHitAndRunPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedClaimHitAndRun", {
      type: FeedClaimHitAndRun,
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

        const claimHitAndRuns = await ctx.prisma.claimHitAndRun.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.PolicyOrderByWithRelationInput>
            | undefined,
        });

        const totalClaimHitAndRun = await ctx.prisma.claimHitAndRun.count({
          where,
        });
        const maxPage = Math.ceil(totalClaimHitAndRun / args?.take);

        return {
          claimHitAndRuns,
          maxPage,
          totalClaimHitAndRun,
        };
      },
    });
  },
});

export const ClaimHitAndRunByPolicePagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedClaimHitAndRunByPolice", {
      type: FeedClaimHitAndRun,
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
              hitAndRunPoliceReports: {
                policeBranch: {
                  id: args.branchId,
                },
              },
              claimNumber: args.filter,
            }
          : {
              hitAndRunPoliceReports: {
                policeBranch: {
                  id: args.branchId,
                },
              },
            };

        const claimHitAndRuns = await ctx.prisma.claimHitAndRun.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.PolicyOrderByWithRelationInput>
            | undefined,
        });

        const totalClaimHitAndRun = await ctx.prisma.claimHitAndRun.count({
          where,
        });
        const maxPage = Math.ceil(totalClaimHitAndRun / args?.take);

        return {
          claimHitAndRuns,
          maxPage,
          totalClaimHitAndRun,
        };
      },
    });
  },
});

export const claimHitAndRunByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("claimHitAndRunByID", {
      type: ClaimHitAndRun,
      args: { id: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.claimHitAndRun.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const claimHitAndRunByClaimNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("claimHitAndRunByClaimNumber", {
      type: ClaimHitAndRun,
      args: { claimNumber: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.claimHitAndRun.findUnique({
          where: {
            claimNumber: args.claimNumber,
          },
        });
      },
    });
  },
});

export const updateClaimHitAndRunMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateClaimHitAndRun", {
      type: ClaimHitAndRun,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(ClaimHitAndRunUpdateInput),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx?.session?.user?.email,
          },
          include: {
            memberships: true,
          },
        });
        if (
          !user ||
          (user.memberships.role !== "SUPERADMIN" &&
            user.memberships.role !== "TRAFFICPOLICEADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        const oldClaim = await ctx.prisma.claimHitAndRun.findFirst({
          where: {
            claimNumber: args.id,
          },
        });

        const oldValue = {
          damageEstimate: oldClaim?.damageEstimate ?? null,
          claimerFullName: oldClaim?.claimerFullName ?? null,
          claimerRegion: oldClaim?.claimerRegion ?? null,
          claimerCity: oldClaim?.claimerCity ?? null,
          claimerPhoneNumber: oldClaim?.claimerPhoneNumber ?? null,
        };
        const newValue = {
          damageEstimate: args.input.damageEstimate ?? null,
          claimerFullName: args.input.claimerFullName ?? null,
          claimerRegion: args.input.claimerRegion ?? null,
          claimerCity: args.input.claimerCity ?? null,
          claimerPhoneNumber: args.input.claimerPhoneNumber ?? null,
        };

        return await ctx.prisma.claimHitAndRun.update({
          where: { id: args.id },
          data: {
            damageEstimate: args.input.damageEstimate,
            claimerFullName: args.input.claimerFullName,
            claimerRegion: args.input.claimerRegion,
            claimerCity: args.input.claimerCity,
            claimerPhoneNumber: args.input.claimerPhoneNumber,
            thirdPartyLogs: {
              create: {
                userEmail: user.email,
                action: "Edit",
                mode: "ClaimHitAndRun",
                oldValue: oldValue,
                newValue: newValue,
                branchCon: {
                  connect: {
                    id: oldClaim?.branchId,
                  },
                },
              },
            },
          },
        });
      },
    });
  },
});

export const updateClaimHitAndRunDamageEstimateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateClaimHitAndRunDamageEstimate", {
      type: ClaimHitAndRun,
      args: {
        id: nonNull(stringArg()),
        damageEstimate: nonNull(floatArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx?.session?.user?.email,
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
        const oldClaim = await ctx.prisma.claimHitAndRun.findFirst({
          where: {
            claimNumber: args.id,
          },
        });

        const oldValue = {
          claimNumber: oldClaim?.claimNumber ?? null,
          damageEstimate: oldClaim?.damageEstimate ?? null,
        };
        const newValue = {
          claimNumber: oldClaim?.claimNumber ?? null,
          damageEstimate: args?.damageEstimate ?? null,
        };
        return await ctx.prisma.claimHitAndRun.update({
          where: { id: args.id },
          data: {
            damageEstimate: args.damageEstimate,
            thirdPartyLogs: {
              create: {
                userEmail: user.email,
                action: "Edit",
                mode: "ClaimHitAndRun",
                oldValue: oldValue,
                newValue: newValue,
                branchCon: {
                  connect: {
                    id: oldClaim?.branchId,
                  },
                },
              },
            },
          },
        });
      },
    });
  },
});

export const deleteClaimHitAndRunMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteClaimHitAndRun", {
      type: ClaimHitAndRun,
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx?.session?.user?.email,
          },
          include: {
            memberships: true,
          },
        });
        if (!user || user.memberships.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.claimHitAndRun.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const exportHitAndRunQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportHitAndRun", {
      type: ClaimHitAndRun,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.claimHitAndRun.findMany({
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

export const exportHitAndRunInsurerQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportHitAndRunInsurer", {
      type: ClaimHitAndRun,
      args: {
        orgId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.claimHitAndRun.findMany({
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

export const exportHitAndRunBranchQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportHitAndRunBranch", {
      type: ClaimHitAndRun,
      args: {
        branchId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.claimHitAndRun.findMany({
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

export const FeedClaimHitAndRun = objectType({
  name: "FeedClaimHitAndRun",
  definition(t) {
    t.nonNull.list.nonNull.field("claimHitAndRuns", { type: ClaimHitAndRun }); // 1
    t.nonNull.int("totalClaimHitAndRun"); // 2
    t.int("maxPage");
  },
});
export const ClaimHitAndRunCreateInput = inputObjectType({
  name: "ClaimHitAndRunCreateInput",
  definition(t) {
    t.float("damageEstimate");
    t.string("claimerFullName");
    t.string("claimerRegion");
    t.string("claimerCity");
    t.string("claimerPhoneNumber");
    t.field("hitAndRunPoliceReports", {
      type: hitAndRunPoliceReportConnectInput,
    });
    t.field("branchs", {
      type: branchConnectInput,
    });
  },
});

export const ClaimHitAndRunConnectionInput = inputObjectType({
  name: "ClaimHitAndRunConnectionInput",
  definition(t) {
    t.float("damageEstimate");
    t.string("claimerFullName");
    t.string("claimerRegion");
    t.string("claimerCity");
    t.string("claimerPhoneNumber");
    t.field("branchs", { type: branchConnectInput });
  },
});

export const ClaimHitAndRunUpdateInput = inputObjectType({
  name: "ClaimHitRunUpdateInput",
  definition(t) {
    t.nullable.float("damageEstimate");
    t.nullable.string("claimerFullName");
    t.nullable.string("claimerRegion");
    t.nullable.string("claimerCity");
    t.nullable.string("claimerPhoneNumber");
    // t.field("hitAndRunPoliceReports", {
    //   type: hitAndRunPoliceReportConnectInput,
    // });

    // t.field("thirdPartyLog", { type: thirdPartyLogEditInput });
  },
});
