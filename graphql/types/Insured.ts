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

export const Insured = objectType({
  name: "Insured",
  definition(t) {
    t.string("id");
    t.string("insuredName");
    t.string("region");
    t.string("city");
    t.string("subCity");
    t.string("wereda");
    t.string("kebelle");
    t.string("houseNumber");
    t.string("mobileNumber");
    t.date("createdAt");
    t.date("updatedAt");
    t.boolean("deleted");
    t.nullable.date("deletedTime");
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
    t.nonNull.list.nonNull.field("certificates", {
      type: "Certificate",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.insured
          .findUnique({
            where: { id: _parent.id },
          })
          .certificates();
      },
    });
    t.nonNull.list.nonNull.field("branchs", {
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
              deleted: false,
              OR: [{ insuredName: args.filter }, { mobileNumber: args.filter }],
            }
          : { deleted: false };

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
              deleted: false,
              branchs: {
                some: {
                  id: args.branchId,
                },
              },
              OR: [{ insuredName: args.filter }, { mobileNumber: args.filter }],
            }
          : {
              deleted: false,
              branchs: {
                some: {
                  id: args.branchId,
                },
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
              deleted: false,
              branchs: {
                some: {
                  orgId: args.orgId,
                },
              },
              OR: [{ insuredName: args.filter }, { mobileNumber: args.filter }],
            }
          : {
              deleted: false,
              branchs: {
                some: {
                  orgId: args.orgId,
                },
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
            deleted: false,
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
            deleted: false,
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
        input: nonNull(InsuredCreateInput),
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
        if (!user || user.memberships.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }
        const checkInsured = await ctx.prisma.insured.findFirst({
          where: {
            mobileNumber: changePhone(args.input.mobileNumber),
          },
        });
        let insuredData = null;
        if (checkInsured) {
          insuredData = await ctx.prisma.insured.update({
            where: {
              id: checkInsured.id,
            },
            data: {
              branchs: {
                connect: {
                  id: args.input.branchs.id,
                },
              },
            },
          });
        } else {
          insuredData = await ctx.prisma.insured.create({
            data: {
              insuredName: args.input.insuredName,
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
        }

        return insuredData;
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
        if (!user || user.memberships.role !== "SUPERADMIN") {
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
        if (!user || user.memberships.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.insured.update({
          where: {
            id: args.id,
          },
          data: {
            deleted: true,
            deletedTime: new Date(),
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

export const InsuredCreateInput = inputObjectType({
  name: "InsuredCreateInput",
  definition(t) {
    t.string("insuredName");
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

export const insuredUpdateInput = inputObjectType({
  name: "insuredUpdateInput",
  definition(t) {
    t.string("insuredName");
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
