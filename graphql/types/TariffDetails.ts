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

export const TariffDetails = objectType({
  name: "TariffDetails",
  definition(t) {
    t.string("id");
    t.string("vehicleType");
    t.string("vehicleSubType");
    t.string("usage");
    t.string("vehicleDetail");
    t.float("premium");
    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const FeedTariffVehicleSubType = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("tariffVehicleSubType", {
      type: "TariffDetails",
      args: {
        vehicleType: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.tariffDetails.findMany({
          where: {
            vehicleType: args.vehicleType,
          },
          // distinct: ["vehicleSubType", "usage"],
          distinct: ["vehicleSubType"],
        });
      },
    });
  },
});

export const FeedTariffVehicleUsage = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("tariffVehicleUsage", {
      type: "TariffDetails",
      args: {
        vehicleType: nonNull(stringArg()),
        vehicleSubType: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.tariffDetails.findMany({
          where: {
            vehicleType: args.vehicleType,
            vehicleSubType: args.vehicleSubType,
          },
          // distinct: ["vehicleSubType", "usage"],
          distinct: ["usage"],
        });
      },
    });
  },
});
export const FeedTariffVehicleType = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("tariffVehicleType", {
      type: "TariffDetails",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.tariffDetails.findMany({
          distinct: ["vehicleType"],
        });
      },
    });
  },
});

export const TariffVehicleDetailPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedTariffDetal", {
      type: FeedTariffDetal,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(TariffDetalOrderByInput)) }),
      },
      async resolve(parent, args, ctx) {
        const tariffDetals = await ctx.prisma.tariffDetails.findMany({
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.TariffDetailsOrderByWithRelationInput>
            | undefined,
        });

        const totalTariffDetals = await ctx.prisma.tariffDetails.count();
        const maxPage = Math.ceil(totalTariffDetals / 20);

        return {
          tariffDetals,
          maxPage,
          totalTariffDetals,
        };
      },
    });
  },
});

export const FeedTariffDetal = objectType({
  name: "FeedTariffDetal",
  definition(t) {
    t.nonNull.list.nonNull.field("tariffDetals", {
      type: TariffDetails,
    });
    t.nonNull.int("totalTariffDetals");
    t.int("maxPage");
  },
});

export const TariffDetalOrderByInput = inputObjectType({
  name: "TariffDetalOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});
