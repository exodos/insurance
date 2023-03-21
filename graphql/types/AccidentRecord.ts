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
import { Prisma } from "@prisma/client";

export const AccidentRecord = objectType({
  name: "AccidentRecord",
  definition(t) {
    t.string("id");
    t.nullable.field("bodilyInjury", { type: ACCIDENTSUBTYPE });
    t.nullable.float("propertyInjury");
    t.date("createdAt");
    t.date("updatedAt");
    t.field("vehicles", {
      type: "Vehicle",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.accidentRecord
          .findUnique({
            where: { id: _parent.id },
          })
          .vehicles();
      },
    });
    t.field("claims", {
      type: "Claim",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.accidentRecord
          .findUnique({
            where: { id: _parent.id },
          })
          .claims();
      },
    });
  },
});

export const AccidentRecordPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedAccidentRecord", {
      type: FeedAccidentRecord,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(AccidentRecordOrderByInput)) }),
      },
      resolve: async (parent, args, ctx) => {
        const where = args.filter
          ? {
              OR: [{ id: args.filter }],
            }
          : {};

        const accidentRecords = await ctx.prisma.accidentRecord.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.AccidentRecordOrderByWithRelationInput>
            | undefined,
        });

        const totalAccidentRecord = await ctx.prisma.accidentRecord.count({
          where,
        });
        const maxPage = Math.ceil(totalAccidentRecord / args?.take);

        return {
          accidentRecords,
          maxPage,
          totalAccidentRecord,
        };
      },
    });
  },
});

export const FeedAccidentRecord = objectType({
  name: "FeedAccidentRecord",
  definition(t) {
    t.nonNull.list.nonNull.field("accidentRecords", { type: AccidentRecord });
    t.nonNull.int("totalAccidentRecord");
    t.int("maxPage");
  },
});

export const AccidentRecordOrderByInput = inputObjectType({
  name: "AccidentRecordOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});

export const ACCIDENTSUBTYPE = enumType({
  name: "ACCIDENTSUBTYPE",
  members: ["SlightBodilyInjury", "SaviorBodilyInjury", "Death"],
});

export const accidentCreateInput = inputObjectType({
  name: "accidentCreateInput",
  definition(t) {
    t.nullable.field("bodilyInjury", { type: ACCIDENTSUBTYPE });
    t.nullable.float("propertyInjury");
    // t.field("vehicles", { type: vehicleConnectInput });
  },
});
