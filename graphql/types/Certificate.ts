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
  addYears,
  endOfDay,
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  subYears,
} from "date-fns";
import { Prisma, Vehicle } from "@prisma/client";
import { policyCreateInput, policyUpdateInput } from "./Policy";
import { format } from "date-fns";
import { Sort } from "./User";
import { branchConnectInput } from "./Branch";
import {
  IsInsured,
  VehicleStatus,
  vehicleInsuranceCreateInput,
} from "./Vehicle";
import { changePhone } from "@/lib/config";

export const Certificate = objectType({
  name: "Certificate",
  definition(t) {
    t.string("id");
    t.string("certificateNumber");
    t.field("status", { type: InsuranceStatus });
    t.float("premiumTarif");
    t.date("issuedDate");
    t.date("updatedAt");
    t.field("vehicles", {
      type: "Vehicle",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.certificate
          .findUnique({
            where: { id: _parent.id },
          })
          .vehicles();
      },
    });
    t.field("policies", {
      type: "Policy",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.certificate
          .findUnique({
            where: { id: _parent.id },
          })
          .policies();
      },
    });
    t.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.certificate
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
    t.list.field("claims", {
      type: "Claim",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.certificate
          .findUnique({
            where: { id: _parent.id },
          })
          .claims();
      },
    });
    t.list.field("certificateRecords", {
      type: "CertificateRecord",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.certificate
          .findUnique({
            where: { id: _parent.id },
          })
          .certificateRecords();
      },
    });
    t.nullable.list.nonNull.field("payments", {
      type: "Payment",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.certificate
          .findUnique({
            where: { id: _parent.id },
          })
          .payments();
      },
    });
  },
});

export const CertificatePagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedCertificate", {
      type: FeedCertificate,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(CertificateOrderByInput)) }),
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              OR: [
                { certificateNumber: args.filter },
                { vehiclePlateNumber: args.filter },
                { policyNumber: args.filter },
              ],
            }
          : {};

        const certificate = await ctx.prisma.certificate.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.CertificateOrderByWithRelationInput>
            | undefined,
        });

        const totalCertificate = await ctx.prisma.certificate.count({
          where,
        });
        const maxPage = Math.ceil(totalCertificate / args?.take);

        return {
          certificate,
          maxPage,
          totalCertificate,
        };
      },
    });
  },
});

export const CertificateBranchPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedCertificateBranch", {
      type: FeedCertificateBranch,
      args: {
        branchId: nonNull(stringArg()),
        // input: nonNull(InsuranceStatusInput),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(CertificateOrderByInput)) }),
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              branchId: args.branchId,
              // status: args.input.status,
              OR: [
                { certificateNumber: args.filter },
                { vehiclePlateNumber: args.filter },
                { policyNumber: args.filter },
              ],
            }
          : {
              branchId: args.branchId,
              // status: args.input.status,
            };

        const certificate = await ctx.prisma.certificate.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.CertificateOrderByWithRelationInput>
            | undefined,
        });

        const totalCertificate = await ctx.prisma.certificate.count({
          where,
        });
        const maxPage = Math.ceil(totalCertificate / args?.take);

        return {
          certificate,
          maxPage,
          totalCertificate,
        };
      },
    });
  },
});
export const CertificateInsurerPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedCertificateInsurer", {
      type: FeedCertificateInsurer,
      args: {
        orgId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(CertificateOrderByInput)) }),
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              branchs: {
                orgId: args.orgId,
              },
              OR: [
                { certificateNumber: args.filter },
                { vehiclePlateNumber: args.filter },
                { policyNumber: args.filter },
              ],
            }
          : {
              branchs: {
                orgId: args.orgId,
              },
            };

        const certificate = await ctx.prisma.certificate.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.CertificateOrderByWithRelationInput>
            | undefined,
        });

        const totalCertificate = await ctx.prisma.certificate.count({
          where,
        });
        const maxPage = Math.ceil(totalCertificate / args?.take);

        return {
          certificate,
          maxPage,
          totalCertificate,
        };
      },
    });
  },
});

export const exportCertificateQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportCertificate", {
      type: Certificate,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.certificate.findMany({
          where: {
            issuedDate: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
          },
          orderBy: {
            issuedDate: "desc",
          },
        });
      },
    });
  },
});

export const exportCertificateInsurerQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportCertificateInsurer", {
      type: Certificate,
      args: {
        orgId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.certificate.findMany({
          where: {
            branchs: {
              orgId: args.orgId,
            },
            issuedDate: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
          },
          orderBy: {
            issuedDate: "desc",
          },
        });
      },
    });
  },
});

export const exportCertificateranchQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportCertificateBranch", {
      type: Certificate,
      args: {
        branchId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.certificate.findMany({
          where: {
            branchId: args.branchId,
            issuedDate: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
          },
          orderBy: {
            issuedDate: "desc",
          },
        });
      },
    });
  },
});

export const certificateReportQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("insuredcertificateCountReport", {
      type: CertificateCountReport,
      args: {
        insuranceType: nonNull(stringArg()),
        filter: nonNull(stringArg()),
        reportFor: nonNull(stringArg()),
        vehicleSearch: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        let variable = args.vehicleSearch,
          fetchReport = args.reportFor,
          where: any,
          vType = args.insuranceType;
        let endDate: Date, startDate: Date;
        if (fetchReport === "daily") {
          endDate = endOfToday();
          startDate = startOfToday();
        } else if (fetchReport === "weekly") {
          endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
          startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
        } else if (fetchReport === "monthly") {
          endDate = endOfMonth(new Date());
          startDate = startOfMonth(new Date());
        }
        if (vType === "New") {
          if (variable === "vehicleType") {
            where = {
              status: "APPROVED",
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              vehicles: {
                vehicleType: args.filter,
                vehicleStatus: "NEW",
              },
            };
          } else if (variable === "region") {
            where = {
              status: "APPROVED",
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              vehicles: {
                vehicleStatus: "NEW",
              },
              branchs: {
                // [variable]: args.filter,
                region: args.filter,
              },
            };
          } else if (variable === "plateCode") {
            where = {
              status: "APPROVED",
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              vehicles: {
                vehicleStatus: "NEW",
                plateNumber: {
                  startsWith: args.filter,
                },
              },
            };
          } else if (variable === "insurance") {
            where = {
              status: "APPROVED",
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              vehicles: {
                vehicleStatus: "NEW",
              },
              branchs: {
                organizations: {
                  orgName: args.filter,
                },
              },
            };
          }
        } else if (vType === "Renewal") {
          if (variable === "vehicleType") {
            where = {
              status: "APPROVED",
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              vehicles: {
                vehicleType: args.filter,
                vehicleStatus: "RENEWAL",
              },
            };
          } else if (variable === "region") {
            where = {
              status: "APPROVED",
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              vehicles: {
                vehicleStatus: "RENEWAL",
              },
              branchs: {
                // [variable]: args.filter,
                region: args.filter,
              },
            };
          } else if (variable === "plateCode") {
            where = {
              status: "APPROVED",
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              vehicles: {
                vehicleStatus: "RENEWAL",
                plateNumber: {
                  startsWith: args.filter,
                },
              },
            };
          } else if (variable === "insurance") {
            where = {
              status: "APPROVED",
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              vehicles: {
                vehicleStatus: "RENEWAL",
              },
              branchs: {
                organizations: {
                  orgName: args.filter,
                },
              },
            };
          }
        } else if (vType === "NotRenewed") {
          if (variable === "vehicleType") {
            where = {
              NOT: {
                status: "APPROVED",
              },
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              policies: {
                policyExpireDate: {
                  lt: new Date(),
                },
              },
              vehicles: {
                vehicleType: args.filter,
              },
            };
          } else if (variable === "region") {
            where = {
              NOT: {
                status: "APPROVED",
              },
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              policies: {
                policyExpireDate: {
                  lt: new Date(),
                },
              },
              branchs: {
                // [variable]: args.filter,
                region: args.filter,
              },
            };
          } else if (variable === "plateCode") {
            where = {
              NOT: {
                status: "APPROVED",
              },
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              policies: {
                policyExpireDate: {
                  lt: new Date(),
                },
              },
              vehicles: {
                plateNumber: {
                  startsWith: args.filter,
                },
              },
            };
          } else if (variable === "insurance") {
            where = {
              NOT: {
                status: "APPROVED",
              },
              updatedAt: {
                lte: new Date(endDate),
                gte: new Date(startDate),
              },
              policies: {
                policyExpireDate: {
                  lt: new Date(),
                },
              },
              branchs: {
                organizations: {
                  orgName: args.filter,
                },
              },
            };
          }
        } else {
          where = {};
        }
        const count = await ctx.prisma.certificate.count({
          where,
        });

        return {
          count,
        };
      },
    });
  },
});

export const weeklyCertificateReportQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("weeklyReport", {
      type: WeeklyReport,
      args: {
        insuranceType: nonNull(stringArg()),
        filter: nonNull(stringArg()),
        reportFor: nonNull(stringArg()),
        vehicleSearch: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        let variable = args.vehicleSearch,
          fetchReport = args.reportFor,
          where: any;
        let endDate: Date, startDate: Date;
        if (fetchReport === "daily") {
          endDate = endOfToday();
          startDate = startOfToday();
        } else if (fetchReport === "weekly") {
          endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
          startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
        } else if (fetchReport === "monthly") {
          endDate = endOfMonth(new Date());
          startDate = startOfMonth(new Date());
        }

        if (variable === "vehicleType") {
          where = {
            status: "APPROVED",
            updatedAt: {
              lte: new Date(endDate),
              gte: new Date(startDate),
            },
            vehicles: {
              vehicleType: args.filter,
              VehicleStatus: VehicleStatus["NEW"],
            },
          };
        } else if (variable === "region") {
          where = {
            status: InsuranceStatus["APPROVED"],
            updatedAt: {
              lte: new Date(endDate),
              gte: new Date(startDate),
            },
            vehicles: {
              VehicleStatus: VehicleStatus["NEW"],
            },
            branchs: {
              // [variable]: args.filter,
              region: args.filter,
            },
          };
        } else if (variable === "plateCode") {
          where = {
            status: InsuranceStatus["APPROVED"],
            updatedAt: {
              lte: new Date(endDate),
              gte: new Date(startDate),
            },
            vehicles: {
              VehicleStatus: VehicleStatus["NEW"],
              plateNumber: {
                startsWith: args.filter,
              },
            },
          };
        } else if (variable === "insurance") {
          where = {
            status: InsuranceStatus["APPROVED"],
            updatedAt: {
              lte: new Date(endDate),
              gte: new Date(startDate),
            },
            vehicles: {
              VehicleStatus: VehicleStatus["NEW"],
            },
            branchs: {
              organizations: {
                orgName: args.filter,
              },
            },
          };
        }

        const count = await ctx.prisma.certificate.count({
          where,
        });

        return {
          count,
        };
      },
    });
  },
});

export const certificateByCertificateNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("certificateByCertificateNumber", {
      type: Certificate,
      args: { certificateNumber: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.certificate.findFirst({
          where: {
            certificateNumber: args.certificateNumber,
          },
        });
      },
    });
  },
});

export const createCertificateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createCertificate", {
      type: Certificate,
      args: {
        plateNumber: nonNull(stringArg()),
        input: nonNull(CertificateCreateInput),
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
        const vehicleDetail = await ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber: args.plateNumber,
          },
          include: {
            insureds: true,
            branchs: {
              select: {
                id: true,
                branchName: true,
              },
            },
          },
        });
        if (!vehicleDetail) {
          throw new Error(
            `We could not find vehicle with the provided plate number!! Please try again`
          );
        }
        const lastyear = subYears(new Date(), 1);
        const startYear = startOfYear(lastyear),
          endYear = endOfYear(lastyear);

        const countSlightBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: args.plateNumber,
              bodilyInjury: "SlightBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countSaviorBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: args.plateNumber,
              bodilyInjury: "SaviorBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countDeath = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: args.plateNumber,
            bodilyInjury: "Death",
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            bodilyInjury: true,
          },
        });

        const sumPropertyInjury = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: args.plateNumber,
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            propertyInjury: true,
          },
          _sum: {
            propertyInjury: true,
          },
        });

        let premiumTariffBodily = 0,
          premiumTariffProperty = 0;

        if (countSlightBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (countSaviorBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (countDeath._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countDeath._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countDeath._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countDeath._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countDeath._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (sumPropertyInjury._count.propertyInjury === 1) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 10) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 60) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 70) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 2) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 80) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 90) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 3) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 110) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 4) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 130) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 135) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury >= 5) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 130) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 140) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 150) / 100;
          }
        }

        const storeCertificateNumber = `CN-${format(new Date(), "yyMMiHms")}-${
            args.plateNumber
          }`,
          storePolicyNumber = `PN-${format(new Date(), "yyMMiHms")}-${
            args.plateNumber
          }`;

        return await ctx.prisma.$transaction(async (tx) => {
          const certData = await tx.certificate.create({
            data: {
              certificateNumber: storeCertificateNumber,
              premiumTarif:
                vehicleDetail.premiumTarif +
                premiumTariffBodily +
                premiumTariffProperty,
              vehicles: {
                connect: {
                  plateNumber: args.plateNumber,
                },
              },
              policies: {
                create: {
                  policyNumber: storePolicyNumber,
                  policyStartDate: args.input.policies.policyStartDate,
                  policyExpireDate: addYears(
                    new Date(args.input.policies.policyStartDate),
                    1
                  ),
                  policyIssuedConditions:
                    args.input.policies.policyIssuedConditions,
                  personsEntitledToUse:
                    args.input.policies.personsEntitledToUse,
                },
              },
              branchs: {
                connect: {
                  id: vehicleDetail.branchs.id,
                },
              },
              payments: {
                create: {
                  refNumber: `RN-${format(new Date(), "yyMMiHms")}`,
                  premiumTarif:
                    vehicleDetail.premiumTarif +
                    premiumTariffBodily +
                    premiumTariffProperty,
                  insureds: {
                    connect: {
                      regNumber: vehicleDetail.insureds.regNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: vehicleDetail.branchs.id,
                    },
                  },
                },
              },
              certificateRecords: {
                create: {
                  policies: {
                    connect: {
                      policyNumber: storePolicyNumber,
                    },
                  },
                  vehicles: {
                    connect: {
                      plateNumber: args.plateNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: vehicleDetail.branchs.id,
                    },
                  },
                },
              },
              // thirdPartyLogs: {
              //   create: {
              //     userEmail: user.email,
              //     action: "Create",
              //     mode: "Certificate",
              //     newValue: certNewValue,
              //     branchCon: {
              //       connect: {
              //         id: vehicleDetail.branchs.id,
              //       },
              //     },
              //   },
              // },
            },
          });
          const vehicleData = await tx.vehicle.update({
            where: {
              plateNumber: args.plateNumber,
            },
            data: {
              isInsured: "PENDING",
              // thirdPartyLogs: {
              //   create: {
              //     userEmail: user.email,
              //     action: "Update",
              //     mode: "Vehicle",
              //     oldValue: vehicleOldValue,
              //     newValue: vehicleNewValue,
              //     branchCon: {
              //       connect: {
              //         id: vehicleDetail.branchs.id,
              //       },
              //     },
              //   },
              // },
            },
          });

          return vehicleData;
        });
      },
    });
  },
});

export const createInsuranceByBranchMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createInsuranceByBranch", {
      type: Certificate,
      args: {
        input: nonNull(InsuranceCreateInput),
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

        const vehicleDetail = await ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber: args.input.vehicles.plateNumber,
          },
          include: {
            insureds: true,
            branchs: {
              select: {
                id: true,
                branchName: true,
              },
            },
          },
        });
        const tariffPremium = await ctx.prisma.tariff.findFirst({
          where: {
            vehicleType: args.input.vehicles.vehicleType,
            vehicleSubType: args.input.vehicles.vehicleSubType,
            vehicleDetail: args.input.vehicles.vehicleDetails,
            vehicleUsage: args.input.vehicles.vehicleUsage,
          },
        });
        if (!tariffPremium) {
          throw new Error(
            `We Could\'n find Premium Tariff with the provided data`
          );
        }

        const endYear = new Date(args.input.policies.policyStartDate);
        const startYear = subYears(
          new Date(args.input.policies.policyStartDate),
          1
        );

        const countSlightBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: args.input.vehicles.plateNumber,
              bodilyInjury: "SlightBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countSaviorBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: args.input.vehicles.plateNumber,
              bodilyInjury: "SaviorBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countDeath = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: args.input.vehicles.plateNumber,
            bodilyInjury: "Death",
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            bodilyInjury: true,
          },
        });

        const sumPropertyInjury = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: args.input.vehicles.plateNumber,
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            propertyInjury: true,
          },
          _sum: {
            propertyInjury: true,
          },
        });

        let premiumTariffBodily = 0,
          premiumTariffProperty = 0,
          vehiclePremiumTarif = 0;
        if (args.input.vehicles.vehicleCategory === "PRIVATEUSE") {
          vehiclePremiumTarif =
            20 * args.input.vehicles.passengerNumber +
            tariffPremium.premiumTarif;
        } else {
          vehiclePremiumTarif =
            40 * args.input.vehicles.passengerNumber +
            tariffPremium.premiumTarif;
        }

        if (countSlightBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehiclePremiumTarif * 10) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehiclePremiumTarif * 20) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehiclePremiumTarif * 50) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehiclePremiumTarif * 80) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehiclePremiumTarif * 100) / 100;
        }

        if (countSaviorBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehiclePremiumTarif * 10) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehiclePremiumTarif * 20) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehiclePremiumTarif * 50) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehiclePremiumTarif * 80) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehiclePremiumTarif * 100) / 100;
        }

        if (countDeath._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehiclePremiumTarif * 10) / 100;
        } else if (countDeath._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehiclePremiumTarif * 20) / 100;
        } else if (countDeath._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehiclePremiumTarif * 50) / 100;
        } else if (countDeath._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehiclePremiumTarif * 80) / 100;
        } else if (countDeath._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehiclePremiumTarif * 100) / 100;
        }

        if (sumPropertyInjury._count.propertyInjury === 1) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 10) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 60) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehiclePremiumTarif * 70) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 2) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 80) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehiclePremiumTarif * 90) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 3) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 110) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehiclePremiumTarif * 120) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 4) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 130) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehiclePremiumTarif * 135) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury >= 5) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 130) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehiclePremiumTarif * 140) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehiclePremiumTarif * 150) / 100;
          }
        }

        const storeCertificateNumber = `CN-${format(new Date(), "yyMMiHms")}`,
          storePolicyNumber = `PN-${format(new Date(), "yyMMiHms")}`,
          storeRegNumber = `REG-${format(new Date(), "yyMMiHms")}`;

        return await ctx.prisma.$transaction(async (tx) => {
          const certData = await tx.certificate.create({
            data: {
              certificateNumber: storeCertificateNumber,
              premiumTarif:
                vehiclePremiumTarif +
                premiumTariffBodily +
                premiumTariffProperty,
              branchs: {
                connect: {
                  id: args.input.branchs.id,
                },
              },
              policies: {
                create: {
                  policyNumber: storePolicyNumber,
                  policyStartDate: args.input.policies.policyStartDate,
                  policyExpireDate: addYears(
                    new Date(args.input.policies.policyStartDate),
                    1
                  ),
                  policyIssuedConditions:
                    args.input.policies.policyIssuedConditions,
                  personsEntitledToUse:
                    args.input.policies.personsEntitledToUse,
                },
              },
              vehicles: {
                create: {
                  plateNumber: args.input.vehicles.plateNumber,
                  engineNumber: args.input.vehicles.engineNumber,
                  chassisNumber: args.input.vehicles.chassisNumber,
                  vehicleModel: args.input.vehicles.vehicleModel,
                  bodyType: args.input.vehicles.bodyType,
                  horsePower: args.input.vehicles.horsePower,
                  manufacturedYear: args.input.vehicles.manufacturedYear,
                  vehicleType: args.input.vehicles.vehicleType,
                  vehicleSubType: args.input.vehicles.vehicleSubType,
                  vehicleDetails: args.input.vehicles.vehicleDetails,
                  vehicleUsage: args.input.vehicles.vehicleUsage,
                  vehicleCategory: args.input.vehicles.vehicleCategory,
                  premiumTarif: vehiclePremiumTarif,
                  passengerNumber: args.input.vehicles.passengerNumber,
                  carryingCapacityInGoods:
                    args.input.vehicles.carryingCapacityInGoods,
                  purchasedYear: args.input.vehicles.purchasedYear,
                  dutyFreeValue: args.input.vehicles.dutyFreeValue,
                  dutyPaidValue: args.input.vehicles.dutyPaidValue,
                  vehicleStatus: args.input.vehicles.vehicleStatus,
                  branchs: {
                    connect: {
                      id: args.input.branchs.id,
                    },
                  },
                  insureds: {
                    create: {
                      regNumber: storeRegNumber,
                      firstName: args.input.vehicles.insureds.firstName,
                      lastName: args.input.vehicles.insureds.lastName,
                      occupation: args.input.vehicles.insureds.occupation,
                      region: args.input.vehicles.insureds.region,
                      city: args.input.vehicles.insureds.city,
                      subCity: args.input.vehicles.insureds.subCity,
                      wereda: args.input.vehicles.insureds.wereda,
                      kebelle: args.input.vehicles.insureds.kebelle,
                      houseNumber: args.input.vehicles.insureds.houseNumber,
                      mobileNumber: changePhone(
                        args.input.vehicles.insureds.mobileNumber
                      ),
                      branchs: {
                        connect: {
                          id: args.input.branchs.id,
                        },
                      },
                    },
                  },
                },
              },
              payments: {
                create: {
                  refNumber: `RN-${format(new Date(), "yyMMiHms")}`,
                  premiumTarif:
                    vehiclePremiumTarif +
                    premiumTariffBodily +
                    premiumTariffProperty,
                  insureds: {
                    connect: {
                      regNumber: storeRegNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: args.input.branchs.id,
                    },
                  },
                },
              },
              certificateRecords: {
                create: {
                  policies: {
                    connect: {
                      policyNumber: storePolicyNumber,
                    },
                  },
                  vehicles: {
                    connect: {
                      plateNumber: args.input.vehicles.plateNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: args.input.branchs.id,
                    },
                  },
                },
              },
            },
          });
          const vehicleData = tx.vehicle.update({
            where: {
              plateNumber: args.input.vehicles.plateNumber,
            },
            data: {
              isInsured: "PENDING",
            },
          });

          return vehicleData;
        });
      },
    });
  },
});

export const createCertificateBranchMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createCertificateBranch", {
      type: Certificate,
      args: {
        plateNumber: nonNull(stringArg()),
        input: nonNull(CertificateCreateInput),
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
        const vehicleDetail = await ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber: args.plateNumber,
          },
          include: {
            insureds: true,
            branchs: {
              select: {
                id: true,
                branchName: true,
              },
            },
            certificates: {
              include: {
                policies: true,
              },
            },
          },
        });
        if (!vehicleDetail) {
          throw new Error(
            `We could not find vehicle with the provided plate number!! Please try again`
          );
        }
        // else if (vehicleDetail.branchId !== user.memberships.branchId) {
        //   throw new Error(
        //     `You Can\'t Create Certificate For The Provided Vehicle!! The Vehicle Belongs To Other Insurance`
        //   );
        // }

        // const lastyear = subYears(new Date(), 1);
        // const startYear = startOfYear(lastyear),
        //   endYear = args.input.policies.policyStartDate;

        const startYear = vehicleDetail.certificates.policies.policyExpireDate;
        const endYear = new Date(args.input.policies.policyStartDate);
        // const endYear = subDays(new Date(args.input.policies.policyStartDate), 1)

        const countSlightBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: args.plateNumber,
              bodilyInjury: "SlightBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countSaviorBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: args.plateNumber,
              bodilyInjury: "SaviorBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countDeath = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: args.plateNumber,
            bodilyInjury: "Death",
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            bodilyInjury: true,
          },
        });

        const sumPropertyInjury = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: args.plateNumber,
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            propertyInjury: true,
          },
          _sum: {
            propertyInjury: true,
          },
        });

        let premiumTariffBodily = 0,
          premiumTariffProperty = 0;

        if (countSlightBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (countSaviorBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (countDeath._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countDeath._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countDeath._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countDeath._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countDeath._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (sumPropertyInjury._count.propertyInjury === 1) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 10) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 60) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 70) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 2) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 80) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 90) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 3) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 110) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 4) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 130) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 135) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury >= 5) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 130) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 140) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 150) / 100;
          }
        }

        // let certData = null;
        // let vehicleData = null;
        const storeCertificateNumber = `CN-${format(new Date(), "yyMMiHms")}-${
            args.plateNumber
          }`,
          storePolicyNumber = `PN-${format(new Date(), "yyMMiHms")}-${
            args.plateNumber
          }`;

        return await ctx.prisma.$transaction(async (tx) => {
          const certData = tx.certificate.create({
            data: {
              certificateNumber: storeCertificateNumber,
              premiumTarif:
                vehicleDetail.premiumTarif +
                premiumTariffBodily +
                premiumTariffProperty,
              vehicles: {
                connect: {
                  plateNumber: args.plateNumber,
                },
              },
              policies: {
                create: {
                  policyNumber: storePolicyNumber,
                  policyStartDate: args.input.policies.policyStartDate,
                  policyExpireDate: addYears(
                    new Date(args.input.policies.policyStartDate),
                    1
                  ),
                  policyIssuedConditions:
                    args.input.policies.policyIssuedConditions,
                  personsEntitledToUse:
                    args.input.policies.personsEntitledToUse,
                },
              },
              branchs: {
                connect: {
                  id: vehicleDetail.branchs.id,
                },
              },
              payments: {
                create: {
                  refNumber: `RN-${format(new Date(), "yyMMiHms")}`,
                  premiumTarif:
                    vehicleDetail.premiumTarif +
                    premiumTariffBodily +
                    premiumTariffProperty,
                  insureds: {
                    connect: {
                      regNumber: vehicleDetail.insureds.regNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: vehicleDetail.branchs.id,
                    },
                  },
                },
              },
              certificateRecords: {
                create: {
                  policies: {
                    connect: {
                      policyNumber: storePolicyNumber,
                    },
                  },
                  vehicles: {
                    connect: {
                      plateNumber: args.plateNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: vehicleDetail.branchs.id,
                    },
                  },
                },
              },
            },
          });
          const vehicleData = tx.vehicle.update({
            where: {
              plateNumber: args.plateNumber,
            },
            data: {
              isInsured: "PENDING",
            },
          });

          return vehicleData;
        });
      },
    });
  },
});

export const createOrUpdateCertificateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createOrUpdateCertificate", {
      type: Certificate,
      args: {
        plateNumber: nonNull(stringArg()),
        input: nonNull(CertificateCreateInput),
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

        const vehicleDetail = await ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber: args.plateNumber,
          },
          include: {
            branchs: true,
            insureds: true,
          },
        });

        const oldCertData = await ctx.prisma.certificate.findFirst({
          where: {
            vehiclePlateNumber: args.plateNumber,
          },
          include: {
            policies: true,
            vehicles: true,
            payments: true,
          },
        });

        if (!vehicleDetail) {
          throw new Error(
            `We could not find vehicle with the provided plate number!! Please try again`
          );
        }

        const startYear = subYears(
          new Date(args.input.policies.policyStartDate),
          1
        );
        const endYear = new Date(args.input.policies.policyStartDate);

        const countSlightBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: args.plateNumber,
              bodilyInjury: "SlightBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countSaviorBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: args.plateNumber,
              bodilyInjury: "SaviorBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countDeath = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: args.plateNumber,
            bodilyInjury: "Death",
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            bodilyInjury: true,
          },
        });

        const sumPropertyInjury = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: args.plateNumber,
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            propertyInjury: true,
          },
          _sum: {
            propertyInjury: true,
          },
        });

        let premiumTariffBodily = 0,
          premiumTariffProperty = 0;

        if (countSlightBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (countSaviorBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (countDeath._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countDeath._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countDeath._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countDeath._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countDeath._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (sumPropertyInjury._count.propertyInjury === 1) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 10) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 60) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 70) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 2) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 80) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 90) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 3) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 110) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 4) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 130) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 135) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury >= 5) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 130) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 140) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 150) / 100;
          }
        }

        const storeCertificateNumber = `CN-${format(new Date(), "yyMMiHms")}-${
            args.plateNumber
          }`,
          storePolicyNumber = `PN-${format(new Date(), "yyMMiHms")}-${
            args.plateNumber
          }`;

        const oldPolicyNumber =
          oldCertData !== null
            ? oldCertData.policies.policyNumber
            : storePolicyNumber;

        const certNewValue = {
          certificateNumber: storeCertificateNumber,
          premiumTarif:
            vehicleDetail.premiumTarif +
            premiumTariffBodily +
            premiumTariffProperty,
          vehicle: {
            plateNumber: args.plateNumber,
            isInsured: "PENDING",
          },
          policies: {
            policyNumber: storePolicyNumber,
            policyStartDate: new Date(
              args.input.policies.policyStartDate
            ).toDateString(),
            policyExpireDate: addYears(
              new Date(args.input.policies.policyStartDate),
              1
            ).toDateString(),
            policyIssuedConditions: args.input.policies.policyIssuedConditions,
            personsEntitledToUse: args.input.policies.personsEntitledToUse,
          },
        };

        const certOldValue = {
          certificateNumber: oldCertData.certificateNumber ?? null,
          premiumTarif: oldCertData.premiumTarif ?? null,
          vehicle: {
            plateNumber: oldCertData.vehicles.plateNumber ?? null,
            isInsured: oldCertData.vehicles.isInsured ?? null,
          },
          policies: {
            policyNumber: oldCertData.policies.policyNumber ?? null,
            policyStartDate:
              new Date(oldCertData.policies.policyStartDate).toDateString() ??
              null,
            policyExpireDate:
              new Date(oldCertData.policies.policyExpireDate).toDateString() ??
              null,
            policyIssuedConditions:
              oldCertData.policies.policyIssuedConditions ?? null,
            personsEntitledToUse:
              oldCertData.policies.personsEntitledToUse ?? null,
          },
        };

        const vehicleNewValue = {
          isInsured: "PENDING",
        };
        const vehicleOldValue = {
          IsInsured: vehicleDetail.isInsured,
        };

        return await ctx.prisma.$transaction(async (tx) => {
          const certData = await tx.certificate.upsert({
            where: {
              vehiclePlateNumber: args.plateNumber,
            },
            update: {
              premiumTarif:
                vehicleDetail.premiumTarif +
                premiumTariffBodily +
                premiumTariffProperty,
              policies: {
                create: {
                  policyNumber: storePolicyNumber,
                  policyStartDate: args.input.policies.policyStartDate,
                  policyExpireDate: addYears(
                    new Date(args.input.policies.policyStartDate),
                    1
                  ),
                  policyIssuedConditions:
                    args.input.policies.policyIssuedConditions,
                  personsEntitledToUse:
                    args.input.policies.personsEntitledToUse,
                },
              },
              branchs: {
                connect: {
                  id: vehicleDetail.branchs.id,
                },
              },
              payments: {
                // set: [],
                create: {
                  refNumber: `RN-${format(new Date(), "yyMMiHms")}`,
                  premiumTarif:
                    vehicleDetail.premiumTarif +
                    premiumTariffBodily +
                    premiumTariffProperty,
                  insureds: {
                    connect: {
                      regNumber: vehicleDetail.insureds.regNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: vehicleDetail.branchs.id,
                    },
                  },
                },
              },
              certificateRecords: {
                create: {
                  policies: {
                    connect: {
                      policyNumber: oldPolicyNumber,
                    },
                  },
                  vehicles: {
                    connect: {
                      plateNumber: vehicleDetail.plateNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: vehicleDetail.branchId,
                    },
                  },
                },
              },
              vehicles: {
                update: {
                  vehicleStatus: "RENEWAL",
                },
              },
              thirdPartyLogs: {
                create: {
                  userEmail: user.email,
                  action: "Update",
                  mode: "Certificate",
                  oldValue: certOldValue,
                  newValue: certNewValue,
                  branchCon: {
                    connect: {
                      id: vehicleDetail?.branchId,
                    },
                  },
                },
              },
            },
            create: {
              certificateNumber: storeCertificateNumber,
              premiumTarif:
                vehicleDetail.premiumTarif +
                premiumTariffBodily +
                premiumTariffProperty,
              vehicles: {
                connect: {
                  plateNumber: args.plateNumber,
                },
              },
              policies: {
                create: {
                  policyNumber: storePolicyNumber,
                  policyStartDate: args.input.policies.policyStartDate,
                  policyExpireDate: addYears(
                    new Date(args.input.policies.policyStartDate),
                    1
                  ),
                  policyIssuedConditions:
                    args.input.policies.policyIssuedConditions,
                  personsEntitledToUse:
                    args.input.policies.personsEntitledToUse,
                },
              },
              branchs: {
                connect: {
                  id: vehicleDetail.branchs.id,
                },
              },
              payments: {
                create: {
                  refNumber: `RN-${format(new Date(), "yyMMiHms")}`,
                  premiumTarif:
                    vehicleDetail.premiumTarif +
                    premiumTariffBodily +
                    premiumTariffProperty,
                  insureds: {
                    connect: {
                      regNumber: vehicleDetail.insureds.regNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: vehicleDetail.branchs.id,
                    },
                  },
                },
              },
              certificateRecords: {
                create: {
                  policies: {
                    connect: {
                      policyNumber: storePolicyNumber,
                    },
                  },
                  vehicles: {
                    connect: {
                      plateNumber: args.plateNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: vehicleDetail.branchs.id,
                    },
                  },
                },
              },
              thirdPartyLogs: {
                create: {
                  userEmail: user.email,
                  action: "Create",
                  mode: "Certificate",
                  newValue: certNewValue,
                  branchCon: {
                    connect: {
                      id: vehicleDetail?.branchId,
                    },
                  },
                },
              },
            },
          });
          const vehicleData = await tx.vehicle.update({
            where: {
              plateNumber: args.plateNumber,
            },
            data: {
              isInsured: "PENDING",
              thirdPartyLogs: {
                create: {
                  userEmail: user.email,
                  action: "Update",
                  mode: "Vehicle",
                  oldValue: vehicleOldValue,
                  newValue: vehicleNewValue,
                  branchCon: {
                    connect: {
                      id: vehicleDetail?.branchId,
                    },
                  },
                },
              },
            },
          });
          return vehicleData;
        });
      },
    });
  },
});

export const transferCertificateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("transferCertificate", {
      type: Certificate,
      args: {
        plateNumber: nonNull(stringArg()),
        input: nonNull(CertificateCreateInput),
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

        const vehicleDetail = await ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber: args.plateNumber,
          },
          include: {
            branchs: true,
            insureds: true,
          },
        });

        const oldCertData = await ctx.prisma.certificate.findFirst({
          where: {
            vehiclePlateNumber: args.plateNumber,
          },
          include: {
            policies: true,
            vehicles: true,
          },
        });

        if (!vehicleDetail) {
          throw new Error(
            `We could not find vehicle with the provided plate number!! Please try again`
          );
        }

        const startYear = subYears(
          new Date(args.input.policies.policyStartDate),
          1
        );
        const endYear = new Date(args.input.policies.policyStartDate);

        const countSlightBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: args.plateNumber,
              bodilyInjury: "SlightBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countSaviorBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: args.plateNumber,
              bodilyInjury: "SaviorBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countDeath = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: args.plateNumber,
            bodilyInjury: "Death",
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            bodilyInjury: true,
          },
        });

        const sumPropertyInjury = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: args.plateNumber,
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            propertyInjury: true,
          },
          _sum: {
            propertyInjury: true,
          },
        });

        let premiumTariffBodily = 0,
          premiumTariffProperty = 0;

        if (countSlightBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (countSaviorBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (countDeath._count.bodilyInjury === 1) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 10) / 100;
        } else if (countDeath._count.bodilyInjury === 2) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 20) / 100;
        } else if (countDeath._count.bodilyInjury === 3) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 50) / 100;
        } else if (countDeath._count.bodilyInjury === 4) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 80) / 100;
        } else if (countDeath._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vehicleDetail.premiumTarif * 100) / 100;
        }

        if (sumPropertyInjury._count.propertyInjury === 1) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 10) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 60) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 70) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 2) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 80) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 90) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 3) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 110) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 4) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 130) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 135) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury >= 5) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 130) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 140) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vehicleDetail.premiumTarif * 150) / 100;
          }
        }

        const storeCertificateNumber = `CN-${format(new Date(), "yyMMiHms")}-${
            args.plateNumber
          }`,
          storePolicyNumber = `PN-${format(new Date(), "yyMMiHms")}-${
            args.plateNumber
          }`;

        const oldPolicyNumber =
          oldCertData !== null
            ? oldCertData.policies.policyNumber
            : storePolicyNumber;

        const certNewValue = {
          certificateNumber: storeCertificateNumber,
          premiumTarif:
            vehicleDetail.premiumTarif +
            premiumTariffBodily +
            premiumTariffProperty,
          vehicle: {
            plateNumber: args.plateNumber,
            isInsured: "PENDING",
          },
          policies: {
            policyNumber: storePolicyNumber,
            policyStartDate: new Date(
              args.input.policies.policyStartDate
            ).toDateString(),
            policyExpireDate: addYears(
              new Date(args.input.policies.policyStartDate),
              1
            ).toDateString(),
            policyIssuedConditions: args.input.policies.policyIssuedConditions,
            personsEntitledToUse: args.input.policies.personsEntitledToUse,
          },
        };
        const certOldValue = {
          certificateNumber: oldCertData.certificateNumber ?? null,
          premiumTarif: oldCertData.premiumTarif ?? null,
          vehicle: {
            plateNumber: oldCertData.vehicles.plateNumber ?? null,
            isInsured: oldCertData.vehicles.isInsured ?? null,
          },
          policies: {
            policyNumber: oldCertData.policies.policyNumber ?? null,
            policyStartDate:
              new Date(oldCertData.policies.policyStartDate).toDateString() ??
              null,
            policyExpireDate:
              new Date(oldCertData.policies.policyExpireDate).toDateString() ??
              null,
            policyIssuedConditions:
              oldCertData.policies.policyIssuedConditions ?? null,
            personsEntitledToUse:
              oldCertData.policies.personsEntitledToUse ?? null,
          },
        };
        const vehicleNewValue = {
          isInsured: "PENDING",
        };
        const vehicleOldValue = {
          IsInsured: vehicleDetail.isInsured,
        };
        return await ctx.prisma.$transaction(async (tx) => {
          const certData = await tx.certificate.upsert({
            where: {
              vehiclePlateNumber: args.plateNumber,
            },
            update: {
              premiumTarif:
                vehicleDetail.premiumTarif +
                premiumTariffBodily +
                premiumTariffProperty,
              policies: {
                create: {
                  policyNumber: storePolicyNumber,
                  policyStartDate: args.input.policies.policyStartDate,
                  policyExpireDate: addYears(
                    new Date(args.input.policies.policyStartDate),
                    1
                  ),
                  policyIssuedConditions:
                    args.input.policies.policyIssuedConditions,
                  personsEntitledToUse:
                    args.input.policies.personsEntitledToUse,
                },
              },
              branchs: {
                connect: {
                  id: args.input.branchs.id,
                },
              },
              payments: {
                create: {
                  refNumber: `RN-${format(new Date(), "yyMMiHms")}`,
                  premiumTarif:
                    vehicleDetail.premiumTarif +
                    premiumTariffBodily +
                    premiumTariffProperty,
                  insureds: {
                    connect: {
                      regNumber: vehicleDetail.insureds.regNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: args.input.branchs.id,
                    },
                  },
                },
              },
              thirdPartyLogs: {
                create: {
                  userEmail: user.email,
                  action: "Update",
                  mode: "Certificate",
                  oldValue: certOldValue,
                  newValue: certNewValue,
                  branchCon: {
                    connect: {
                      id: vehicleDetail?.branchId,
                    },
                  },
                },
              },
              certificateRecords: {
                create: {
                  policies: {
                    connect: {
                      policyNumber: oldPolicyNumber,
                    },
                  },
                  vehicles: {
                    connect: {
                      plateNumber: vehicleDetail.plateNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: args.input.branchs.id,
                    },
                  },
                },
              },
            },
            create: {
              certificateNumber: storeCertificateNumber,
              premiumTarif:
                vehicleDetail.premiumTarif +
                premiumTariffBodily +
                premiumTariffProperty,
              vehicles: {
                connect: {
                  plateNumber: args.plateNumber,
                },
              },
              branchs: {
                connect: {
                  id: args.input.branchs.id,
                },
              },
              policies: {
                create: {
                  policyNumber: storePolicyNumber,
                  policyStartDate: args.input.policies.policyStartDate,
                  policyExpireDate: addYears(
                    new Date(args.input.policies.policyStartDate),
                    1
                  ),
                  policyIssuedConditions:
                    args.input.policies.policyIssuedConditions,
                  personsEntitledToUse:
                    args.input.policies.personsEntitledToUse,
                },
              },
              payments: {
                create: {
                  refNumber: `RN-${format(new Date(), "yyMMiHms")}`,
                  premiumTarif:
                    vehicleDetail.premiumTarif +
                    premiumTariffBodily +
                    premiumTariffProperty,
                  insureds: {
                    connect: {
                      regNumber: vehicleDetail.insureds.regNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: args.input.branchs.id,
                    },
                  },
                },
              },
              thirdPartyLogs: {
                create: {
                  userEmail: user.email,
                  action: "Create",
                  mode: "Certificate",
                  newValue: certNewValue,
                  branchCon: {
                    connect: {
                      id: vehicleDetail?.branchId,
                    },
                  },
                },
              },
              certificateRecords: {
                create: {
                  policies: {
                    connect: {
                      policyNumber: storePolicyNumber,
                    },
                  },
                  vehicles: {
                    connect: {
                      plateNumber: args.plateNumber,
                    },
                  },
                  branchs: {
                    connect: {
                      id: args.input.branchs.id,
                    },
                  },
                },
              },
            },
          });
          const vehicleData = await tx.vehicle.update({
            where: {
              plateNumber: args.plateNumber,
            },
            data: {
              isInsured: "PENDING",
              branchs: {
                connect: {
                  id: args.input.branchs.id,
                },
              },
              thirdPartyLogs: {
                create: {
                  userEmail: user.email,
                  action: "Update",
                  mode: "Vehicle",
                  oldValue: vehicleOldValue,
                  newValue: vehicleNewValue,
                  branchCon: {
                    connect: {
                      id: vehicleDetail?.branchId,
                    },
                  },
                },
              },
            },
          });
          return vehicleData;
        });
      },
    });
  },
});

export const updateCertificateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateCertificate", {
      type: Certificate,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(CertificateUpdateInput),
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
        const vPlate = await ctx.prisma.certificate.findFirst({
          where: {
            id: args.id,
          },
          include: {
            vehicles: true,
            policies: true,
          },
        });

        const startYear = vPlate.policies.policyExpireDate;
        const endYear = new Date(args.input.policies.policyStartDate);
        // const endYear = subDays(new Date(args.input.policies.policyStartDate), 1)

        const countSlightBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: vPlate.vehiclePlateNumber,
              bodilyInjury: "SlightBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countSaviorBodilyInjury =
          await ctx.prisma.accidentRecord.aggregate({
            where: {
              plateNumber: vPlate.vehiclePlateNumber,
              bodilyInjury: "SaviorBodilyInjury",
              createdAt: {
                gte: startYear,
                lte: endYear,
              },
            },
            _count: {
              bodilyInjury: true,
            },
          });

        const countDeath = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: vPlate.vehiclePlateNumber,
            bodilyInjury: "Death",
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            bodilyInjury: true,
          },
        });

        const sumPropertyInjury = await ctx.prisma.accidentRecord.aggregate({
          where: {
            plateNumber: vPlate.vehiclePlateNumber,
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            propertyInjury: true,
          },
          _sum: {
            propertyInjury: true,
          },
        });

        let premiumTariffBodily = 0,
          premiumTariffProperty = 0;

        if (countSlightBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vPlate.premiumTarif * 10) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vPlate.premiumTarif * 20) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vPlate.premiumTarif * 50) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vPlate.premiumTarif * 80) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vPlate.premiumTarif * 100) / 100;
        }

        if (countSaviorBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (vPlate.premiumTarif * 10) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (vPlate.premiumTarif * 20) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (vPlate.premiumTarif * 50) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (vPlate.premiumTarif * 80) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vPlate.premiumTarif * 100) / 100;
        }

        if (countDeath._count.bodilyInjury === 1) {
          premiumTariffBodily += (vPlate.premiumTarif * 10) / 100;
        } else if (countDeath._count.bodilyInjury === 2) {
          premiumTariffBodily += (vPlate.premiumTarif * 20) / 100;
        } else if (countDeath._count.bodilyInjury === 3) {
          premiumTariffBodily += (vPlate.premiumTarif * 50) / 100;
        } else if (countDeath._count.bodilyInjury === 4) {
          premiumTariffBodily += (vPlate.premiumTarif * 80) / 100;
        } else if (countDeath._count.bodilyInjury >= 5) {
          premiumTariffBodily += (vPlate.premiumTarif * 100) / 100;
        }

        if (sumPropertyInjury._count.propertyInjury === 1) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 10) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 60) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vPlate.premiumTarif * 70) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 2) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 80) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vPlate.premiumTarif * 90) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 3) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 110) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vPlate.premiumTarif * 120) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 4) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 130) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vPlate.premiumTarif * 135) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury >= 5) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 130) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (vPlate.premiumTarif * 140) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (vPlate.premiumTarif * 150) / 100;
          }
        }

        return await ctx.prisma.certificate.update({
          where: { id: args.id },
          data: {
            premiumTarif:
              vPlate.premiumTarif + premiumTariffBodily + premiumTariffProperty,
            policies: {
              update: {
                policyStartDate: new Date(args.input.policies.policyStartDate),
                policyExpireDate: addYears(
                  new Date(args.input.policies.policyStartDate),
                  1
                ),
                policyIssuedConditions:
                  args.input.policies.policyIssuedConditions,
                personsEntitledToUse: args.input.policies.personsEntitledToUse,
              },
            },
            payments: {
              create: {
                refNumber: `RN-${format(new Date(), "yyMMiHms")}`,
                paymentStatus: "PendingPayment",
                premiumTarif:
                  vPlate.premiumTarif +
                  premiumTariffBodily +
                  premiumTariffProperty,
                insureds: {
                  connect: {
                    id: vPlate.vehicles.insuredId,
                  },
                },
                branchs: {
                  connect: {
                    id: vPlate.branchId,
                  },
                },
              },
            },
            certificateRecords: {
              create: {
                policies: {
                  connect: {
                    policyNumber: vPlate.policies.policyNumber,
                  },
                },
                vehicles: {
                  connect: {
                    plateNumber: vPlate.vehicles.plateNumber,
                  },
                },
                branchs: {
                  connect: {
                    id: vPlate.branchId,
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

export const deleteCertificateMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteCertificate", {
      type: Certificate,
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
            user.memberships.role !== "BRANCHADMIN" &&
            user.memberships.role !== "INSURER")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        const oldCertData = await ctx.prisma.certificate.findFirst({
          where: {
            id: args.id,
          },
          include: {
            vehicles: true,
            policies: true,
            branchs: true,
          },
        });

        const certOldValue = {
          certificateNumber: oldCertData.certificateNumber ?? null,
          premiumTarif: oldCertData.premiumTarif ?? null,
          vehicle: {
            plateNumber: oldCertData.vehicles.plateNumber ?? null,
            isInsured: oldCertData.vehicles.isInsured ?? null,
          },
          policies: {
            policyNumber: oldCertData.policies.policyNumber ?? null,
            policyStartDate:
              new Date(oldCertData.policies.policyStartDate).toDateString() ??
              null,
            policyExpireDate:
              new Date(oldCertData.policies.policyExpireDate).toDateString() ??
              null,
            policyIssuedConditions:
              oldCertData.policies.policyIssuedConditions ?? null,
            personsEntitledToUse:
              oldCertData.policies.personsEntitledToUse ?? null,
          },
        };
        const vehicleNewValue = {
          isInsured: "PENDING",
        };
        const vehicleOldValue = {
          IsInsured: oldCertData.vehicles.isInsured,
        };

        return await ctx.prisma.$transaction(async (tx) => {
          const certDate = await tx.certificate.delete({
            where: {
              id: args.id,
            },
          });
          const vehicleData = await tx.vehicle.update({
            where: {
              id: oldCertData.vehicles.id,
            },
            data: {
              isInsured: "NOTINSURED",
              thirdPartyLogs: {
                create: {
                  userEmail: user.email,
                  action: "Update",
                  mode: "Vehicle",
                  oldValue: vehicleOldValue,
                  newValue: vehicleNewValue,
                  branchCon: {
                    connect: {
                      id: oldCertData?.branchId,
                    },
                  },
                },
              },
            },
          });
          const logger = await tx.thirdPartyLog.create({
            data: {
              userEmail: user.email,
              action: "Delete",
              mode: "Certificate",
              oldValue: certOldValue,
              branchCon: {
                connect: {
                  id: oldCertData?.branchId,
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

export const FeedCertificate = objectType({
  name: "FeedCertificate",
  definition(t) {
    t.nonNull.list.nonNull.field("certificate", { type: Certificate }); // 1
    t.nonNull.int("totalCertificate"); // 2
    t.int("maxPage");
  },
});

export const DailyReport = objectType({
  name: "DailyReport",
  definition(t) {
    t.nonNull.int("count");
  },
});
export const CertificateCountReport = objectType({
  name: "CertificateCountReport",
  definition(t) {
    t.nonNull.int("count");
  },
});

export const WeeklyReport = objectType({
  name: "WeeklyReport",
  definition(t) {
    t.int("count");
  },
});

export const FeedCertificateBranch = objectType({
  name: "FeedCertificateBranch",
  definition(t) {
    t.nonNull.list.nonNull.field("certificate", { type: Certificate }); // 1
    t.nonNull.int("totalCertificate"); // 2
    t.int("maxPage");
  },
});

export const FeedCertificateInsurer = objectType({
  name: "FeedCertificateInsurer",
  definition(t) {
    t.nonNull.list.nonNull.field("certificate", { type: Certificate }); // 1
    t.nonNull.int("totalCertificate"); // 2
    t.int("maxPage");
  },
});

export const CertificateOrderByInput = inputObjectType({
  name: "CertificateOrderByInput",
  definition(t) {
    t.field("issuedDate", { type: Sort });
    t.field("updatedAt", { type: Sort });
    t.field("policyStartDate", { type: Sort });
    t.field("policyExpireDate", { type: Sort });
  },
});

export const CertificateCreateInput = inputObjectType({
  name: "CertificateCreateInput",
  definition(t) {
    t.field("policies", { type: policyCreateInput });
    t.field("branchs", { type: branchConnectInput });
  },
});

export const InsuranceCreateInput = inputObjectType({
  name: "InsuranceCreateInput",
  definition(t) {
    t.field("policies", { type: policyCreateInput });
    t.field("vehicles", { type: vehicleInsuranceCreateInput });
    t.field("branchs", { type: branchConnectInput });
  },
});

export const certificateImportCreateInput = inputObjectType({
  name: "certificateImportCreateInput",
  definition(t) {
    t.field("policies", { type: policyCreateInput });
  },
});

export const CertificateUpdateInput = inputObjectType({
  name: "CertificateUpdateInput",
  definition(t) {
    t.field("policies", { type: policyUpdateInput });
    // t.field("tariffs", { type: tariffConnectInput });
    // t.field("thirdPartyLog", { type: thirdPartyLogEditInput });
  },
});

export const certificateConnectInput = inputObjectType({
  name: "certificateConnectInput",
  definition(t) {
    t.string("certificateNumber");
  },
});

export const InsuranceStatus = enumType({
  name: "InsuranceStatus",
  members: ["APPROVED", "PendingPayment", "PendingApproval"],
});

export const InsuranceStatusInput = inputObjectType({
  name: "InsuranceStatusInput",
  definition(t) {
    t.field("status", { type: InsuranceStatus });
  },
});
