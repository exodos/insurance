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
import { PolicyOrderByInput } from "./Policy";

export const Victim = objectType({
  name: "Victim",
  definition(t) {
    t.string("id");
    t.string("victimName");
    t.field("victimCondition", { type: VictimedCondition });
    t.field("injuryType", { type: InjuryType });
    t.nullable.string("victimAddress");
    t.nullable.string("victimFamilyPhoneNumber");
    t.nullable.string("victimHospitalized");
    t.date("createdAt");
    t.date("updatedAt");
    t.nullable.list.nullable.field("insuredPoliceReports", {
      type: "InsuredPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.victim
          .findUnique({
            where: { id: _parent.id },
          })
          .insuredPoliceReports();
      },
    });
    t.nullable.list.nullable.field("hitAndRunPoliceReports", {
      type: "HitAndRunPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.victim
          .findUnique({
            where: { id: _parent.id },
          })
          .hitAndRunPoliceReports();
      },
    });
  },
});

export const VictimPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedVictim", {
      type: FeedVictim,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(PolicyOrderByInput)) }), // 1
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              OR: [{ victimName: args.filter }, { victimAddress: args.filter }],
            }
          : {};

        const victim = await ctx.prisma.victim.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.PolicyOrderByWithRelationInput>
            | undefined,
        });

        const totalVictim = await ctx.prisma.victim.count({
          where,
        }); // 2
        const maxPage = Math.ceil(totalVictim / args?.take);

        return {
          // 4
          victim,
          maxPage,
          totalVictim,
        };
      },
    });
  },
});

export const victimByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("victimByID", {
      type: Victim,
      args: { id: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.victim.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const createVictimMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createVictim", {
      type: Victim,
      args: {
        input: nonNull(victimCreateInput),
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
        if (!user || user.memberships.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.victim.create({
          data: {
            ...args.input,
            victimName: args.input.victimName,
            victimCondition: args.input.victimCondition,
            injuryType: args.input.injuryType,
            victimAddress: args.input.victimAddress,
            victimFamilyPhoneNumber: args.input.victimFamilyPhoneNumber,
            victimHospitalized: args.input.victimHospitalized,
          },
        });
      },
    });
  },
});

export const updateVictimMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateVictim", {
      type: Victim,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(victimCreateInput),
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
        if (!user || user.memberships.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.victim.update({
          where: { id: args.id },
          data: {
            ...args.input,
          },
        });
      },
    });
  },
});

export const deleteVictimMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteVictim", {
      type: Victim,
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
        if (!user || user.memberships.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }
        return await ctx.prisma.victim.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const FeedVictim = objectType({
  name: "FeedVictim",
  definition(t) {
    t.nonNull.list.nonNull.field("victim", { type: Victim }); // 1
    t.nonNull.int("totalVictim"); // 2
    t.int("maxPage");
  },
});

export const victimCreateInput = inputObjectType({
  name: "victimCreateInput",
  definition(t) {
    t.nullable.string("victimName");
    t.nullable.field("victimCondition", { type: VictimedCondition });
    t.nullable.field("injuryType", { type: InjuryType });
    t.nullable.string("victimAddress");
    t.nullable.string("victimFamilyPhoneNumber");
    t.nullable.string("victimHospitalized");
  },
});

export const VictimedCondition = enumType({
  name: "VictimedCondition",
  members: ["PASSENGER", "PEDESTRIAN", "DRIVER", "ASSISTANT"],
});

export const InjuryType = enumType({
  name: "InjuryType",
  members: ["SIMPLE", "CRITICAL", "DEATH"],
});
