import { Prisma } from "@prisma/client";
import format from "date-fns/format";
import {
  arg,
  asNexusMethod,
  extendType,
  inputObjectType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus";

import { responsibleVehicleConnectInput, vehicleConnectInput } from "./Vehicle";
import { GraphQLTime } from "graphql-scalars";
import GraphQLJSON from "graphql-type-json";
import { Sort, userInput } from "./User";
import { victimCreateInput } from "./Victim";
import { claimDamageInput } from "./Claim";
import { branchConnectInput } from "./Branch";

export const GQLTime = asNexusMethod(GraphQLTime, "time");
export const GQLJson = asNexusMethod(GraphQLJSON, "json");

export const InsuredPoliceReport = objectType({
  name: "InsuredPoliceReport",
  definition(t) {
    t.string("id");
    t.string("incidentNumber");
    t.string("victimDriverName");
    t.string("victimLicenceNumber");
    t.string("victimLevel");
    t.string("victimRegion");
    t.string("victimCity");
    t.string("victimSubCity");
    t.string("victimWereda");
    t.string("victimKebelle");
    t.string("victimHouseNo");
    t.string("victimPhoneNumber");
    t.string("incidentCause");
    t.date("incidentDate");
    t.string("incidentPlace");
    t.string("incidentTime");
    t.string("responsibleDriverName");
    t.string("responsiblePhoneNumber");
    t.date("reportDate");
    t.nullable.list.nullable.field("victims", {
      type: "Victim",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.insuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .victims();
      },
    });
    t.field("vehicle_PoliceReport_victimVehicle", {
      type: "Vehicle",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.insuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .vehicle_PoliceReport_victimVehicle();
      },
    });
    t.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.insuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
    t.field("policeBranch", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.insuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .policeBranch();
      },
    });
    t.field("vehicle_PoliceReport_responsibleVehicle", {
      type: "Vehicle",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.insuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .vehicle_PoliceReport_responsibleVehicle();
      },
    });
    t.field("claims", {
      type: "Claim",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.insuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .claims();
      },
    });
    t.field("trafficPolices", {
      type: "User",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.insuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .trafficPolices();
      },
    });
  },
});

export const InsuredPoliceReportPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedInsuredPoliceReport", {
      type: FeedInsuredPoliceReport,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(InsuredPoliceReportOrderByInput)) }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              incidentNumber: args.filter,
            }
          : {};

        const insuredPoliceReports =
          await ctx.prisma.insuredPoliceReport.findMany({
            where,
            skip: args?.skip as number | undefined,
            take: args?.take as number | undefined,
            orderBy: args?.orderBy as
              | Prisma.Enumerable<Prisma.InsuredPoliceReportOrderByWithRelationInput>
              | undefined,
          });

        const totalInsuredPoliceReport =
          await ctx.prisma.insuredPoliceReport.count({
            where,
          });
        const maxPage = Math.ceil(totalInsuredPoliceReport / 10);

        return {
          insuredPoliceReports,
          maxPage,
          totalInsuredPoliceReport,
        };
      },
    });
  },
});

export const InsuredBranchPoliceReportPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedInsuredPoliceReportBranch", {
      type: FeedInsuredPoliceReportBranch,
      args: {
        branchId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(InsuredPoliceReportOrderByInput)) }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              branchId: args.branchId,
              incidentNumber: args.filter,
            }
          : {
              branchId: args.branchId,
            };

        const insuredPoliceReports =
          await ctx.prisma.insuredPoliceReport.findMany({
            where,
            skip: args?.skip as number | undefined,
            take: args?.take as number | undefined,
            orderBy: args?.orderBy as
              | Prisma.Enumerable<Prisma.InsuredPoliceReportOrderByWithRelationInput>
              | undefined,
          });

        const totalInsuredPoliceReport =
          await ctx.prisma.insuredPoliceReport.count({
            where,
          });
        const maxPage = Math.ceil(totalInsuredPoliceReport / 10);

        return {
          insuredPoliceReports,
          maxPage,
          totalInsuredPoliceReport,
        };
      },
    });
  },
});

export const PoliceReportPaginationByPolice = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedInsuredPoliceReportByPolice", {
      type: FeedInsuredPoliceReportByPolice,
      args: {
        branchId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(InsuredPoliceReportOrderByInput)) }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              policeBranch: {
                id: args.branchId,
              },
              incidentNumber: args.filter,
            }
          : {
              policeBranch: {
                id: args.branchId,
              },
            };

        const insuredPoliceReports =
          await ctx.prisma.insuredPoliceReport.findMany({
            where,
            skip: args?.skip as number | undefined,
            take: args?.take as number | undefined,
            orderBy: args?.orderBy as
              | Prisma.Enumerable<Prisma.InsuredPoliceReportOrderByWithRelationInput>
              | undefined,
          });

        const totalInsuredPoliceReport =
          await ctx.prisma.insuredPoliceReport.count({
            where,
          });
        const maxPage = Math.ceil(totalInsuredPoliceReport / 10);

        return {
          insuredPoliceReports,
          maxPage,
          totalInsuredPoliceReport,
        };
      },
    });
  },
});

export const InsuredInsurerPoliceReportPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedInsuredPoliceReportInsurer", {
      type: FeedInsuredPoliceReportInsurer,
      args: {
        orgId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(InsuredPoliceReportOrderByInput)) }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              branchs: {
                orgId: args.orgId,
              },
              incidentNumber: args.filter,
            }
          : {
              branchs: {
                orgId: args.orgId,
              },
            };

        const insuredPoliceReports =
          await ctx.prisma.insuredPoliceReport.findMany({
            where,
            skip: args?.skip as number | undefined,
            take: args?.take as number | undefined,
            orderBy: args?.orderBy as
              | Prisma.Enumerable<Prisma.InsuredPoliceReportOrderByWithRelationInput>
              | undefined,
          });

        const totalInsuredPoliceReport =
          await ctx.prisma.insuredPoliceReport.count({
            where,
          });
        const maxPage = Math.ceil(totalInsuredPoliceReport / 10);

        return {
          insuredPoliceReports,
          maxPage,
          totalInsuredPoliceReport,
        };
      },
    });
  },
});

export const InsuredPolicePoliceReportPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedInsuredPoliceReportPolice", {
      type: FeedInsuredPoliceReportPolice,
      args: {
        orgId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(InsuredPoliceReportOrderByInput)) }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              policeBranch: {
                orgId: args.orgId,
              },
              incidentNumber: args.filter,
            }
          : {
              policeBranch: {
                orgId: args.orgId,
              },
            };

        const insuredPoliceReports =
          await ctx.prisma.insuredPoliceReport.findMany({
            where,
            skip: args?.skip as number | undefined,
            take: args?.take as number | undefined,
            orderBy: args?.orderBy as
              | Prisma.Enumerable<Prisma.InsuredPoliceReportOrderByWithRelationInput>
              | undefined,
          });

        const totalInsuredPoliceReport =
          await ctx.prisma.insuredPoliceReport.count({
            where,
          });
        const maxPage = Math.ceil(totalInsuredPoliceReport / 10);

        return {
          insuredPoliceReports,
          maxPage,
          totalInsuredPoliceReport,
        };
      },
    });
  },
});

export const insuredPoliceReportByIncidentNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("insuredPoliceReportByIncidentNumber", {
      type: InsuredPoliceReport,
      args: { incidentNumber: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.insuredPoliceReport.findUnique({
          where: {
            incidentNumber: args.incidentNumber,
          },
        });
      },
    });
  },
});

export const incidentNumberToClaimQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("incidentNumberToClaim", {
      type: InsuredPoliceReport,
      args: { incidentNumber: nonNull(stringArg()) },
      resolve: async (_parent, args, ctx) => {
        const isConnected = await ctx.prisma.claim.findUnique({
          where: {
            incidentNumber: args.incidentNumber,
          },
        });
        if (isConnected) {
          throw new Error("This incident number is already claimed");
        }
        return await ctx.prisma.insuredPoliceReport.findUnique({
          where: {
            incidentNumber: args.incidentNumber,
          },
        });
      },
    });
  },
});

export const createInsuredPoliceReportMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createInsuredPoliceReport", {
      type: InsuredPoliceReport,
      args: {
        input: nonNull(insuredPoliceReportCreateInput),
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
          throw new Error(`You do not have permission to perform the action`);
        }

        const responsibleVehicle = await ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber:
              args.input.vehicle_PoliceReport_responsibleVehicle.plateNumber,
          },
          include: {
            branchs: true,
            insureds: true,
            certificates: true,
          },
        });
        return await ctx.prisma.insuredPoliceReport.create({
          data: {
            incidentNumber: `IN-${format(new Date(), "yyMMiHms")}`,
            victimDriverName: args.input.victimDriverName,
            victimLicenceNumber: args.input.victimLicenceNumber,
            victimLevel: args.input.victimLevel,
            victimRegion: args.input.victimRegion,
            victimSubCity: args.input.victimSubCity,
            victimCity: args.input.victimCity,
            victimWereda: args.input.victimWereda,
            victimKebelle: args.input.victimKebelle,
            victimHouseNo: args.input.victimHouseNo,
            victimPhoneNumber: args.input.victimPhoneNumber,
            incidentCause: args.input.incidentCause,
            incidentDate: args.input.incidentDate,
            incidentPlace: args.input.incidentPlace,
            incidentTime: args.input.incidentTime,
            responsibleDriverName: args.input.responsibleDriverName,
            responsiblePhoneNumber: args.input.responsiblePhoneNumber,
            trafficPolices: {
              connect: {
                id: args.input.trafficPolices.id,
              },
            },
            vehicle_PoliceReport_victimVehicle: {
              connect: {
                plateNumber:
                  args.input.vehicle_PoliceReport_victimVehicle.plateNumber,
              },
            },
            branchs: {
              connect: {
                id: responsibleVehicle.branchs.id,
              },
            },
            policeBranch: {
              connect: {
                id: args.input.policeBranch.id,
              },
            },
            vehicle_PoliceReport_responsibleVehicle: {
              connect: {
                plateNumber:
                  args.input.vehicle_PoliceReport_responsibleVehicle
                    .plateNumber,
              },
            },
            victims: {
              create: args.input.victims.map((v) => ({
                victimName: v.victimName,
                victimCondition: v.victimCondition,
                injuryType: v.injuryType,
                victimAddress: v.victimAddress,
                victimFamilyPhoneNumber: v.victimFamilyPhoneNumber,
                victimHospitalized: v.victimHospitalized,
              })),
            },
            claims: {
              create: {
                claimNumber: `CN-${format(new Date(), "yyMMiHms")}`,
                damageEstimate: args.input.claims.damageEstimate,
                insureds: {
                  connect: {
                    mobileNumber: responsibleVehicle.insureds.mobileNumber,
                  },
                },
                vehicles: {
                  connect: {
                    plateNumber:
                      args.input.vehicle_PoliceReport_victimVehicle.plateNumber,
                  },
                },
                branchs: {
                  connect: {
                    id: responsibleVehicle.branchs.id,
                  },
                },
                certificates: {
                  connect: {
                    certificateNumber:
                      responsibleVehicle.certificates.certificateNumber,
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

export const updateInsuredPoliceReportMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateInsuredPoliceReport", {
      type: InsuredPoliceReport,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(InsuredPoliceReportUpdateInput),
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
        return await ctx.prisma.insuredPoliceReport.update({
          where: { id: args.id },
          data: {
            ...args.input,
          },
        });
      },
    });
  },
});

export const deleteInsuredPoliceReportMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteInsuredPoliceReport", {
      type: InsuredPoliceReport,
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
        return await ctx.prisma.insuredPoliceReport.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const FeedInsuredPoliceReport = objectType({
  name: "FeedInsuredPoliceReport",
  definition(t) {
    t.nonNull.list.nonNull.field("insuredPoliceReports", {
      type: InsuredPoliceReport,
    });
    t.nonNull.int("totalInsuredPoliceReport");
    t.int("maxPage");
  },
});

export const FeedInsuredPoliceReportBranch = objectType({
  name: "FeedInsuredPoliceReportBranch",
  definition(t) {
    t.nonNull.list.nonNull.field("insuredPoliceReports", {
      type: InsuredPoliceReport,
    });
    t.nonNull.int("totalInsuredPoliceReport");
    t.int("maxPage");
  },
});

export const FeedInsuredPoliceReportByPolice = objectType({
  name: "FeedInsuredPoliceReportByPolice",
  definition(t) {
    t.nonNull.list.nonNull.field("insuredPoliceReports", {
      type: InsuredPoliceReport,
    });
    t.nonNull.int("totalInsuredPoliceReport");
    t.int("maxPage");
  },
});

export const FeedInsuredPoliceReportInsurer = objectType({
  name: "FeedInsuredPoliceReportInsurer",
  definition(t) {
    t.nonNull.list.nonNull.field("insuredPoliceReports", {
      type: InsuredPoliceReport,
    });
    t.nonNull.int("totalInsuredPoliceReport");
    t.int("maxPage");
  },
});

export const FeedInsuredPoliceReportPolice = objectType({
  name: "FeedInsuredPoliceReportPolice",
  definition(t) {
    t.nonNull.list.nonNull.field("insuredPoliceReports", {
      type: InsuredPoliceReport,
    });
    t.nonNull.int("totalInsuredPoliceReport");
    t.int("maxPage");
  },
});

export const insuredPoliceReportCreateInput = inputObjectType({
  name: "insuredPoliceReportCreateInput",
  definition(t) {
    t.string("victimDriverName");
    t.string("victimLicenceNumber");
    t.string("victimLevel");
    t.string("victimRegion");
    t.string("victimSubCity");
    t.string("victimCity");
    t.string("victimWereda");
    t.string("victimKebelle");
    t.string("victimHouseNo");
    t.string("victimPhoneNumber");
    t.string("incidentCause");
    t.date("incidentDate");
    t.string("incidentPlace");
    t.string("incidentTime");
    t.nullable.list.nullable.field("victims", { type: victimCreateInput });
    t.string("responsibleDriverName");
    t.string("responsiblePhoneNumber");
    t.field("vehicle_PoliceReport_victimVehicle", {
      type: vehicleConnectInput,
    });
    t.field("vehicle_PoliceReport_responsibleVehicle", {
      type: responsibleVehicleConnectInput,
    });
    t.field("claims", { type: claimDamageInput });
    t.field("trafficPolices", { type: userInput });
    t.field("policeBranch", { type: branchConnectInput });

    // t.field("thirdPartyLog", { type: thirdPartyLogCreateInput });
  },
});

export const InsuredPoliceReportUpdateInput = inputObjectType({
  name: "InsuredPoliceReportUpdateInput",
  definition(t) {
    t.string("victimDriverName");
    t.string("victimLicenceNumber");
    t.string("victimLevel");
    t.string("victimRegion");
    t.string("victimSubCity");
    t.string("victimCity");
    t.string("victimWereda");
    t.string("victimKebelle");
    t.string("victimHouseNo");
    t.string("victimPhoneNumber");
    t.string("incidentCause");
    t.date("incidentDate");
    t.string("incidentPlace");
    t.string("incidentTime");
    t.string("responsibleDriverName");
    t.string("responsiblePhoneNumber");
    // t.string("trafficPoliceName");
    // t.string("trafficPolicePhoneNumber");
    // t.string("policeStationName");
  },
});

export const InsuredPoliceReportConnectInput = inputObjectType({
  name: "InsuredPoliceReportConnectInput",
  definition(t) {
    t.string("incidentNumber");
  },
});

export const InsuredPoliceReportOrderByInput = inputObjectType({
  name: "InsuredPoliceReportOrderByInput",
  definition(t) {
    t.field("reportDate", { type: Sort });
  },
});
