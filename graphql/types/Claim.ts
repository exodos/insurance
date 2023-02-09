import { Prisma } from "@prisma/client";
import {
  arg,
  extendType,
  floatArg,
  inputObjectType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { insuredConnectInput } from "./Insured";
import { vehicleConnectInput } from "./Vehicle";
import { certificateConnectInput } from "./Certificate";
import { format } from "date-fns";
import { InsuredPoliceReportConnectInput } from "./InsuredPoliceReport";
import { Sort } from "./User";
import { branchConnectInput } from "./Branch";

export const Claim = objectType({
  name: "Claim",
  definition(t) {
    t.string("id");
    t.string("claimNumber");
    t.float("damageEstimate");
    t.date("claimedAt");
    t.date("updatedAt");
    // t.boolean("deleted");
    // t.nullable.date("deletedTime");
    t.field("insuredPoliceReports", {
      type: "InsuredPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.claim
          .findUnique({
            where: { id: _parent.id },
          })
          .insuredPoliceReports();
      },
    });
    t.field("insureds", {
      type: "Insured",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.claim
          .findUnique({
            where: { id: _parent.id },
          })
          .insureds();
      },
    });
    t.field("vehicles", {
      type: "Vehicle",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.claim
          .findUnique({
            where: { id: _parent.id },
          })
          .vehicles();
      },
    });
    t.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.claim
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
    t.field("certificates", {
      type: "Certificate",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.claim
          .findUnique({
            where: { id: _parent.id },
          })
          .certificates();
      },
    });
  },
});

export const ClaimPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedClaim", {
      type: FeedClaim,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(ClaimOrderByInput)) }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              // deleted: false,
              claimNumber: args.filter,
            }
          : {
              // deleted: false
            };

        const claim = await ctx.prisma.claim.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.ClaimOrderByWithRelationInput>
            | undefined,
        });

        const totalClaim = await ctx.prisma.claim.count({
          where,
        });
        const maxPage = Math.ceil(totalClaim / 20);

        return {
          claim,
          maxPage,
          totalClaim,
        };
      },
    });
  },
});

export const ClaimBranchPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedClaimBranch", {
      type: FeedClaimBranch,
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
              // deleted: false,
              branchId: args.branchId,
              claimNumber: args.filter,
            }
          : {
              //  deleted: false,
              branchId: args.branchId,
            };

        const claim = await ctx.prisma.claim.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.ClaimOrderByWithRelationInput>
            | undefined,
        });

        const totalClaim = await ctx.prisma.claim.count({
          where,
        });
        const maxPage = Math.ceil(totalClaim / 20);

        return {
          claim,
          maxPage,
          totalClaim,
        };
      },
    });
  },
});

export const ClaimInsurerPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedClaimInsurer", {
      type: FeedClaimInsurer,
      args: {
        orgId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(ClaimOrderByInput)) }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              // deleted: false,
              branchs: {
                orgId: args.orgId,
              },
              claimNumber: args.filter,
            }
          : {
              // deleted: false,
              branchs: {
                orgId: args.orgId,
              },
            };

        const claim = await ctx.prisma.claim.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.ClaimOrderByWithRelationInput>
            | undefined,
        });

        const totalClaim = await ctx.prisma.claim.count({
          where,
        });
        const maxPage = Math.ceil(totalClaim / 20);

        return {
          claim,
          maxPage,
          totalClaim,
        };
      },
    });
  },
});

export const ClaimPolicePagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedClaimPoliceBranch", {
      type: FeedClaimPoliceBranch,
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
              // deleted: false,
              insuredPoliceReports: {
                policeBranch: {
                  id: args.branchId,
                },
              },
              claimNumber: args.filter,
            }
          : {
              // deleted: false,
              insuredPoliceReports: {
                policeBranch: {
                  id: args.branchId,
                },
              },
            };

        const claim = await ctx.prisma.claim.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.ClaimOrderByWithRelationInput>
            | undefined,
        });

        const totalClaim = await ctx.prisma.claim.count({
          where,
        });
        const maxPage = Math.ceil(totalClaim / 20);

        return {
          claim,
          maxPage,
          totalClaim,
        };
      },
    });
  },
});

export const claimByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("claimByID", {
      type: Claim,
      args: { id: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.claim.findFirst({
          where: {
            id: args.id,
            // deleted: false,
          },
        });
      },
    });
  },
});

export const claimByClaimNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("claimByClaimNumber", {
      type: Claim,
      args: { claimNumber: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.claim.findFirst({
          where: {
            claimNumber: args.claimNumber,
            // deleted: false,
          },
        });
      },
    });
  },
});

export const updateClaimMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateClaim", {
      type: Claim,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(ClaimUpdateInput),
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
        return await ctx.prisma.claim.update({
          where: { id: args.id },
          data: {
            ...args.input,
            // insuredPoliceReports: {
            //   connect: {
            //     incidentNumber: args.input.insuredPoliceReports.incidentNumber,
            //   },
            // },
            // insureds: {
            //   connect: {
            //     mobileNumber: args.input.insureds.id,
            //   },
            // },
            // vehicles: {
            //   connect: {
            //     plateNumber: args.input.vehicles.plateNumber,
            //   },
            // },
            // branchs: {
            //   connect: {
            //     id: args.input.branchs.id,
            //   },
            // },
            // certificates: {
            //   connect: {
            //     certificateNumber: args.input.certificates.certificateNumber,
            //   },
            // },
          },
        });
      },
    });
  },
});

export const updateDamageEstimateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateDamageEstimate", {
      type: Claim,
      args: {
        claimNumber: nonNull(stringArg()),
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
            user.memberships.role !== "TRAFFICPOLICEADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.claim.update({
          where: { claimNumber: args.claimNumber },
          data: {
            damageEstimate: args.damageEstimate,
          },
        });
      },
    });
  },
});

export const deleteClaimMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteClaim", {
      type: Claim,
      args: {
        id: nonNull(stringArg()),
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
            user.memberships.role !== "TRAFFICPOLICEADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.claim.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const FeedClaim = objectType({
  name: "FeedClaim",
  definition(t) {
    t.nonNull.list.nonNull.field("claim", { type: Claim });
    t.nonNull.int("totalClaim"); // 2
    t.int("maxPage");
  },
});

export const FeedClaimBranch = objectType({
  name: "FeedClaimBranch",
  definition(t) {
    t.nonNull.list.nonNull.field("claim", { type: Claim });
    t.nonNull.int("totalClaim");
    t.int("maxPage");
  },
});
export const FeedClaimInsurer = objectType({
  name: "FeedClaimInsurer",
  definition(t) {
    t.nonNull.list.nonNull.field("claim", { type: Claim });
    t.nonNull.int("totalClaim");
    t.int("maxPage");
  },
});

export const FeedClaimPoliceBranch = objectType({
  name: "FeedClaimPoliceBranch",
  definition(t) {
    t.nonNull.list.nonNull.field("claim", { type: Claim });
    t.nonNull.int("totalClaim");
    t.int("maxPage");
  },
});

export const ClaimCreateInput = inputObjectType({
  name: "ClaimCreateInput",
  definition(t) {
    t.float("damageEstimate");
    t.field("insuredPoliceReports", { type: InsuredPoliceReportConnectInput });
    t.field("insureds", { type: insuredConnectInput });
    t.field("vehicles", { type: vehicleConnectInput });
    t.field("branchs", { type: branchConnectInput });
    t.field("certificates", { type: certificateConnectInput });
  },
});

export const ClaimUpdateInput = inputObjectType({
  name: "ClaimUpdateInput",
  definition(t) {
    t.float("damageEstimate");
    // t.field("insuredPoliceReports", { type: InsuredPoliceReportConnectInput });
    // t.field("insureds", { type: insuredConnectInput });
    // t.field("vehicles", { type: vehicleConnectInput });
    // t.field("branchs", { type: branchConnectInput });
    // t.field("certificates", { type: certificateConnectInput });

    // t.field("thirdPartyLog", { type: thirdPartyLogEditInput });
  },
});

export const ClaimOrderByInput = inputObjectType({
  name: "ClaimOrderByInput",
  definition(t) {
    t.field("claimedAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});

export const claimDamageInput = inputObjectType({
  name: "claimDamageInput",
  definition(t) {
    t.float("damageEstimate");
  },
});
