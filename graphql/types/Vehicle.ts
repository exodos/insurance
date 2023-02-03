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
import { insuredMobileInput } from "./Insured";
import { Sort } from "./User";
import { branchConnectInput } from "./Branch";

export const Vehicle = objectType({
  name: "Vehicle",
  definition(t) {
    t.string("id");
    t.string("plateNumber");
    t.string("engineNumber");
    t.string("chassisNumber");
    t.string("vehicleType");
    t.string("carryingCapacityInGoods");
    t.string("carryingCapacityInPersons");
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
            plateNumber: args.plateNumber,
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
            user.memberships.role !== "MEMBER")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        const checkInsured = await ctx.prisma.insured.findFirst({
          where: {
            mobileNumber: args.input.insureds.mobileNumber,
          },
        });
        if (!checkInsured) {
          throw new Error(
            `We Could\'n find Insured with the provided mobile number`
          );
        }
        return await ctx.prisma.vehicle.create({
          data: {
            plateNumber: args.input.plateNumber,
            engineNumber: args.input.engineNumber,
            chassisNumber: args.input.chassisNumber,
            vehicleType: args.input.vehicleType,
            carryingCapacityInGoods: args.input.carryingCapacityInGoods,
            carryingCapacityInPersons: args.input.carryingCapacityInPersons,
            vehicleStatus: args.input.vehicleStatus,
            insureds: {
              connect: {
                mobileNumber: args.input.insureds.mobileNumber,
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
            user.memberships.role !== "MEMBER")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.vehicle.update({
          where: { id: args.id },
          data: {
            ...args.input,
            insureds: {
              connect: {
                mobileNumber: args.input.insureds.mobileNumber,
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
    t.nonNull.list.nonNull.field("vehicle", { type: Vehicle }); // 1
    t.nonNull.int("totalVehicle"); // 2
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

export const vehicleCreateInput = inputObjectType({
  name: "vehicleCreateInput",
  definition(t) {
    t.string("plateNumber");
    t.string("engineNumber");
    t.string("chassisNumber");
    t.string("vehicleType");
    t.string("carryingCapacityInGoods");
    t.string("carryingCapacityInPersons");
    t.field("vehicleStatus", { type: VehicleStatus });
    t.field("insureds", { type: insuredMobileInput });
    t.field("branchs", { type: branchConnectInput });

    // t.field("thirdPartyLog", { type: thirdPartyLogCreateInput });
  },
});

export const vehicleUpdateInput = inputObjectType({
  name: "vehicleUpdateInput",
  definition(t) {
    t.string("plateNumber");
    t.string("engineNumber");
    t.string("chassisNumber");
    t.string("vehicleType");
    t.string("carryingCapacityInGoods");
    t.string("carryingCapacityInPersons");
    t.field("vehicleStatus", { type: VehicleStatus });
    t.field("insureds", { type: insuredMobileInput });
    t.field("branchs", { type: branchConnectInput });

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
