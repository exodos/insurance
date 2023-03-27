import { sendMultiSmsMessage, sendSmsMessage } from "./../../lib/config";
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
import { Sort } from "./User";
import { format } from "date-fns";
import { vehicleConnectInput } from "./Vehicle";
import { certificateConnectInput } from "./Certificate";

export const Payment = objectType({
  name: "Payment",
  definition(t) {
    t.string("id");
    t.string("refNumber");
    t.float("premiumTarif");
    t.field("paymentStatus", { type: PaymentStatus });
    t.field("commissionStatus", { type: CommissioningStatus });
    t.boolean("deletedStatus");
    t.nullable.date("deletedAt");
    t.date("createdAt");
    t.date("updatedAt");
    t.field("insureds", {
      type: "Insured",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.payment
          .findUnique({
            where: { id: _parent.id },
          })
          .insureds();
      },
    });
    t.nullable.list.nullable.field("certificates", {
      type: "Certificate",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.payment
          .findUnique({
            where: { id: _parent.id },
          })
          .certificates();
      },
    });
    t.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.payment
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
  },
});

export const Paymentagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedPayment", {
      type: FeedPayment,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(PaymentOrderByInput)) }),
      },
      resolve: async (_parent, args, ctx) => {
        const where = args.filter
          ? {
              refNumber: args.filter,
              insureds: {
                regNumber: args.filter,
              },
              certificates: {
                some: {
                  certificateNumber: args.filter,
                  vehicles: {
                    plateNumber: args.filter,
                  },
                },
              },
            }
          : {};

        const payments = await ctx.prisma.payment.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.PaymentOrderByWithRelationInput>
            | undefined,
        });

        const totalPayments = await ctx.prisma.payment.count({
          where,
        });
        const maxPage = Math.ceil(totalPayments / args?.take);

        return {
          payments,
          maxPage,
          totalPayments,
        };
      },
    });
  },
});

export const PaymentStatusPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedPaymentByStatus", {
      type: FeedPaymentByStatus,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        input: nonNull(PaymentStatusInput),
        orderBy: arg({ type: list(nonNull(PaymentOrderByInput)) }),
      },
      resolve: async (_parent, args, ctx) => {
        const where = args.filter
          ? {
              refNumber: args.filter,
              paymentStatus: args.input.paymentStatus,
            }
          : {
              paymentStatus: args.input.paymentStatus,
            };

        const payments = await ctx.prisma.payment.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.PaymentOrderByWithRelationInput>
            | undefined,
        });

        const totalPayments = await ctx.prisma.payment.count({
          where,
        });
        const maxPage = Math.ceil(totalPayments / args?.take);

        return {
          payments,
          maxPage,
          totalPayments,
        };
      },
    });
  },
});

export const PaymentStatusInsurerPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedPaymentInsurerByStatus", {
      type: FeedPaymentInsurerByStatus,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(PaymentOrderByInput)) }),
        input: nonNull(PaymentStatusInput),
        orgId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const where = args.filter
          ? {
              refNumber: args.filter,
              paymentStatus: args.input.paymentStatus,
              branchs: {
                orgId: args.orgId,
              },
            }
          : {
              paymentStatus: args.input.paymentStatus,
              branchs: {
                orgId: args.orgId,
              },
            };

        const payments = await ctx.prisma.payment.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.PaymentOrderByWithRelationInput>
            | undefined,
        });

        const totalPayments = await ctx.prisma.payment.count({
          where,
        });
        const maxPage = Math.ceil(totalPayments / args?.take);

        return {
          payments,
          maxPage,
          totalPayments,
        };
      },
    });
  },
});

export const PaymentStatusBranchPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedPaymentBranchByStatus", {
      type: FeedPaymentBranchByStatus,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(PaymentOrderByInput)) }),
        input: nonNull(PaymentStatusInput),
        branchId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const where = args.filter
          ? {
              refNumber: args.filter,
              paymentStatus: args.input.paymentStatus,
              branchs: {
                id: args.branchId,
              },
            }
          : {
              paymentStatus: args.input.paymentStatus,
              branchs: {
                id: args.branchId,
              },
            };

        const payments = await ctx.prisma.payment.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.PaymentOrderByWithRelationInput>
            | undefined,
        });

        const totalPayments = await ctx.prisma.payment.count({
          where,
        });
        const maxPage = Math.ceil(totalPayments / args?.take);

        return {
          payments,
          maxPage,
          totalPayments,
        };
      },
    });
  },
});

export const paymentByRefQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("paymentByRef", {
      type: Payment,
      args: { refNumber: nonNull(stringArg()) },
      resolve: async (_parent, args, ctx) => {
        return ctx.prisma.payment.findUnique({
          where: {
            refNumber: args.refNumber,
          },
        });
      },
    });
  },
});

export const paymentByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("paymentByID", {
      type: Payment,
      args: { id: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.payment.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const updatePaymentStatusMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updatePaymentStatus", {
      type: UpdatePaymentStatus,
      args: {
        refNumber: nonNull(stringArg()),
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
            user.memberships.role !== "BRANCHADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }

        const firstData = await ctx.prisma.payment.findFirst({
          where: {
            refNumber: args.refNumber,
          },
          include: {
            insureds: true,
            certificates: true,
          },
        });

        const response = await ctx.prisma.$transaction(async (tx) => {
          const paymentData = await tx.payment.update({
            where: { refNumber: args.refNumber },
            data: {
              paymentStatus: "PendingPayment",
            },
          });

          const certData = await tx.certificate.updateMany({
            where: {
              certificateNumber: {
                in: firstData.certificates.map((c) => c.certificateNumber),
              },
            },
            data: {
              status: "PendingPayment",
            },
          });
          const vehicleData = await tx.vehicle.updateMany({
            where: {
              certificates: {
                certificateNumber: {
                  in: firstData.certificates.map((c) => c.certificateNumber),
                },
              },
            },
            data: {
              isInsured: "PENDING",
            },
          });

          return vehicleData;
        });

        if (response) {
          let mobileNumber = firstData.insureds.mobileNumber;
          let message = `Dear ${firstData.insureds.firstName}, Your reference number is: ${args.refNumber}, Please pay with Telebirr using this reference number`;
          await sendSmsMessage(mobileNumber, message);
        }

        return response;
      },
    });
  },
});

export const bulkUpdatePaymentStatusMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("bulkUpdateStatus", {
      type: "BulkUpdateStatus",
      args: {
        paymentRefNumber: nonNull(list(stringArg())),
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
            user.memberships.role !== "BRANCHADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }

        const firstData = await ctx.prisma.payment.findMany({
          where: {
            refNumber: {
              in: args.paymentRefNumber.map((cId) => cId),
            },
          },
          include: {
            insureds: true,
            certificates: true,
          },
        });

        // let paymentData: Prisma.BatchPayload, certData: Prisma.BatchPayload;
        const response = await ctx.prisma.$transaction(async (tx) => {
          const paymentData = await tx.payment.updateMany({
            where: {
              refNumber: {
                in: args.paymentRefNumber.map((cId) => cId),
              },
            },
            data: {
              paymentStatus: "PendingPayment",
            },
          });

          const certData = await tx.certificate.updateMany({
            where: {
              payments: {
                some: {
                  refNumber: {
                    in: args.paymentRefNumber.map((cId) => cId),
                  },
                },
              },
            },
            data: {
              status: "PendingPayment",
            },
          });

          const vehicleData = await tx.vehicle.updateMany({
            where: {
              certificates: {
                payments: {
                  some: {
                    refNumber: {
                      in: args.paymentRefNumber.map((cId) => cId),
                    },
                  },
                },
              },
            },
            data: {
              isInsured: "PENDING",
            },
          });

          return vehicleData;
        });

        let smsMessage = [];

        if (response) {
          args.paymentRefNumber.map(async (v) => {
            let value = await ctx.prisma.payment.findFirst({
              where: {
                refNumber: v,
              },
              include: {
                insureds: true,
              },
            });

            if (value) {
              smsMessage.push({
                mobileNumber: value.insureds.mobileNumber,
                message: `Dear ${value.insureds.firstName}, Your reference number Is: ${v}, Please pay with Telebirr using this reference number`,
              });
            }
          });

          await sendMultiSmsMessage(smsMessage);
        }

        return response;
      },
    });
  },
});

export const exportAdminPaymentQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportAdminPayment", {
      type: Payment,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
        paymentStatus: nonNull(PaymentStatus),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.payment.findMany({
          where: {
            updatedAt: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
            paymentStatus: args.paymentStatus,
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      },
    });
  },
});

export const exportInsurerPaymentQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportInsurerPayment", {
      type: Payment,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
        paymentStatus: nonNull(PaymentStatus),
        orgId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.payment.findMany({
          where: {
            updatedAt: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
            paymentStatus: args.paymentStatus,
            branchs: {
              orgId: args.orgId,
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
export const exportBranchPaymentQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportBranchPayment", {
      type: Payment,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
        paymentStatus: nonNull(PaymentStatus),
        branchId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.payment.findMany({
          where: {
            updatedAt: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
            },
            paymentStatus: args.paymentStatus,
            branchs: {
              id: args.branchId,
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

export const FeedPayment = objectType({
  name: "FeedPayment",
  definition(t) {
    t.nonNull.list.nonNull.field("payments", { type: Payment });
    t.nonNull.int("totalPayments");
    t.int("maxPage");
  },
});
export const FeedPaymentByStatus = objectType({
  name: "FeedPaymentByStatus",
  definition(t) {
    t.nonNull.list.nonNull.field("payments", { type: Payment });
    t.nonNull.int("totalPayments");
    t.int("maxPage");
  },
});

export const FeedPaymentInsurerByStatus = objectType({
  name: "FeedPaymentInsurerByStatus",
  definition(t) {
    t.nonNull.list.nonNull.field("payments", { type: Payment });
    t.nonNull.int("totalPayments");
    t.int("maxPage");
  },
});

export const FeedPaymentBranchByStatus = objectType({
  name: "FeedPaymentBranchByStatus",
  definition(t) {
    t.nonNull.list.nonNull.field("payments", { type: Payment });
    t.nonNull.int("totalPayments");
    t.int("maxPage");
  },
});

export const PaymentOrderByInput = inputObjectType({
  name: "PaymentOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});

export const PaymentCreateInput = inputObjectType({
  name: "PaymentCreateInput",
  definition(t) {
    t.float("premiumTarif");
    t.field("vehicles", { type: vehicleConnectInput });
    t.field("certificates", { type: certificateConnectInput });
  },
});

export const PaymentStatusInput = inputObjectType({
  name: "PaymentStatusInput",
  definition(t) {
    t.field("paymentStatus", { type: PaymentStatus });
  },
});

export const PaymentUpdateInput = inputObjectType({
  name: "PaymentUpdateInput",
  definition(t) {
    t.field("paymentStatus", { type: PaymentStatus });
    t.field("commissionStatus", { type: CommissioningStatus });
  },
});

export const PaymentStatus = enumType({
  name: "PaymentStatus",
  members: ["Payed", "PendingPayment", "PendingApproval"],
});

export const CommissioningStatus = enumType({
  name: "CommissioningStatus",
  members: ["Commissioned", "NotCommissioned"],
});

export const BulkUpdateStatus = objectType({
  name: "BulkUpdateStatus",
  definition(t) {
    t.nonNull.int("count");
  },
});

export const UpdatePaymentStatus = objectType({
  name: "UpdatePaymentStatus",
  definition(t) {
    t.nonNull.int("count");
  },
});
