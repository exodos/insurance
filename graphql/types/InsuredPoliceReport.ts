import { changePhone, sendSmsMessage } from "@/lib/config";
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
        const maxPage = Math.ceil(totalInsuredPoliceReport / args?.take);

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
        const maxPage = Math.ceil(totalInsuredPoliceReport / args?.take);

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
        const maxPage = Math.ceil(totalInsuredPoliceReport / args?.take);

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
        const maxPage = Math.ceil(totalInsuredPoliceReport / args?.take);

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
        const maxPage = Math.ceil(totalInsuredPoliceReport / args?.take);

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
            email: ctx?.session?.user?.email,
          },
          include: {
            memberships: true,
          },
        });
        if (
          !user ||
          (user?.memberships?.role !== "SUPERADMIN" &&
            user?.memberships?.role !== "TRAFFICPOLICEADMIN" &&
            user?.memberships?.role !== "TRAFFICPOLICEMEMBER")
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

        const victimVehicle = await ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber:
              args.input.vehicle_PoliceReport_victimVehicle.plateNumber,
          },
          include: {
            branchs: true,
            insureds: true,
            certificates: true,
          },
        });

        if (!responsibleVehicle) {
          throw new Error(
            `The responsible vehicle may not be existed!! Please try again`
          );
        } else if (responsibleVehicle.isInsured !== "INSURED") {
          throw new Error(
            `The responsible vehicle may not be insured!! Please try again`
          );
        } else if (!victimVehicle) {
          throw new Error(
            `The Victim vehicle may not be existed!! Please try again`
          );
        } else if (victimVehicle.isInsured !== "INSURED") {
          throw new Error(
            `The victim vehicle may not be insured!! Please try again`
          );
        }

        const claimNumber = `CN-${format(new Date(), "yyMMiHms")}`,
          incidentNumber = `IN-${format(new Date(), "yyMMiHms")}`,
          victimMobileNumber = changePhone(args.input.victimPhoneNumber),
          victimName = args.input.victimDriverName;

        const newValue = {
          incidentNumber: incidentNumber,
          victimDriverName: args.input.victimDriverName,
          victimLicenceNumber: args.input.victimLicenceNumber,
          victimLevel: args.input.victimLevel,
          victimRegion: args.input.victimRegion,
          victimSubCity: args.input.victimSubCity,
          victimCity: args.input.victimCity,
          victimWereda: args.input.victimWereda,
          victimKebelle: args.input.victimKebelle,
          victimHouseNo: args.input.victimHouseNo,
          victimPhoneNumber: victimMobileNumber,
          incidentCause: args.input.incidentCause,
          incidentDate: new Date(args.input.incidentDate).toDateString(),
          incidentPlace: args.input.incidentPlace,
          incidentTime: args.input.incidentTime,
          responsibleDriverName: args.input.responsibleDriverName,
          responsiblePhoneNumber: args.input.responsiblePhoneNumber,
        };

        const response = await ctx.prisma.insuredPoliceReport.create({
          data: {
            incidentNumber: incidentNumber,
            victimDriverName: args.input.victimDriverName,
            victimLicenceNumber: args.input.victimLicenceNumber,
            victimLevel: args.input.victimLevel,
            victimRegion: args.input.victimRegion,
            victimSubCity: args.input.victimSubCity,
            victimCity: args.input.victimCity,
            victimWereda: args.input.victimWereda,
            victimKebelle: args.input.victimKebelle,
            victimHouseNo: args.input.victimHouseNo,
            victimPhoneNumber: victimMobileNumber,
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
                claimNumber: claimNumber,
                damageEstimate: args.input.claims.damageEstimate,
                insureds: {
                  connect: {
                    id: responsibleVehicle.insureds.id,
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
                thirdPartyLogs: {
                  create: {
                    userEmail: user.email,
                    action: "Create",
                    mode: "InsuredPoliceReport",
                    newValue: newValue,
                    branchCon: {
                      connect: {
                        id: args.input.policeBranch.id,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (response) {
          const mobileNumber = victimMobileNumber;
          const message = `Dear ${victimName}, The claim number is: ${claimNumber}`;
          await sendSmsMessage(mobileNumber, message);
        }

        return response;
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
            email: ctx?.session?.user?.email,
          },
          include: {
            memberships: true,
          },
        });
        if (
          !user ||
          (user?.memberships?.role !== "SUPERADMIN" &&
            user?.memberships?.role !== "TRAFFICPOLICEADMIN" &&
            user?.memberships?.role !== "TRAFFICPOLICEMEMBER")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        const oldPolice = await ctx.prisma.insuredPoliceReport.findFirst({
          where: { id: args.id },
        });

        const oldValue = {
          victimDriverName: oldPolice?.victimDriverName,
          victimLicenceNumber: oldPolice?.victimLicenceNumber,
          victimLevel: oldPolice?.victimLevel,
          victimRegion: oldPolice?.victimRegion,
          victimSubCity: oldPolice?.victimSubCity,
          victimCity: oldPolice?.victimCity,
          victimWereda: oldPolice?.victimWereda,
          victimKebelle: oldPolice?.victimKebelle,
          victimHouseNo: oldPolice?.victimHouseNo,
          victimPhoneNumber: oldPolice?.victimPhoneNumber,
          incidentCause: oldPolice?.incidentCause,
          incidentDate: new Date(oldPolice.incidentDate).toDateString(),
          incidentPlace: oldPolice?.incidentPlace,
          incidentTime: oldPolice?.incidentTime,
          responsibleDriverName: oldPolice?.responsibleDriverName,
          responsiblePhoneNumber: oldPolice?.responsiblePhoneNumber,
        };

        const newValue = {
          victimDriverName: args?.input?.victimDriverName,
          victimLicenceNumber: args?.input?.victimLicenceNumber,
          victimLevel: args?.input?.victimLevel,
          victimRegion: args?.input?.victimRegion,
          victimSubCity: args?.input?.victimSubCity,
          victimCity: args?.input?.victimCity,
          victimWereda: args?.input?.victimWereda,
          victimKebelle: args?.input?.victimKebelle,
          victimHouseNo: args?.input?.victimHouseNo,
          victimPhoneNumber: args?.input?.victimPhoneNumber,
          incidentCause: args?.input?.incidentCause,
          incidentDate: args?.input?.incidentDate,
          incidentPlace: args?.input?.incidentPlace,
          incidentTime: args?.input?.incidentTime,
          responsibleDriverName: args?.input?.responsibleDriverName,
          responsiblePhoneNumber: args?.input?.responsiblePhoneNumber,
        };
        return await ctx.prisma.insuredPoliceReport.update({
          where: { id: args.id },
          data: {
            ...args.input,
            thirdPartyLogs: {
              create: {
                userEmail: user.email,
                action: "Create",
                mode: "InsuredPoliceReport",
                oldValue: oldValue,
                newValue: newValue,
                branchCon: {
                  connect: {
                    id: oldPolice.policeBranchId,
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
            email: ctx?.session?.user?.email,
          },
          include: {
            memberships: true,
          },
        });
        if (
          !user ||
          (user?.memberships?.role !== "SUPERADMIN" &&
            user?.memberships?.role !== "TRAFFICPOLICEADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        const oldPolice = await ctx.prisma.insuredPoliceReport.findFirst({
          where: { id: args.id },
        });

        const oldValue = {
          victimDriverName: oldPolice?.victimDriverName,
          victimLicenceNumber: oldPolice?.victimLicenceNumber,
          victimLevel: oldPolice?.victimLevel,
          victimRegion: oldPolice?.victimRegion,
          victimSubCity: oldPolice?.victimSubCity,
          victimCity: oldPolice?.victimCity,
          victimWereda: oldPolice?.victimWereda,
          victimKebelle: oldPolice?.victimKebelle,
          victimHouseNo: oldPolice?.victimHouseNo,
          victimPhoneNumber: oldPolice?.victimPhoneNumber,
          incidentCause: oldPolice?.incidentCause,
          incidentDate: new Date(oldPolice.incidentDate).toDateString(),
          incidentPlace: oldPolice?.incidentPlace,
          incidentTime: oldPolice?.incidentTime,
          responsibleDriverName: oldPolice?.responsibleDriverName,
          responsiblePhoneNumber: oldPolice?.responsiblePhoneNumber,
        };
        return await ctx.prisma.$transaction(async (tx) => {
          const police = await tx.insuredPoliceReport.delete({
            where: {
              id: args.id,
            },
          });
          const logger = await tx.thirdPartyLog.create({
            data: {
              userEmail: user.email,
              action: "Delete",
              mode: "InsuredPoliceReport",
              oldValue: oldValue,
              branchCon: {
                connect: {
                  id: oldPolice.policeBranchId,
                },
              },
            },
          });
          return logger;
        });
      },
    });
  },
});

export const exportInsuredPoliceReportQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportInsuredPoliceReport", {
      type: InsuredPoliceReport,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.insuredPoliceReport.findMany({
          where: {
            reportDate: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
          },
          orderBy: {
            reportDate: "desc",
          },
        });
      },
    });
  },
});

export const exportInsuredPoliceReportInsurerQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportInsuredPoliceReportInsurer", {
      type: InsuredPoliceReport,
      args: {
        orgId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.insuredPoliceReport.findMany({
          where: {
            policeBranch: {
              orgId: args.orgId,
            },
            reportDate: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
          },
          orderBy: {
            reportDate: "desc",
          },
        });
      },
    });
  },
});

export const exportInsuredPoliceReportBranchQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportInsuredPoliceReportBranch", {
      type: InsuredPoliceReport,
      args: {
        branchId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.insuredPoliceReport.findMany({
          where: {
            policeBranchId: args.branchId,
            reportDate: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
          },
          orderBy: {
            reportDate: "desc",
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
