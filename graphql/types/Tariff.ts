import { Prisma } from "@prisma/client";
import {
  arg,
  enumType,
  extendType,
  inputObjectType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { PolicyOrderByInput } from "./Policy";
import { Sort } from "./User";

export const Tariff = objectType({
  name: "Tariff",
  definition(t) {
    t.int("id");
    t.string("tariffCode");
    t.string("vehicleType");
    t.string("vehicleSubType");
    t.string("vehicleDetail");
    t.string("usage");
    t.float("premiumTarif");
    t.date("createdAt");
    t.date("updatedAt");
    t.nonNull.list.nonNull.field("certificates", {
      type: "Certificate",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.tariff
          .findUnique({
            where: { id: _parent.id },
          })
          .certificates();
      },
    });
  },
});

export const TariffPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedTariff", {
      type: FeedTariff,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(TariffOrderByInput)) }),
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              OR: [
                { tariffCode: args.filter },
                { vehicleType: args.filter },
                { vehicleSubType: args.filter },
                { vehicleDetail: args.filter },
                { usage: args.filter },
                { premiumTarif: Number(args.filter) },
              ],
            }
          : {};

        const tariff = await ctx.prisma.tariff.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.TariffOrderByWithRelationInput>
            | undefined,
        });

        const totalTariff = await ctx.prisma.tariff.count({
          where,
        });
        const maxPage = Math.ceil(totalTariff / 20);

        return {
          tariff,
          maxPage,
          totalTariff,
        };
      },
    });
  },
});

export const tariffByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("tariffByID", {
      type: Tariff,
      args: { id: nonNull(intArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.tariff.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const tariffByTariffCodeQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("tariffByTariffCode", {
      type: Tariff,
      args: { tariffCode: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.tariff.findUnique({
          where: {
            tariffCode: args.tariffCode,
          },
        });
      },
    });
  },
});

export const createTariffMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createTariff", {
      type: Tariff,
      args: {
        input: nonNull(TariffCreateInput),
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
        return await ctx.prisma.tariff.create({
          data: {
            ...args.input,
            tariffCode: args.input.tariffCode,
            vehicleType: args.input.vehicleType,
            vehicleSubType: args.input.vehicleSubType,
            vehicleDetail: args.input.vehicleDetail,
            usage: args.input.usage,
            premiumTarif: args.input.premiumTarif,
          },
        });
      },
    });
  },
});

export const updateTariffMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateTariff", {
      type: Tariff,
      args: {
        id: nonNull(intArg()),
        input: nonNull(tariffUpdateInput),
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
        return await ctx.prisma.tariff.update({
          where: { id: args.id },
          data: {
            ...args.input,
          },
        });
      },
    });
  },
});

export const deleteTariffMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteTariff", {
      type: Tariff,
      args: {
        id: nonNull(intArg()),
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
        return await ctx.prisma.tariff.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const FeedTariff = objectType({
  name: "FeedTariff",
  definition(t) {
    t.nonNull.list.nonNull.field("tariff", { type: Tariff }); // 1
    t.nonNull.int("totalTariff"); // 2
    t.int("maxPage");
  },
});

export const TariffCreateInput = inputObjectType({
  name: "TariffCreateInput",
  definition(t) {
    t.string("tariffCode");
    t.string("vehicleType");
    t.string("vehicleSubType");
    t.string("vehicleDetail");
    t.string("usage");
    t.float("premiumTarif");
    // t.field("thirdPartyLog", { type: thirdPartyLogCreateInput });
  },
});

export const tariffUpdateInput = inputObjectType({
  name: "TariffUpdateInput",
  definition(t) {
    // t.string("tariffCode");
    t.string("vehicleType");
    t.string("vehicleSubType");
    t.string("vehicleDetail");
    t.string("usage");
    t.float("premiumTarif");
    // t.field("thirdPartyLog", { type: thirdPartyLogEditInput });
  },
});

export const tariffConnectInput = inputObjectType({
  name: "tariffConnectInput",
  definition(t) {
    t.string("tariffCode");
  },
});

export const TariffOrderByInput = inputObjectType({
  name: "TariffOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});
