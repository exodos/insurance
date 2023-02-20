import { Prisma } from "@prisma/client";
import format from "date-fns/format";
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

import { Sort, userInput } from "./User";
import { victimCreateInput } from "./Victim";
import { ClaimUnInsuredCreateInput } from "./ClaimUnInsured";
import { branchConnectInput } from "./Branch";

export const UnInsuredPoliceReport = objectType({
  name: "UnInsuredPoliceReport",
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
    t.string("victimVehiclePlateNumber");
    t.string("incidentCause");
    t.date("incidentDate");
    t.string("incidentPlace");
    t.string("incidentTime");
    t.string("responsibleDriverName");
    t.string("responsiblePhoneNumber");
    t.string("responsibleVehiclePlateNumber");
    t.date("reportDate");
    t.nullable.list.nullable.field("victims", {
      type: "Victim",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.unInsuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .victims();
      },
    });
    t.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.unInsuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
    t.field("policeBranch", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.unInsuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .policeBranch();
      },
    });
    t.field("claimUnInsureds", {
      type: "ClaimUnInsured",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.unInsuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .claimUnInsureds();
      },
    });
    t.field("trafficPolices", {
      type: "User",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.unInsuredPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .trafficPolices();
      },
    });
  },
});

export const UnInsuredPoliceReportPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedUnInsuredPoliceReport", {
      type: FeedUnInsuredPoliceReport,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: list(nonNull(UnInsuredPoliceReportOrderByInput)),
        }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              incidentNumber: args.filter,
            }
          : {};

        const unInsuredPoliceReports =
          await ctx.prisma.unInsuredPoliceReport.findMany({
            where,
            skip: args?.skip as number | undefined,
            take: args?.take as number | undefined,
            orderBy: args?.orderBy as
              | Prisma.Enumerable<Prisma.InsuredPoliceReportOrderByWithRelationInput>
              | undefined,
          });

        const totalUnInsuredPoliceReport =
          await ctx.prisma.unInsuredPoliceReport.count({
            where,
          });
        const maxPage = Math.ceil(totalUnInsuredPoliceReport / 10);

        return {
          unInsuredPoliceReports,
          maxPage,
          totalUnInsuredPoliceReport,
        };
      },
    });
  },
});

export const UnInsuredPoliceReportPolicePagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedUnInsuredPoliceReportPolice", {
      type: FeedUnInsuredPoliceReportPolice,
      args: {
        branchId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: list(nonNull(UnInsuredPoliceReportOrderByInput)),
        }), // 1
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

        const unInsuredPoliceReports =
          await ctx.prisma.unInsuredPoliceReport.findMany({
            where,
            skip: args?.skip as number | undefined,
            take: args?.take as number | undefined,
            orderBy: args?.orderBy as
              | Prisma.Enumerable<Prisma.InsuredPoliceReportOrderByWithRelationInput>
              | undefined,
          });

        const totalUnInsuredPoliceReport =
          await ctx.prisma.unInsuredPoliceReport.count({
            where,
          });
        const maxPage = Math.ceil(totalUnInsuredPoliceReport / 10);

        return {
          unInsuredPoliceReports,
          maxPage,
          totalUnInsuredPoliceReport,
        };
      },
    });
  },
});

export const unInsuredPoliceReportByIncidentNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("unInsuredPoliceReportByIncidentNumber", {
      type: UnInsuredPoliceReport,
      args: { incidentNumber: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.unInsuredPoliceReport.findUnique({
          where: {
            incidentNumber: args.incidentNumber,
          },
        });
      },
    });
  },
});

export const createUnInsuredPoliceReportMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUnInsuredPoliceReport", {
      type: UnInsuredPoliceReport,
      args: {
        input: nonNull(UnInsuredPoliceReportCreateInput),
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
          throw new Error(`You do not have permission to perform the action`);
        }

        return await ctx.prisma.unInsuredPoliceReport.create({
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
            victimVehiclePlateNumber: args.input.victimVehiclePlateNumber,
            branchs: {
              connect: {
                id: args.input.branchs.id,
              },
            },
            policeBranch: {
              connect: {
                id: args.input.policeBranch.id,
              },
            },
            responsibleVehiclePlateNumber:
              args.input.responsibleVehiclePlateNumber,

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
            claimUnInsureds: {
              create: {
                claimNumber: `CN-${format(new Date(), "yyMMiHms")}`,
                damageEstimate: args.input.claimUnInsureds.damageEstimate,
                vehiclePlateNumber:
                  args.input.claimUnInsureds.vehiclePlateNumber,
                branchs: {
                  connect: {
                    id: args.input.branchs.id,
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

export const updateUnInsuredPoliceReportMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateUnInsuredPoliceReport", {
      type: UnInsuredPoliceReport,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(UnInsuredPoliceReportUpdateInput),
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
        return await ctx.prisma.unInsuredPoliceReport.update({
          where: { id: args.id },
          data: {
            ...args.input,
          },
        });
      },
    });
  },
});

export const deleteUnInsuredPoliceReportMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteUnInsuredPoliceReport", {
      type: UnInsuredPoliceReport,
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
        return await ctx.prisma.unInsuredPoliceReport.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const exportUnInsuredPoliceReportQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportUnInsuredPoliceReport", {
      type: UnInsuredPoliceReport,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.unInsuredPoliceReport.findMany({
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

export const FeedUnInsuredPoliceReport = objectType({
  name: "FeedUnInsuredPoliceReport",
  definition(t) {
    t.nonNull.list.nonNull.field("unInsuredPoliceReports", {
      type: UnInsuredPoliceReport,
    });
    t.nonNull.int("totalUnInsuredPoliceReport");
    t.int("maxPage");
  },
});

export const FeedUnInsuredPoliceReportPolice = objectType({
  name: "FeedUnInsuredPoliceReportPolice",
  definition(t) {
    t.nonNull.list.nonNull.field("unInsuredPoliceReports", {
      type: UnInsuredPoliceReport,
    });
    t.nonNull.int("totalUnInsuredPoliceReport");
    t.int("maxPage");
  },
});

export const UnInsuredPoliceReportCreateInput = inputObjectType({
  name: "UnInsuredPoliceReportCreateInput",
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
    t.string("victimVehiclePlateNumber");
    t.string("responsibleVehiclePlateNumber");
    t.nullable.list.nullable.field("victims", { type: victimCreateInput });
    t.field("branchs", { type: branchConnectInput });
    t.field("claimUnInsureds", { type: ClaimUnInsuredCreateInput });
    t.field("trafficPolices", { type: userInput });
    t.field("policeBranch", { type: branchConnectInput });

    // t.field("thirdPartyLog", { type: thirdPartyLogCreateInput });
  },
});

export const UnInsuredPoliceReportUpdateInput = inputObjectType({
  name: "UnInsuredPoliceReportUpdateInput",
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
    // t.string("victimVehiclePlateNumber");
    t.string("incidentCause");
    t.date("incidentDate");
    t.string("incidentPlace");
    t.string("incidentTime");
    t.string("responsibleDriverName");
    t.string("responsiblePhoneNumber");
    // t.string("responsibleVehiclePlateNumber");
  },
});

export const UnInsuredPoliceReportConnectInput = inputObjectType({
  name: "UnInsuredPoliceReportConnectInput",
  definition(t) {
    t.string("incidentNumber");
  },
});

export const UnInsuredPoliceReportOrderByInput = inputObjectType({
  name: "UnInsuredPoliceReportOrderByInput",
  definition(t) {
    t.field("reportDate", { type: Sort });
  },
});
