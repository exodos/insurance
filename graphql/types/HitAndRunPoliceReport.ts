import { victimCreateInput } from "./Victim";
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
import { ClaimHitAndRunConnectionInput } from "./ClaimHitAndRun";
import { branchConnectInput } from "./Branch";

export const HitAndRunPoliceReport = objectType({
  name: "HitAndRunPoliceReport",
  definition(t) {
    t.string("id");
    t.string("incidentNumber");
    t.string("incidentCause");
    t.date("incidentDate");
    t.string("incidentPlace");
    t.string("incidentTime");
    t.date("reportDate");
    t.nullable.list.nullable.field("victims", {
      type: "Victim",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.hitAndRunPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .victims();
      },
    });
    t.nullable.field("claimHitAndRuns", {
      type: "ClaimHitAndRun",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.hitAndRunPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .claimHitAndRuns();
      },
    });
    t.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.hitAndRunPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
    t.field("policeBranch", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.hitAndRunPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .policeBranch();
      },
    });
    t.field("trafficPolices", {
      type: "User",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.hitAndRunPoliceReport
          .findUnique({
            where: { id: _parent.id },
          })
          .trafficPolices();
      },
    });
  },
});

export const HitAndRunPoliceReportPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedHitAndRunPoliceReport", {
      type: FeedHitAndRunPoliceReport,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: list(nonNull(HitAndRunPoliceReportOrderByInput)),
        }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              incidentNumber: args.filter,
            }
          : {};

        // hitAndRunPoliceReport
        // totalHitAndRunPoliceReport
        const hitAndRunPoliceReport =
          await ctx.prisma.hitAndRunPoliceReport.findMany({
            where,
            skip: args?.skip as number | undefined,
            take: args?.take as number | undefined,
            orderBy: args?.orderBy as
              | Prisma.Enumerable<Prisma.HitAndRunPoliceReportOrderByWithRelationInput>
              | undefined,
          });

        const totalHitAndRunPoliceReport =
          await ctx.prisma.hitAndRunPoliceReport.count({
            where,
          });
        const maxPage = Math.ceil(totalHitAndRunPoliceReport / 10);

        return {
          hitAndRunPoliceReport,
          maxPage,
          totalHitAndRunPoliceReport,
        };
      },
    });
  },
});

export const HitAndRunPoliceReportPolicePagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedHitAndRunReportPolice", {
      type: FeedHitAndRunReportPolice,
      args: {
        branchId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({
          type: list(nonNull(HitAndRunPoliceReportOrderByInput)),
        }),
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

        const hitAndRunPoliceReport =
          await ctx.prisma.hitAndRunPoliceReport.findMany({
            where,
            skip: args?.skip as number | undefined,
            take: args?.take as number | undefined,
            orderBy: args?.orderBy as
              | Prisma.Enumerable<Prisma.HitAndRunPoliceReportOrderByWithRelationInput>
              | undefined,
          });

        const totalHitAndRunPoliceReport =
          await ctx.prisma.hitAndRunPoliceReport.count({
            where,
          });
        const maxPage = Math.ceil(totalHitAndRunPoliceReport / 10);

        return {
          hitAndRunPoliceReport,
          maxPage,
          totalHitAndRunPoliceReport,
        };
      },
    });
  },
});

export const HitAndRunByIncidentNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("hitAndRunByIncidentNumber", {
      type: HitAndRunPoliceReport,
      args: { incidentNumber: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.hitAndRunPoliceReport.findUnique({
          where: {
            incidentNumber: args.incidentNumber,
          },
        });
      },
    });
  },
});

export const createHitAndRunPoliceReportMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createHitAndRunPoliceReport", {
      type: HitAndRunPoliceReport,
      args: {
        input: nonNull(hitAndRunCreateInput),
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

        return await ctx.prisma.hitAndRunPoliceReport.create({
          data: {
            incidentNumber: `IN-${format(new Date(), "yyMMiHms")}`,
            incidentCause: args.input.incidentCause,
            incidentDate: args.input.incidentDate,
            incidentPlace: args.input.incidentPlace,
            incidentTime: args.input.incidentTime,
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
            trafficPolices: {
              connect: {
                id: args.input.trafficPolices.id,
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
            claimHitAndRuns: {
              create: {
                claimNumber: `CN-${format(new Date(), "yyMMiHms")}`,
                damageEstimate: args.input.claimHitAndRuns.damageEstimate,
                claimerFullName: args.input.claimHitAndRuns.claimerFullName,
                claimerRegion: args.input.claimHitAndRuns.claimerRegion,
                claimerCity: args.input.claimHitAndRuns.claimerCity,
                claimerPhoneNumber:
                  args.input.claimHitAndRuns.claimerPhoneNumber,
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

export const updateHitAndRunPoliceReport = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateHitAndRunPoliceReport", {
      type: HitAndRunPoliceReport,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(hitAndRunUpdateInput),
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
        return await ctx.prisma.hitAndRunPoliceReport.update({
          where: { id: args.id },
          data: {
            // ...args.input,
            incidentCause: args.input.incidentCause,
            incidentDate: args.input.incidentDate,
            incidentPlace: args.input.incidentPlace,
            incidentTime: args.input.incidentTime,
            // trafficPoliceName: args.input.trafficPoliceName,
            // trafficPolicePhoneNumber: args.input.trafficPoliceName,
            // policeStationName: args.input.policeStationName,
          },
        });
      },
    });
  },
});

export const deleteHitRunPoliceReportMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteHitRunPoliceReport", {
      type: HitAndRunPoliceReport,
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
        return await ctx.prisma.hitAndRunPoliceReport.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const FeedHitAndRunPoliceReport = objectType({
  name: "FeedHitAndRunPoliceReport",
  definition(t) {
    t.nonNull.list.nonNull.field("hitAndRunPoliceReport", {
      type: HitAndRunPoliceReport,
    });
    t.nonNull.int("totalHitAndRunPoliceReport");
    t.int("maxPage");
  },
});

export const FeedHitAndRunReportPolice = objectType({
  name: "FeedHitAndRunReportPolice",
  definition(t) {
    t.nonNull.list.nonNull.field("hitAndRunPoliceReport", {
      type: HitAndRunPoliceReport,
    });
    t.nonNull.int("totalHitAndRunPoliceReport");
    t.int("maxPage");
  },
});

export const hitAndRunCreateInput = inputObjectType({
  name: "hitAndRunCreateInput",
  definition(t) {
    // t.string("incidentNumber");
    t.string("incidentCause");
    t.date("incidentDate");
    t.string("incidentPlace");
    t.string("incidentTime");
    t.nullable.list.nullable.field("victims", { type: victimCreateInput });
    t.field("claimHitAndRuns", { type: ClaimHitAndRunConnectionInput });
    t.field("branchs", { type: branchConnectInput });
    t.field("trafficPolices", { type: userInput });
    t.field("policeBranch", { type: branchConnectInput });

    // t.field("thirdPartyLog", { type: thirdPartyLogCreateInput });
  },
});

export const hitAndRunUpdateInput = inputObjectType({
  name: "hitAndRunUpdateInput",
  definition(t) {
    t.string("incidentCause");
    t.date("incidentDate");
    t.string("incidentPlace");
    t.string("incidentTime");
    // t.string("trafficPoliceName");
    // t.string("trafficPolicePhoneNumber");
    // t.string("policeStationName");
    // t.field("victim", { type: victimCreateInput });
  },
});

export const hitAndRunPoliceReportConnectInput = inputObjectType({
  name: "hitAndRunPoliceReportConnectInput",
  definition(t) {
    t.string("incidentNumber");
  },
});

export const HitAndRunPoliceReportOrderByInput = inputObjectType({
  name: "HitAndRunPoliceReportOrderByInput",
  definition(t) {
    t.field("reportDate", { type: Sort });
  },
});
