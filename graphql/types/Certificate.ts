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
import { addYears } from "date-fns";
import { Prisma } from "@prisma/client";
import { policyCreateInput, policyUpdateInput } from "./Policy";
import { format } from "date-fns";
import { Sort } from "./User";
import { tariffConnectInput } from "./Tariff";
import { branchConnectInput } from "./Branch";

export const Certificate = objectType({
  name: "Certificate",
  definition(t) {
    t.string("id");
    t.string("certificateNumber");
    t.float("premiumTarif");
    t.date("issuedDate");
    t.date("updatedAt");
    // t.boolean("deleted");
    // t.nullable.date("deletedTime");
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
              // deleted: false,
              certificateNumber: args.filter,
            }
          : {
              // deleted: false
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
              certificateNumber: args.filter,
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
              certificateNumber: args.filter,
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
        return await ctx.prisma.$transaction(async (tx: any) => {
          let certData = null;
          let vehiUpdate = null;
          certData = await tx.certificate.create({
            data: {
              ...args.input,
              certificateNumber: `CN-${format(new Date(), "yyMMiHms")}`,
              premiumTarif: vehicleDetail.premiumTarif,
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

        let certData = null;
        let vehicleData = null;

        [certData, vehicleData] = await ctx.prisma.$transaction([
          ctx.prisma.certificate.create({
            data: {
              // ...args.input,
              certificateNumber: `CN-${format(new Date(), "yyMMiHms")}`,
              premiumTarif: vehicleDetail.premiumTarif,
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

        // return await ctx.prisma.$transaction(async (tx: any) => {
        //   let certData = null;
        //   let vehiUpdate = null;
        //   certData = await tx.certificate.create({
        //     data: {
        //       ...args.input,
        //       certificateNumber: `CN-${format(new Date(), "yyMMiHms")}`,
        //       insureds: {
        //         connect: {
        //           mobileNumber: vehicleDetail.insureds.mobileNumber,
        //         },
        //       },
        //       vehicles: {
        //         connect: {
        //           plateNumber: args.plateNumber,
        //         },
        //       },
        //       policies: {
        //         create: {
        //           policyNumber: args.input.policies.policyNumber,
        //           policyStartDate: args.input.policies.policyStartDate,
        //           policyExpireDate: addYears(
        //             new Date(args.input.policies.policyStartDate),
        //             1
        //           ),
        //           policyIssuedConditions:
        //             args.input.policies.policyIssuedConditions,
        //           personsEntitledToUse:
        //             args.input.policies.personsEntitledToUse,
        //         },
        //       },
        //       branchs: {
        //         connect: {
        //           id: vehicleDetail.branchs.id,
        //         },
        //       },
        //       tariffs: {
        //         connect: {
        //           tariffCode: args.input.tariffs.tariffCode,
        //         },
        //       },
        //     },
        //   });

        //   vehiUpdate = tx.vehicle.update({
        //     where: {
        //       plateNumber: args.plateNumber,
        //     },
        //     data: {
        //       isInsured: "INSURED",
        //     },
        //   });

        //   return vehiUpdate;
        // });
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
          },
        });

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
