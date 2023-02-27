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
import {
  insuredConnectInput,
  insuredCreateInput,
  insuredInsuranceCreateInput,
} from "./Insured";
import { Sort } from "./User";
import { branchConnectInput } from "./Branch";
import { VehicleCategory } from "./Tariff";

export const Vehicle = objectType({
  name: "Vehicle",
  definition(t) {
    t.string("id");
    t.string("plateNumber");
    t.string("engineNumber");
    t.string("chassisNumber");
    t.string("vehicleModel");
    t.string("bodyType");
    t.string("horsePower");
    t.int("manufacturedYear");
    t.string("vehicleType");
    t.string("vehicleSubType");
    t.string("vehicleDetails");
    t.string("vehicleUsage");
    t.field("vehicleCategory", { type: VehicleCategory });
    t.float("premiumTarif");
    t.int("passengerNumber");
    t.nullable.string("carryingCapacityInGoods");
    t.int("purchasedYear");
    t.float("dutyFreeValue");
    t.float("dutyPaidValue");
    t.string("carryingCapacityInGoods");
    t.field("vehicleStatus", { type: VehicleStatus });
    t.field("isInsured", { type: IsInsured });
    t.date("createdAt");
    t.date("updatedAt");
    t.field("insureds", {
      type: "Insured",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.vehicle
          .findUnique({
            where: { id: _parent.id },
          })
          .insureds();
      },
    });
    t.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.vehicle
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
    t.field("certificates", {
      type: "Certificate",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.vehicle
          .findUnique({
            where: { id: _parent.id },
          })
          .certificates();
      },
    });
    t.nullable.list.nullable.field("claims", {
      type: "Claim",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.vehicle
          .findUnique({
            where: { id: _parent.id },
          })
          .claims();
      },
    });
  },
});

export const VehiclePagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedVehicle", {
      type: FeedVehicle,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(VehicleOrderByInput)) }), // 1
      },
      async resolve(_parent, args, ctx) {
        const where = args.filter
          ? {
              OR: [
                { plateNumber: args.filter },
                { engineNumber: args.filter },
                { chassisNumber: args.filter },
              ],
            }
          : {};

        const vehicle = await ctx.prisma.vehicle.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.VehicleOrderByWithRelationInput>
            | undefined,
        });

        const totalVehicle = await ctx.prisma.vehicle.count({
          where,
        });
        const maxPage = Math.ceil(totalVehicle / 20);

        return {
          vehicle,
          maxPage,
          totalVehicle,
        };
      },
    });
  },
});

export const VehicleBranchByStatusPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedVehicleBranchByStatus", {
      type: FeedVehicleBranchByStatus,
      args: {
        input: nonNull(statusInput),
        branchId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(VehicleOrderByInput)) }),
      },
      async resolve(_parent, args, ctx) {
        const where = args.filter
          ? {
              status: args.input.status,
              branchId: args.branchId,
              OR: [
                { plateNumber: args.filter },
                { engineNumber: args.filter },
                { chassisNumber: args.filter },
              ],
            }
          : {
              branchId: args.branchId,
              status: args.input.status,
            };

        const vehicle = await ctx.prisma.vehicle.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.VehicleOrderByWithRelationInput>
            | undefined,
        });

        const totalVehicle = await ctx.prisma.vehicle.count({
          where,
        });
        const maxPage = Math.ceil(totalVehicle / 20);

        return {
          vehicle,
          maxPage,
          totalVehicle,
        };
      },
    });
  },
});

export const VehicleBranchPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedVehicleBranch", {
      type: FeedVehicleBranch,
      args: {
        branchId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(VehicleOrderByInput)) }), // 1
      },
      async resolve(_parent, args, ctx) {
        const where = args.filter
          ? {
              branchId: args.branchId,
              OR: [
                { plateNumber: args.filter },
                { engineNumber: args.filter },
                { chassisNumber: args.filter },
              ],
            }
          : {
              branchId: args.branchId,
            };

        const vehicle = await ctx.prisma.vehicle.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.VehicleOrderByWithRelationInput>
            | undefined,
        });

        const totalVehicle = await ctx.prisma.vehicle.count({
          where,
        });
        const maxPage = Math.ceil(totalVehicle / 20);

        return {
          vehicle,
          maxPage,
          totalVehicle,
        };
      },
    });
  },
});

export const VehicleInsurerPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedVehicleInsurer", {
      type: FeedVehicleInsurer,
      args: {
        orgId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(VehicleOrderByInput)) }), // 1
      },
      async resolve(_parent, args, ctx) {
        const where = args.filter
          ? {
              branchs: {
                orgId: args.orgId,
              },
              OR: [
                { plateNumber: args.filter },
                { engineNumber: args.filter },
                { chassisNumber: args.filter },
              ],
            }
          : {
              branchs: {
                orgId: args.orgId,
              },
            };

        const vehicle = await ctx.prisma.vehicle.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.VehicleOrderByWithRelationInput>
            | undefined,
        });

        const totalVehicle = await ctx.prisma.vehicle.count({
          where,
        });
        const maxPage = Math.ceil(totalVehicle / 20);

        return {
          vehicle,
          maxPage,
          totalVehicle,
        };
      },
    });
  },
});

export const vehicleByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("vehicleByID", {
      type: Vehicle,
      args: { id: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.vehicle.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const vehicleByPlateNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("vehicleByPlateNumber", {
      type: Vehicle,
      args: { plateNumber: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber: {
              equals: args.plateNumber,
              mode: "insensitive",
            },
            // status: "APPROVED",
          },
        });
      },
    });
  },
});

export const vehicleBranchByPlateNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("vehicleBranchByPlateNumber", {
      type: Vehicle,
      args: {
        plateNumber: nonNull(stringArg()),
        branchId: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber: {
              equals: args.plateNumber,
              mode: "insensitive",
            },
            branchId: args.branchId,
            // status: "APPROVED",
          },
        });
      },
    });
  },
});

export const vehicleInsurerByPlateNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("vehicleInsurerByPlateNumber", {
      type: Vehicle,
      args: {
        plateNumber: nonNull(stringArg()),
        orgId: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber: {
              equals: args.plateNumber,
              mode: "insensitive",
            },
            branchs: {
              orgId: args.orgId,
            },
            // status: "APPROVED",
          },
        });
      },
    });
  },
});

export const exportVehicleQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportVehicle", {
      type: Vehicle,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.vehicle.findMany({
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

export const exportVehicleByInsurerQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportVehicleByInsurer", {
      type: Vehicle,
      args: {
        orgId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.vehicle.findMany({
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

export const exportVehicleByBranchQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportVehicleByBranch", {
      type: Vehicle,
      args: {
        branchId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.vehicle.findMany({
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

export const createVehicleMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createVehicle", {
      type: Vehicle,
      args: {
        input: nonNull(vehicleCreateInput),
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
        const checkInsured = await ctx.prisma.insured.findFirst({
          where: {
            id: args.input.insureds.id,
          },
        });
        if (!checkInsured) {
          throw new Error(
            `We Could\'n find Insured with the provided mobile number`
          );
        }

        const tariffPremium = await ctx.prisma.tariff.findFirst({
          where: {
            vehicleType: args.input.vehicleType,
            vehicleSubType: args.input.vehicleSubType,
            vehicleDetail: args.input.vehicleDetails,
            vehicleUsage: args.input.vehicleUsage,
          },
        });
        if (!tariffPremium) {
          throw new Error(
            `We Could\'n find Premium Tariff with the provided data`
          );
        }
        let calPremiumTarif = 0;
        if (args.input.vehicleCategory === "PRIVATEUSE") {
          calPremiumTarif =
            20 * args.input.passengerNumber + tariffPremium.premiumTarif;
        } else {
          calPremiumTarif =
            40 * args.input.passengerNumber + tariffPremium.premiumTarif;
        }

        return await ctx.prisma.vehicle.create({
          data: {
            plateNumber: args.input.plateNumber,
            engineNumber: args.input.engineNumber,
            chassisNumber: args.input.chassisNumber,
            vehicleModel: args.input.vehicleModel,
            bodyType: args.input.bodyType,
            horsePower: args.input.horsePower,
            manufacturedYear: args.input.manufacturedYear,
            vehicleType: args.input.vehicleType,
            vehicleSubType: args.input.vehicleSubType,
            vehicleDetails: args.input.vehicleDetails,
            vehicleUsage: args.input.vehicleUsage,
            vehicleCategory: args.input.vehicleCategory,
            premiumTarif: calPremiumTarif,
            passengerNumber: args.input.passengerNumber,
            carryingCapacityInGoods: args.input.carryingCapacityInGoods,
            purchasedYear: args.input.purchasedYear,
            dutyFreeValue: args.input.dutyFreeValue,
            dutyPaidValue: args.input.dutyPaidValue,
            vehicleStatus: args.input.vehicleStatus,
            insureds: {
              connect: {
                id: args.input.insureds.id,
              },
            },
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

export const updateVehicleMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateVehicle", {
      type: Vehicle,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(vehicleUpdateInput),
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

        const tariffPremium = await ctx.prisma.tariff.findFirst({
          where: {
            vehicleType: args.input.vehicleType,
            vehicleSubType: args.input.vehicleSubType,
            vehicleDetail: args.input.vehicleDetails,
            vehicleUsage: args.input.vehicleUsage,
          },
        });
        if (!tariffPremium) {
          throw new Error(
            `We Could\'n find Premium Tariff with the provided data`
          );
        }
        let calPremiumTarif = 0;
        if (args.input.vehicleCategory === "PRIVATEUSE") {
          calPremiumTarif =
            20 * args.input.passengerNumber + tariffPremium.premiumTarif;
        } else {
          calPremiumTarif =
            40 * args.input.passengerNumber + tariffPremium.premiumTarif;
        }
        return await ctx.prisma.vehicle.update({
          where: { id: args.id },
          data: {
            plateNumber: args.input.plateNumber,
            vehicleModel: args.input.vehicleModel,
            bodyType: args.input.bodyType,
            horsePower: args.input.horsePower,
            manufacturedYear: args.input.manufacturedYear,
            vehicleType: args.input.vehicleType,
            vehicleSubType: args.input.vehicleSubType,
            vehicleDetails: args.input.vehicleDetails,
            vehicleUsage: args.input.vehicleUsage,
            vehicleCategory: args.input.vehicleCategory,
            premiumTarif: calPremiumTarif,
            passengerNumber: Number(args.input.passengerNumber),
            carryingCapacityInGoods: args.input.carryingCapacityInGoods,
            purchasedYear: args.input.purchasedYear,
            dutyFreeValue: args.input.dutyFreeValue,
            dutyPaidValue: args.input.dutyPaidValue,
            vehicleStatus: args.input.vehicleStatus,
          },
        });
      },
    });
  },
});

// export const updateVehicleStatusMutation = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.nonNull.field("updateVehicleStatus", {
//       type: Vehicle,
//       args: {
//         id: nonNull(stringArg()),
//         input: nonNull(statusInput),
//       },
//       resolve: async (_parent, args, ctx) => {
//         const user = await ctx.prisma.user.findUnique({
//           where: {
//             email: ctx.session.user.email,
//           },
//           include: {
//             memberships: true,
//           },
//         });
//         if (
//           !user ||
//           (user.memberships.role !== "SUPERADMIN" &&
//             user.memberships.role !== "INSURER" &&
//             user.memberships.role !== "BRANCHADMIN")
//         ) {
//           throw new Error(`You do not have permission to perform action`);
//         }

//         return await ctx.prisma.vehicle.update({
//           where: { id: args.id },
//           data: {
//             status: args.input.status,
//           },
//         });
//       },
//     });
//   },
// });

export const deleteVehicleMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteVehicle", {
      type: Vehicle,
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
            user.memberships.role !== "MEMBER")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }

        return await ctx.prisma.vehicle.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const FeedVehicle = objectType({
  name: "FeedVehicle",
  definition(t) {
    t.nonNull.list.nonNull.field("vehicle", { type: Vehicle });
    t.nonNull.int("totalVehicle");
    t.int("maxPage");
  },
});

export const FeedVehicleByStatus = objectType({
  name: "FeedVehicleByStatus",
  definition(t) {
    t.nonNull.list.nonNull.field("vehicle", { type: Vehicle });
    t.nonNull.int("totalVehicle");
    t.int("maxPage");
  },
});
export const FeedVehicleBranchByStatus = objectType({
  name: "FeedVehicleBranchByStatus",
  definition(t) {
    t.nonNull.list.nonNull.field("vehicle", { type: Vehicle });
    t.nonNull.int("totalVehicle");
    t.int("maxPage");
  },
});

export const FeedVehicleInsurerByStatus = objectType({
  name: "FeedVehicleInsurerByStatus",
  definition(t) {
    t.nonNull.list.nonNull.field("vehicle", { type: Vehicle });
    t.nonNull.int("totalVehicle");
    t.int("maxPage");
  },
});

export const FeedVehicleInsurer = objectType({
  name: "FeedVehicleInsurer",
  definition(t) {
    t.nonNull.list.nonNull.field("vehicle", { type: Vehicle }); // 1
    t.nonNull.int("totalVehicle"); // 2
    t.int("maxPage");
  },
});

export const FeedVehicleBranch = objectType({
  name: "FeedVehicleBranch",
  definition(t) {
    t.nonNull.list.nonNull.field("vehicle", { type: Vehicle });
    t.nonNull.int("totalVehicle");
    t.int("maxPage");
  },
});

export const statusInput = inputObjectType({
  name: "statusInput",
  definition(t) {
    t.field("status", { type: STATUS });
  },
});

export const vehicleCreateInput = inputObjectType({
  name: "vehicleCreateInput",
  definition(t) {
    t.string("plateNumber");
    t.string("engineNumber");
    t.string("chassisNumber");
    t.string("vehicleModel");
    t.string("bodyType");
    t.string("horsePower");
    t.int("manufacturedYear");
    t.string("vehicleType");
    t.string("vehicleSubType");
    t.string("vehicleDetails");
    t.string("vehicleUsage");
    t.field("vehicleCategory", { type: VehicleCategory });
    t.int("passengerNumber");
    t.nullable.string("carryingCapacityInGoods");
    t.int("purchasedYear");
    t.float("dutyFreeValue");
    t.float("dutyPaidValue");
    t.field("vehicleStatus", { type: VehicleStatus });
    t.field("insureds", { type: insuredConnectInput });
    t.field("branchs", { type: branchConnectInput });

    // t.field("thirdPartyLog", { type: thirdPartyLogCreateInput });
  },
});

export const vehicleInsuranceCreateInput = inputObjectType({
  name: "vehicleInsuranceCreateInput",
  definition(t) {
    t.string("plateNumber");
    t.string("engineNumber");
    t.string("chassisNumber");
    t.string("vehicleModel");
    t.string("bodyType");
    t.string("horsePower");
    t.int("manufacturedYear");
    t.string("vehicleType");
    t.string("vehicleSubType");
    t.string("vehicleDetails");
    t.string("vehicleUsage");
    t.field("vehicleCategory", { type: VehicleCategory });
    t.int("passengerNumber");
    t.nullable.string("carryingCapacityInGoods");
    t.int("purchasedYear");
    t.float("dutyFreeValue");
    t.float("dutyPaidValue");
    t.field("vehicleStatus", { type: VehicleStatus });
    t.field("insureds", { type: insuredInsuranceCreateInput });
  },
});
export const vehicleUpdateInput = inputObjectType({
  name: "vehicleUpdateInput",
  definition(t) {
    t.string("plateNumber");
    t.string("vehicleModel");
    t.string("bodyType");
    t.string("horsePower");
    t.int("manufacturedYear");
    t.string("vehicleType");
    t.string("vehicleSubType");
    t.string("vehicleDetails");
    t.string("vehicleUsage");
    t.field("vehicleCategory", { type: VehicleCategory });
    // t.float("premiumTarif");
    t.int("passengerNumber");
    t.nullable.string("carryingCapacityInGoods");
    t.int("purchasedYear");
    t.float("dutyFreeValue");
    t.float("dutyPaidValue");
    t.field("vehicleStatus", { type: VehicleStatus });
    // t.field("insureds", { type: insuredMobileInput });
    // t.field("branchs", { type: branchConnectInput });

    // t.field("thirdPartyLog", { type: thirdPartyLogEditInput });
  },
});

export const VehicleStatus = enumType({
  name: "VehicleStatus",
  members: ["NEW", "RENEWAL", "ADDITIONAL"],
});

export const IsInsured = enumType({
  name: "IsInsured",
  members: ["INSURED", "NOTINSURED"],
});

export const STATUS = enumType({
  name: "STATUS",
  members: ["APPROVED", "SUSPENDED", "TRANSFERABLE"],
});

export const vehicleConnectInput = inputObjectType({
  name: "vehicleConnectInput",
  definition(t) {
    t.string("plateNumber");
  },
});

export const responsibleVehicleConnectInput = inputObjectType({
  name: "responsibleVehicleConnectInput",
  definition(t) {
    t.string("plateNumber");
    // t.string("certificateNumber");
  },
});

export const vehicleUpdateConnectionInput = inputObjectType({
  name: "vehicleUpdateConnectionInput",
  definition(t) {
    t.string("plateNumber");
  },
});

export const VehicleOrderByInput = inputObjectType({
  name: "VehicleOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});
