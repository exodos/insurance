import { changePhone } from "../../lib/config";
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
import { branchConnectInput } from "./Branch";
import { format } from "date-fns";

export const Insured = objectType({
  name: "Insured",
  definition(t) {
    t.string("id");
    t.string("regNumber");
    t.string("firstName");
    t.string("lastName");
    t.nullable.string("occupation");
    t.string("region");
    t.string("city");
    t.string("subCity");
    t.string("wereda");
    t.string("kebelle");
    t.string("houseNumber");
    t.string("mobileNumber");
    t.date("createdAt");
    t.date("updatedAt");
    t.nonNull.list.nonNull.field("vehicles", {
      type: "Vehicle",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.insured
          .findUnique({
            where: { id: _parent.id },
          })
          .vehicles();
      },
    });
    t.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.insured
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
  },
});

export const InsuredPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedInsured", {
      type: FeedInsured,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(InsuredOrderByInput)) }),
      },
      async resolve(_parent, args, ctx) {
        const where = args.filter
          ? {
              OR: [
                { firstName: args.filter },
                { lastName: args.filter },
                { mobileNumber: args.filter },
                { regNumber: args.filter },
              ],
            }
          : {};

        const insured = await ctx.prisma.insured.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.InsuredOrderByWithRelationInput>
            | undefined,
        });

        const totalInsured = await ctx.prisma.insured.count({
          where,
        });
        const maxPage = Math.ceil(totalInsured / 20);

        return {
          insured,
          maxPage,
          totalInsured,
        };
      },
    });
  },
});

export const InsuredBranchPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedInsuredBranch", {
      type: FeedInsuredBranch,
      args: {
        branchId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(InsuredOrderByInput)) }),
      },
      async resolve(_parent, args, ctx) {
        const where = args.filter
          ? {
              branchs: {
                id: args.branchId,
              },
              OR: [
                { firstName: args.filter },
                { lastName: args.filter },
                { mobileNumber: args.filter },
                { regNumber: args.filter },
              ],
            }
          : {
              branchs: {
                id: args.branchId,
              },
            };

        const insured = await ctx.prisma.insured.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.InsuredOrderByWithRelationInput>
            | undefined,
        });

        const totalInsured = await ctx.prisma.insured.count({
          where,
        });
        const maxPage = Math.ceil(totalInsured / 20);

        return {
          insured,
          maxPage,
          totalInsured,
        };
      },
    });
  },
});

export const InsuredInsurerPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedInsuredInsurer", {
      type: FeedInsuredInsurer,
      args: {
        orgId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(InsuredOrderByInput)) }),
      },
      async resolve(_parent, args, ctx) {
        const where = args.filter
          ? {
              branchs: {
                orgId: args.orgId,
              },
              OR: [
                { firstName: args.filter },
                { lastName: args.filter },
                { mobileNumber: args.filter },
                { regNumber: args.filter },
              ],
            }
          : {
              branchs: {
                orgId: args.orgId,
              },
            };

        const insured = await ctx.prisma.insured.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.InsuredOrderByWithRelationInput>
            | undefined,
        });

        const totalInsured = await ctx.prisma.insured.count({
          where,
        });
        const maxPage = Math.ceil(totalInsured / 20);

        return {
          insured,
          maxPage,
          totalInsured,
        };
      },
    });
  },
});

export const insuredByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("insuredByID", {
      type: Insured,
      args: { id: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.insured.findFirst({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const insuredByMobileNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("insuredByMobileNumber", {
      type: Insured,
      args: { mobileNumber: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.insured.findFirst({
          where: {
            mobileNumber: args.mobileNumber,
          },
        });
      },
    });
  },
});

export const insuredBranchByMobileNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("insuredBranchByMobileNumber", {
      type: Insured,
      args: {
        mobileNumber: nonNull(stringArg()),
        branchId: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.insured.findFirst({
          where: {
            mobileNumber: args.mobileNumber,
            branchId: args.branchId,
          },
        });
      },
    });
  },
});
export const insuredInsurerByMobileNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("insuredInsurerByMobileNumber", {
      type: Insured,
      args: {
        mobileNumber: nonNull(stringArg()),
        orgId: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.insured.findFirst({
          where: {
            mobileNumber: args.mobileNumber,
            branchs: {
              orgId: args.orgId,
            },
          },
        });
      },
    });
  },
});

export const exportInsuredQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportInsured", {
      type: Insured,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.insured.findMany({
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

export const exportInsuredInsurerQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportInsuredInsurer", {
      type: Insured,
      args: {
        orgId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.insured.findMany({
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

export const exportInsuredBranchQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportInsuredBranch", {
      type: Insured,
      args: {
        branchId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.insured.findMany({
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

export const createInsuredMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createInsured", {
      type: Insured,
      args: {
        input: nonNull(insuredCreateInput),
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
            user.memberships.role !== "MEMBER" &&
            user.memberships.role !== "BRANCHADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.insured.create({
          data: {
            regNumber: `REG-${format(new Date(), "yyMMiHms")}`,
            firstName: args.input.firstName,
            lastName: args.input.lastName,
            occupation: args.input.occupation,
            region: args.input.region,
            city: args.input.city,
            subCity: args.input.subCity,
            wereda: args.input.wereda,
            kebelle: args.input.kebelle,
            houseNumber: args.input.houseNumber,
            mobileNumber: changePhone(args.input.mobileNumber),
            branchs: {
              connect: {
                id: args.input.branchs.id,
              },
            },
          },
        });
      },
    });
  },
});

export const updateInsuredMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateInsured", {
      type: Insured,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(insuredUpdateInput),
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
            user.memberships.role !== "MEMBER" &&
            user.memberships.role !== "BRANCHADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.insured.update({
          where: { id: args.id },
          data: {
            ...args.input,
            mobileNumber: changePhone(args.input.mobileNumber),
            // branchs: {
            //   connect: {
            //     id: args.input.branchs.id,
            //   },
            // },
          },
        });
      },
    });
  },
});

export const deleteInsuredMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteInsured", {
      type: Insured,
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
            user.memberships.role !== "INSURER" &&
            user.memberships.role !== "MEMBER" &&
            user.memberships.role !== "BRANCHADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.insured.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const FeedInsured = objectType({
  name: "FeedInsured",
  definition(t) {
    t.nonNull.list.nonNull.field("insured", { type: Insured });
    t.nonNull.int("totalInsured");
    t.int("maxPage");
  },
});

export const FeedInsuredBranch = objectType({
  name: "FeedInsuredBranch",
  definition(t) {
    t.nonNull.list.nonNull.field("insured", { type: Insured });
    t.nonNull.int("totalInsured");
    t.int("maxPage");
  },
});

export const FeedInsuredInsurer = objectType({
  name: "FeedInsuredInsurer",
  definition(t) {
    t.nonNull.list.nonNull.field("insured", { type: Insured });
    t.nonNull.int("totalInsured");
    t.int("maxPage");
  },
});

export const insuredCreateInput = inputObjectType({
  name: "InsuredCreateInput",
  definition(t) {
    t.string("firstName");
    t.string("lastName");
    t.nullable.string("occupation");
    t.string("region");
    t.string("city");
    t.string("subCity");
    t.string("wereda");
    t.string("kebelle");
    t.string("houseNumber");
    t.string("mobileNumber");
    t.field("branchs", { type: branchConnectInput });

    // t.field("thirdPartyLog", { type: thirdPartyLogCreateInput });
  },
});
export const insuredInsuranceCreateInput = inputObjectType({
  name: "insuredInsuranceCreateInput",
  definition(t) {
    t.string("firstName");
    t.string("lastName");
    t.nullable.string("occupation");
    t.string("region");
    t.string("city");
    t.string("subCity");
    t.string("wereda");
    t.string("kebelle");
    t.string("houseNumber");
    t.string("mobileNumber");
    // t.field("branchs", { type: branchConnectInput });

    // t.field("thirdPartyLog", { type: thirdPartyLogCreateInput });
  },
});

export const insuredUpdateInput = inputObjectType({
  name: "insuredUpdateInput",
  definition(t) {
    t.string("firstName");
    t.string("lastName");
    t.nullable.string("occupation");
    t.string("region");
    t.string("city");
    t.string("subCity");
    t.string("wereda");
    t.string("kebelle");
    t.string("houseNumber");
    t.string("mobileNumber");
    // t.field("branchs", { type: branchConnectInput });

    // t.field("thirdPartyLog", { type: thirdPartyLogEditInput });
  },
});

export const insuredConnectInput = inputObjectType({
  name: "insuredConnectInput",
  definition(t) {
    t.string("id");
  },
});

export const insuredMobileInput = inputObjectType({
  name: "insuredMobileInput",
  definition(t) {
    t.string("mobileNumber");
  },
});

export const InsuredOrderByInput = inputObjectType({
  name: "InsuredOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});
