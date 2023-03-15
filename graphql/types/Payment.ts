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
    // t.nullable.list.nullable.field("vehicles", {
    //   type: "Vehicle",
    //   async resolve(_parent, _args, ctx) {
    //     return await ctx.prisma.payment
    //       .findUnique({
    //         where: { id: _parent.id },
    //       })
    //       .vehicles();
    //   },
    // });
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
              //   regNumber: args.filter,
              //   plateNumber: args.filter,
              //   certificateNumber: args.filter,
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
        const maxPage = Math.ceil(totalPayments / 20);

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

export const createPaymentMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createPayment", {
      type: Payment,
      args: {
        input: nonNull(PaymentCreateInput),
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
        const vehicleData = await ctx.prisma.vehicle.findFirst({
          where: {
            plateNumber: args.input.vehicles.plateNumber,
          },
          include: {
            insureds: true,
          },
        });
        return await ctx.prisma.payment.create({
          data: {
            refNumber: `RefN-${format(new Date(), "yyMMiHms")}`,
            premiumTarif: args.input.premiumTarif,
            insureds: {
              connect: {
                regNumber: vehicleData.insureds.regNumber,
              },
            },
            // vehicles: {
            //   connect: {
            //     plateNumber: args.input.vehicles.plateNumber,
            //   },
            // },
            certificates: {
              connect: {
                certificateNumber: args.input.certificates.certificateNumber,
              },
            },
          },
        });
      },
    });
  },
});

export const updatePaymentMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updatePayment", {
      type: Payment,
      args: {
        refNumber: nonNull(stringArg()),
        input: nonNull(PaymentUpdateInput),
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
        return await ctx.prisma.payment.update({
          where: { refNumber: args.refNumber },
          data: {
            ...args.input,
          },
        });
      },
    });
  },
});

export const deletePaymentMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deletePayment", {
      type: Payment,
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
        if (!user || user.memberships.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }

        return await ctx.prisma.payment.update({
          where: { refNumber: args.refNumber },
          data: {
            deletedStatus: true,
            deletedAt: new Date(),
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
