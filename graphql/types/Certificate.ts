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
import { addYears, endOfYear, startOfYear, subDays, subYears } from "date-fns";
import { Prisma } from "@prisma/client";
import { policyCreateInput, policyUpdateInput } from "./Policy";
import { format } from "date-fns";
import { Sort } from "./User";
import { branchConnectInput } from "./Branch";

export const Certificate = objectType({
  name: "Certificate",
  definition(t) {
    t.string("id");
    t.string("certificateNumber");
    t.float("premiumTarif");
    t.date("issuedDate");
    t.date("updatedAt");
    t.field("insureds", {
      type: "Insured",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.certificate
          .findUnique({
            where: { id: _parent.id },
          })
          .insureds();
      },
    });
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
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(CertificateOrderByInput)) }),
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              // deleted: false,
              branchId: args.branchId,
              OR: [
                { certificateNumber: args.filter },
                { vehiclePlateNumber: args.filter },
              ],
            }
          : {
              // deleted: false,
              branchId: args.branchId,
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
              // deleted: false,
              branchs: {
                orgId: args.orgId,
              },
              OR: [
                { certificateNumber: args.filter },
                { vehiclePlateNumber: args.filter },
              ],
            }
          : {
              // deleted: false,
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
            // deleted: false,
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
            user.memberships.role !== "MEMBER")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        const vehicleDetail = await ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber: args.plateNumber,
          },
          include: {
            insureds: {
              select: {
                id: true,
                // mobileNumber: true,
              },
            },
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

        return await ctx.prisma.$transaction(async (tx: any) => {
          let certData = null,
            vehiUpdate = null;
          certData = await tx.certificate.create({
            data: {
              ...args.input,
              certificateNumber: `CN-${format(new Date(), "yyMMiHms")}`,
              premiumTarif:
                vehicleDetail.premiumTarif +
                premiumTariffBodily +
                premiumTariffProperty,
              insureds: {
                connect: {
                  id: vehicleDetail.insureds.id,
                },
              },
              vehicles: {
                connect: {
                  plateNumber: args.plateNumber,
                },
              },
              policies: {
                create: {
                  policyNumber: args.input.policies.policyNumber,
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
              certificateRecords: {
                create: {
                  policies: {
                    connect: {
                      policyNumber: args.input.policies.policyNumber,
                    },
                  },
                  insureds: {
                    connect: {
                      id: vehicleDetail.insureds.id,
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

          vehiUpdate = tx.vehicle.update({
            where: {
              plateNumber: args.plateNumber,
            },
            data: {
              isInsured: "INSURED",
            },
          });

          return vehiUpdate;
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
            insureds: {
              select: {
                id: true,
              },
            },
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
        } else if (vehicleDetail.branchId !== user.memberships.branchId) {
          throw new Error(
            `You Can\'t Create Certificate For The Provided Vehicle!! The Vehicle Belongs To Other Insurance`
          );
        }

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

        let certData = null;
        let vehicleData = null;

        [certData, vehicleData] = await ctx.prisma.$transaction([
          ctx.prisma.certificate.create({
            data: {
              certificateNumber: `CN-${format(new Date(), "yyMMiHms")}`,
              premiumTarif:
                vehicleDetail.premiumTarif +
                premiumTariffBodily +
                premiumTariffProperty,
              insureds: {
                connect: {
                  id: vehicleDetail.insureds.id,
                },
              },
              vehicles: {
                connect: {
                  plateNumber: args.plateNumber,
                },
              },
              policies: {
                create: {
                  policyNumber: args.input.policies.policyNumber,
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
              certificateRecords: {
                create: {
                  policies: {
                    connect: {
                      policyNumber: args.input.policies.policyNumber,
                    },
                  },
                  insureds: {
                    connect: {
                      id: vehicleDetail.insureds.id,
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
          }),
          ctx.prisma.vehicle.update({
            where: {
              plateNumber: args.plateNumber,
            },
            data: {
              isInsured: "INSURED",
            },
          }),
        ]);

        return certData;
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
            user.memberships.role !== "MEMBER")
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

        let certDate = null;
        let vehicleData = null;
        [certDate, vehicleData] = await ctx.prisma.$transaction([
          ctx.prisma.certificate.update({
            where: { id: args.id },
            data: {
              ...args.input,
              policies: {
                update: {
                  policyStartDate: new Date(
                    args.input.policies.policyStartDate
                  ),
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

              certificateRecords: {
                create: {
                  policies: {
                    connect: {
                      policyNumber: vPlate.policies.policyNumber,
                    },
                  },
                  insureds: {
                    connect: {
                      id: vPlate.insuredId,
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
          }),
          ctx.prisma.vehicle.update({
            where: {
              id: vPlate.vehicles.id,
            },
            data: {
              isInsured: "INSURED",
            },
          }),
        ]);

        return certDate;
      },
    });
  },
});

// export const deleteCertificateMutation = extendType({
//   type: "Mutation",
//   definition(t) {
//     t.nonNull.field("deleteCertificate", {
//       type: Certificate,
//       args: {
//         id: nonNull(stringArg()),
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
//         if (!user || user.memberships.role !== "SUPERADMIN") {
//           throw new Error(`You do not have permission to perform action`);
//         }
//         const vPlate = await ctx.prisma.certificate.findFirst({
//           where: {
//             id: args.id,
//           },
//           include: {
//             vehicles: true,
//           },
//         });

//         let certDate = null;
//         let vehicleData = null;
//         [certDate, vehicleData] = await ctx.prisma.$transaction([
//           ctx.prisma.certificate.update({
//             where: {
//               id: args.id,
//             },
//             data: {
//               vehicles: {
//                 disconnect: true,
//               },
//               deleted: true,
//               deletedTime: new Date(),
//             },
//           }),
//           ctx.prisma.vehicle.update({
//             where: {
//               id: vPlate.vehicles.id,
//             },
//             data: {
//               isInsured: "NOTINSURED",
//             },
//           }),
//         ]);
//         return certDate;
//       },
//     });
//   },
// });

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
        if (!user || user.memberships.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }
        // return await ctx.prisma.certificate.delete({
        //   where: {
        //     id: args.id,
        //   },
        // });
        const vPlate = await ctx.prisma.certificate.findFirst({
          where: {
            id: args.id,
          },
          include: {
            vehicles: true,
          },
        });
        let certDate = null;
        let vehicleData = null;
        [certDate, vehicleData] = await ctx.prisma.$transaction([
          ctx.prisma.certificate.delete({
            where: {
              id: args.id,
            },
          }),
          ctx.prisma.vehicle.update({
            where: {
              id: vPlate.vehicles.id,
            },
            data: {
              isInsured: "NOTINSURED",
            },
          }),
        ]);

        return certDate;
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
    t.field("policyStartDate", { type: Sort });
    t.field("policyExpireDate", { type: Sort });
  },
});

export const CertificateCreateInput = inputObjectType({
  name: "CertificateCreateInput",
  definition(t) {
    // t.float("premiumTarif");
    t.field("policies", { type: policyCreateInput });
    t.field("branchs", { type: branchConnectInput });
    // t.field("tariffs", { type: tariffConnectInput });
    // t.field("thirdPartyLog", { type: thirdPartyLogCreateInput });
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

// export const CertificateStatus = enumType({
//   name: "CertificateStatus",
//   members: ["CURRENT", "ARCHIEVED"],
// });
