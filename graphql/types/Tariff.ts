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
import { Sort } from "./User";

export const Tariff = objectType({
  name: "Tariff",
  definition(t) {
    t.int("id");
    t.string("vehicleType");
    t.string("vehicleSubType");
    t.string("vehicleDetail");
    t.string("vehicleUsage");
    t.field("vehicleCategory", { type: VehicleCategory });
    t.float("premiumTarif");
    t.date("createdAt");
    t.date("updatedAt");
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
                { vehicleType: args.filter },
                { vehicleSubType: args.filter },
                { vehicleDetail: args.filter },
                { vehiclUsage: args.filter },
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
          // orderBy: {
          //   id: "asc",
          // },
        });

        const totalTariff = await ctx.prisma.tariff.count({
          where,
        });
        const maxPage = Math.ceil(totalTariff / args?.take);

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

export const FeedVehicleTypeQuery = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("feedUniqueTariff", {
      type: FeedUniqueTariff,
      resolve: async (_parent, _args, ctx) => {
        const tariffVehicleType = await ctx.prisma.tariff.findMany({
          distinct: ["vehicleType"],
        });
        const tariffVehicleSubType = await ctx.prisma.tariff.findMany({
          distinct: ["vehicleSubType"],
        });

        const tariffVehicleDetail = await ctx.prisma.tariff.findMany({
          distinct: ["vehicleDetail"],
        });

        const tariffVehicleUsage = await ctx.prisma.tariff.findMany({
          distinct: ["vehicleUsage"],
        });
        const tariffVehicleCategory = await ctx.prisma.tariff.findMany({
          distinct: ["vehicleCategory"],
        });

        return {
          tariffVehicleType,
          tariffVehicleSubType,
          tariffVehicleDetail,
          tariffVehicleUsage,
          tariffVehicleCategory,
        };
      },
    });
  },
});

export const feedPremiumTariffVehicle = extendType({
  type: "Query",
  definition(t) {
    t.field("premiumTariffVehicle", {
      type: Tariff,
      args: {
        vehicleType: nonNull(stringArg()),
        vehicleSubType: nonNull(stringArg()),
        vehicleDetail: nonNull(stringArg()),
        vehicleUsage: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.tariff.findFirst({
          where: {
            vehicleType: {
              equals: args.vehicleType,
              mode: "insensitive",
            },
            vehicleSubType: {
              equals: args.vehicleSubType,
              mode: "insensitive",
            },
            vehicleDetail: {
              equals: args.vehicleDetail,
              mode: "insensitive",
            },
            vehicleUsage: {
              equals: args.vehicleUsage,
              mode: "insensitive",
            },
          },
        });
      },
    });
  },
});

export const exportTariffQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportTariff", {
      type: Tariff,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.tariff.findMany({
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

export const createTariffMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createTariff", {
      type: Tariff,
      args: {
        input: nonNull(tariffCreateInput),
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
        if (!user || user?.memberships?.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }
        const newValue = {
          vehicleType: args.input.vehicleType,
          vehicleSubType: args.input.vehicleSubType,
          vehicleDetail: args.input.vehicleDetail,
          vehicleUsage: args.input.vehicleUsage,
          vehicleCategory: args.input.vehicleCategory,
          premiumTarif: args.input.premiumTarif,
        };
        return await ctx.prisma.tariff.create({
          data: {
            vehicleType: args.input.vehicleType,
            vehicleSubType: args.input.vehicleSubType,
            vehicleDetail: args.input.vehicleDetail,
            vehicleUsage: args.input.vehicleUsage,
            vehicleCategory: args.input.vehicleCategory,
            premiumTarif: args.input.premiumTarif,
            thirdPartyLogs: {
              create: {
                userEmail: user.email,
                action: "Create",
                mode: "Tariff",
                newValue: newValue,
                branchCon: {
                  connect: {
                    id: user?.memberships?.branchId,
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

        const oldTariff = await ctx.prisma.tariff.findFirst({
          where: {
            id: args.id,
          },
        });

        const oldValue = {
          vehicleType: oldTariff?.vehicleType,
          vehicleSubType: oldTariff?.vehicleSubType,
          vehicleDetail: oldTariff?.vehicleDetail,
          vehicleUsage: oldTariff?.vehicleUsage,
          vehicleCategory: oldTariff?.vehicleCategory,
          premiumTarif: oldTariff?.premiumTarif,
        };

        const newValue = {
          vehicleType: args.input.vehicleType,
          vehicleSubType: args.input.vehicleSubType,
          vehicleDetail: args.input.vehicleDetail,
          vehicleUsage: args.input.vehicleUsage,
          vehicleCategory: args.input.vehicleCategory,
          premiumTarif: args.input.premiumTarif,
        };

        return await ctx.prisma.tariff.update({
          where: { id: args.id },
          data: {
            ...args.input,
            thirdPartyLogs: {
              create: {
                userEmail: user.email,
                action: "Edit",
                mode: "Tariff",
                oldValue: oldValue,
                newValue: newValue,
                branchCon: {
                  connect: {
                    id: user?.memberships.branchId,
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

export const updatePremiumTariffMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updatePremiumTariff", {
      type: Tariff,
      args: {
        id: nonNull(intArg()),
        premiumTariff: nonNull(floatArg()),
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
        if (!user || user?.memberships?.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }
        const oldTariff = await ctx.prisma.tariff.findFirst({
          where: {
            id: args.id,
          },
        });

        const oldValue = {
          premiumTarif: oldTariff?.premiumTarif,
        };

        const newValue = {
          premiumTarif: oldTariff?.premiumTarif,
        };

        return await ctx.prisma.tariff.update({
          where: { id: args.id },
          data: {
            premiumTarif: args.premiumTariff,
            thirdPartyLogs: {
              create: {
                userEmail: user.email,
                action: "Edit",
                mode: "Tariff",
                oldValue: oldValue,
                newValue: newValue,
                branchCon: {
                  connect: {
                    id: user?.memberships.branchId,
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
export const deleteTariffMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteTariff", {
      type: Tariff,
      args: {
        id: nonNull(intArg()),
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

        // const oldTariff = await ctx.prisma.tariff.findFirst({
        //   where: {
        //     id: args.id,
        //   },
        // });
        // const oldValue = {
        //   vehicleType: oldTariff?.vehicleType,
        //   vehicleSubType: oldTariff?.vehicleSubType,
        //   vehicleDetail: oldTariff?.vehicleDetail,
        //   vehicleUsage: oldTariff?.vehicleUsage,
        //   vehicleCategory: oldTariff?.vehicleCategory,
        //   premiumTarif: oldTariff?.premiumTarif,
        // };

        // return await ctx.prisma.$transaction(async (tx) => {
        //   const tariffdata = await tx.tariff.delete({
        //     where: {
        //       id: args.id,
        //     },
        //   });
        //   const logger = await tx.thirdPartyLog.create({
        //     data: {
        //       userEmail: user.email,
        //       action: "Delete",
        //       mode: "Tariff",
        //       oldValue: oldValue,
        //       branchCon: {
        //         connect: {
        //           id: user?.memberships.branchId,
        //         },
        //       },
        //     },
        //   });
        //   return logger;
        // });

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
    t.nonNull.list.nonNull.field("tariff", { type: Tariff });
    t.nonNull.int("totalTariff");
    t.int("maxPage");
  },
});

export const FeedUniqueTariff = objectType({
  name: "FeedUniqueTariff",
  definition(t) {
    t.nonNull.list.nonNull.field("tariffVehicleType", { type: Tariff });
    t.nonNull.list.nonNull.field("tariffVehicleSubType", { type: Tariff });
    t.nonNull.list.nonNull.field("tariffVehicleDetail", { type: Tariff });
    t.nonNull.list.nonNull.field("tariffVehicleUsage", { type: Tariff });
    t.nonNull.list.nonNull.field("tariffVehicleCategory", { type: Tariff });
  },
});

export const tariffCreateInput = inputObjectType({
  name: "TariffCreateInput",
  definition(t) {
    t.string("vehicleType");
    t.string("vehicleSubType");
    t.string("vehicleDetail");
    t.string("vehicleUsage");
    t.field("vehicleCategory", { type: VehicleCategory });
    t.float("premiumTarif");
    // t.field("thirdPartyLog", { type: thirdPartyLogCreateInput });
  },
});

export const tariffUpdateInput = inputObjectType({
  name: "TariffUpdateInput",
  definition(t) {
    t.string("vehicleType");
    t.string("vehicleSubType");
    t.string("vehicleDetail");
    t.string("vehicleUsage");
    t.field("vehicleCategory", { type: VehicleCategory });
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

export const VehicleCategory = enumType({
  name: "VehicleCategory",
  members: ["PRIVATEUSE", "BUSINESSUSE"],
});
