import { changePhone } from "lib/config";
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
import { Prisma } from "@prisma/client";
import { OrgDesc, organizationConnectInput } from "./Organization";

export const Branch = objectType({
  name: "Branch",
  definition(t) {
    t.string("id");
    t.string("branchName");
    t.string("region");
    t.string("city");
    t.string("mobileNumber");
    t.date("createdAt");
    t.date("updatedAt");
    t.field("organizations", {
      type: "Organization",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .organizations();
      },
    });
    t.list.field("memberships", {
      type: "Membership",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .memberships();
      },
    });
    t.nonNull.list.nonNull.field("vehicles", {
      type: "Vehicle",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .vehicles();
      },
    });
    t.nonNull.list.nonNull.field("insuredPoliceReports", {
      type: "InsuredPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .insuredPoliceReports();
      },
    });
    t.nonNull.list.nonNull.field("policeBranchs", {
      type: "InsuredPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .policeBranchs();
      },
    });
    t.nonNull.list.nonNull.field("hitAndRunPolicBranchs", {
      type: "HitAndRunPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .hitAndRunPolicBranchs();
      },
    });
    t.nonNull.list.nonNull.field("hitAndRunPoliceReports", {
      type: "HitAndRunPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .hitAndRunPoliceReports();
      },
    });
    t.nonNull.list.nonNull.field("claims", {
      type: "Claim",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .claims();
      },
    });
    t.nonNull.list.nonNull.field("certificates", {
      type: "Certificate",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .certificates();
      },
    });
    t.nonNull.list.nonNull.field("unInsuredPoliceReports", {
      type: "UnInsuredPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .unInsuredPoliceReports();
      },
    });
    t.nonNull.list.nonNull.field("claimHitAndRuns", {
      type: "ClaimHitAndRun",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .claimHitAndRuns();
      },
    });
    t.nonNull.list.nonNull.field("claimUnInsureds", {
      type: "ClaimUnInsured",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .claimUnInsureds();
      },
    });
    t.nonNull.list.nonNull.field("insureds", {
      type: "Insured",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.branch
          .findUnique({
            where: { id: _parent.id },
          })
          .insureds();
      },
    });
  },
});

export const BranchPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedBranch", {
      type: FeedBranch,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(BranchOrderByInput)) }), // 1
      },
      resolve: async (parent, args, ctx) => {
        const where = args.filter
          ? {
              OR: [
                { id: args.filter },
                {
                  branchName: args.filter,
                },
                {
                  region: args.filter,
                },
                { mobileNumber: changePhone(args.filter) },
              ],
            }
          : {};

        const branchs = await ctx.prisma.branch.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.BranchOrderByWithRelationInput>
            | undefined,
        });

        const totalBranch = await ctx.prisma.branch.count({
          where,
        }); // 2
        const maxPage = Math.ceil(totalBranch / 20);

        return {
          branchs,
          maxPage,
          totalBranch,
        };
      },
    });
  },
});

export const BranchInsurerPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedBranchInsurer", {
      type: FeedBranchInsurer,
      args: {
        orgId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(BranchOrderByInput)) }), // 1
      },
      resolve: async (parent, args, ctx) => {
        const where = args.filter
          ? {
              organizations: {
                id: args.orgId,
              },
              OR: [
                { id: args.filter },
                {
                  branchName: args.filter,
                },
                {
                  region: args.filter,
                },
                { mobileNumber: changePhone(args.filter) },
              ],
            }
          : {
              organizations: {
                id: args.orgId,
              },
            };

        const branchs = await ctx.prisma.branch.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.BranchOrderByWithRelationInput>
            | undefined,
        });

        const totalBranch = await ctx.prisma.branch.count({
          where,
        }); // 2
        const maxPage = Math.ceil(totalBranch / 20);

        return {
          branchs,
          maxPage,
          totalBranch,
        };
      },
    });
  },
});

export const branchByOrgDesc = extendType({
  type: "Query",
  definition(t) {
    t.field("feedBranchByOrgDesc", {
      type: FeedBranchByOrgDesc,
      args: {
        input: nonNull(orgDescInput),
      },
      resolve: async (_parent, args, ctx) => {
        const branchs = await ctx.prisma.branch.findMany({
          where: {
            organizations: {
              description: args.input.description,
            },
          },
        });

        return {
          branchs,
        };
      },
    });
  },
});

export const branchByOrg = extendType({
  type: "Query",
  definition(t) {
    t.field("feedBranchByOrg", {
      type: FeedBranchByOrg,
      args: {
        orgId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const branchs = await ctx.prisma.branch.findMany({
          where: {
            organizations: {
              id: args.orgId,
            },
          },
        });

        return {
          branchs,
        };
      },
    });
  },
});

export const branchByName = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("branchByName", {
      type: Branch,
      args: { branchName: nonNull(stringArg()) },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.branch.findUnique({
          where: {
            branchName: args.branchName,
          },
        });
      },
    });
  },
});

export const listAllBranch = extendType({
  type: "Query",
  definition(t) {
    t.list.field("listAllBranch", {
      type: Branch,
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.branch.findMany();
      },
    });
  },
});

export const exportBranchQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportBranch", {
      type: Branch,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.branch.findMany({
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

export const exportBranchByInsurerQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportBranchByInsurer", {
      type: Branch,
      args: {
        orgId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.branch.findMany({
          where: {
            orgId: args.orgId,
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

export const FeedBranch = objectType({
  name: "FeedBranch",
  definition(t) {
    t.nonNull.list.nonNull.field("branchs", { type: Branch });
    t.nonNull.int("totalBranch");
    t.int("maxPage");
  },
});

export const FeedBranchHead = objectType({
  name: "FeedBranchHead",
  definition(t) {
    t.nonNull.list.nonNull.field("branchs", { type: Branch });
  },
});

export const FeedBranchByOrg = objectType({
  name: "FeedBranchByOrg",
  definition(t) {
    t.nonNull.list.nonNull.field("branchs", { type: Branch });
  },
});

export const FeedBranchByOrgDesc = objectType({
  name: "FeedBranchByOrgDesc",
  definition(t) {
    t.nonNull.list.nonNull.field("branchs", { type: Branch });
  },
});

export const FeedBranchInsurer = objectType({
  name: "FeedBranchInsurer",
  definition(t) {
    t.nonNull.list.nonNull.field("branchs", { type: Branch });
    t.nonNull.int("totalBranch");
    t.int("maxPage");
  },
});

// Mutation

export const createBranchMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createBranch", {
      type: Branch,
      args: {
        input: nonNull(branchCreateInput),
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
            user.memberships.role !== "INSURER" &&
            user.memberships.role !== "TRAFFICPOLICEADMIN")
        ) {
          throw new Error(`You do not have permission to perform this action`);
        }

        return await ctx.prisma.branch.create({
          data: {
            // ...args.input,
            branchName: args.input.branchName,
            region: args.input.region ?? null,
            city: args.input.city ?? null,
            mobileNumber: args.input.mobileNumber,
            organizations: {
              connect: {
                id: args.input.organizations.id,
              },
            },
          },
        });
      },
    });
  },
});

export const updateBranchMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateBranch", {
      type: Branch,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(branchUpdateInput),
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
            user.memberships.role !== "INSURER" &&
            user.memberships.role !== "TRAFFICPOLICEADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        return ctx.prisma.branch.update({
          where: { id: args.id },
          data: {
            ...args.input,
          },
        });
      },
    });
  },
});

export const deleteBranchMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteBranch", {
      type: Branch,
      args: {
        branchId: nonNull(stringArg()),
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
            user.memberships.role !== "INSURER" &&
            user.memberships.role !== "TRAFFICPOLICEADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.branch.delete({
          where: {
            id: args.branchId,
          },
        });
      },
    });
  },
});

export const branchCreateInput = inputObjectType({
  name: "branchCreateInput",
  definition(t) {
    t.string("branchName");
    t.nullable.string("region");
    t.nullable.string("city");
    t.string("mobileNumber");
    t.field("organizations", { type: organizationConnectInput });
  },
});

export const branchUpdateInput = inputObjectType({
  name: "branchUpdateInput",
  definition(t) {
    t.string("branchName");
    t.string("region");
    t.string("city");
    t.string("mobileNumber");
  },
});

export const orgDescInput = inputObjectType({
  name: "orgDescInput",
  definition(t) {
    t.field("description", { type: OrgDesc });
  },
});

export const branchConnectInput = inputObjectType({
  name: "branchConnectInput",
  definition(t) {
    t.string("id");
  },
});

export const BranchOrderByInput = inputObjectType({
  name: "BranchOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});
