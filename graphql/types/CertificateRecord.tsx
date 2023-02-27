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
import { Sort } from "./User";
import { Prisma } from "@prisma/client";

export const CertificateRecord = objectType({
  name: "CertificateRecord",
  definition(t) {
    t.string("id");
    t.date("createdAt");
    t.date("updatedAt");
    t.nullable.list.field("certificates", {
      type: "Certificate",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.certificateRecord
          .findUnique({
            where: { id: _parent.id },
          })
          .certificates();
      },
    });
    t.nullable.list.field("policies", {
      type: "Policy",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.certificateRecord
          .findUnique({
            where: { id: _parent.id },
          })
          .policies();
      },
    });
    t.nullable.list.field("vehicles", {
      type: "Vehicle",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.certificateRecord
          .findUnique({
            where: { id: _parent.id },
          })
          .vehicles();
      },
    });
    t.nullable.list.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.certificateRecord
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
  },
});

export const CertificateRecordPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedCertificateRecord", {
      type: FeedCertificateRecord,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(CertificateRecordOrderByInput)) }),
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              OR: [
                {
                  certificates: {
                    some: {
                      certificateNumber: args.filter,
                    },
                  },
                },
                {
                  vehicles: {
                    some: {
                      plateNumber: args.filter,
                    },
                  },
                },
              ],
            }
          : {};

        const certificateRecord = await ctx.prisma.certificateRecord.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.CertificateRecordOrderByWithRelationInput>
            | undefined,
        });

        const totalCertificateRecord = await ctx.prisma.certificateRecord.count(
          {
            where,
          }
        );
        const maxPage = Math.ceil(totalCertificateRecord / args?.take);

        return {
          certificateRecord,
          maxPage,
          totalCertificateRecord,
        };
      },
    });
  },
});

export const FeedCertificateRecord = objectType({
  name: "FeedCertificateRecord",
  definition(t) {
    t.nonNull.list.nonNull.field("certificateRecord", {
      type: CertificateRecord,
    });
    t.nonNull.int("totalCertificateRecord");
    t.int("maxPage");
  },
});

export const CertificateRecordOrderByInput = inputObjectType({
  name: "CertificateRecordOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});
