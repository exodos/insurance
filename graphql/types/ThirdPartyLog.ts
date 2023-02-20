import { Prisma } from "@prisma/client";
import { addDays, endOfDay, startOfDay, subDays } from "date-fns";
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

export const ThirdPartyLog = objectType({
  name: "ThirdPartyLog",
  definition(t) {
    t.string("id");
    t.string("userEmail");
    t.string("orgName");
    t.string("action");
    t.string("mode");
    t.json("oldValue");
    t.json("newValue");
    t.date("timeStamp");
    t.list.field("certificates", {
      type: "Certificate",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.thirdPartyLog
          .findUnique({
            where: { id: _parent.id },
          })
          .certificates();
      },
    });
    t.list.field("claims", {
      type: "Claim",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.thirdPartyLog
          .findUnique({
            where: { id: _parent.id },
          })
          .claims();
      },
    });
    t.list.field("insureds", {
      type: "Insured",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.thirdPartyLog
          .findUnique({
            where: { id: _parent.id },
          })
          .insureds();
      },
    });
    t.list.field("insuredPoliceReports", {
      type: "InsuredPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.thirdPartyLog
          .findUnique({
            where: { id: _parent.id },
          })
          .insuredPoliceReports();
      },
    });
    t.list.field("memberships", {
      type: "Membership",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.thirdPartyLog
          .findUnique({
            where: { id: _parent.id },
          })
          .memberships();
      },
    });
    t.list.field("organizations", {
      type: "Organization",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.thirdPartyLog
          .findUnique({
            where: { id: _parent.id },
          })
          .organizations();
      },
    });
    t.list.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.thirdPartyLog
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
    t.list.field("users", {
      type: "User",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.thirdPartyLog
          .findUnique({
            where: { id: _parent.id },
          })
          .users();
      },
    });
    t.list.field("vehicles", {
      type: "Vehicle",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.thirdPartyLog
          .findUnique({
            where: { id: _parent.id },
          })
          .vehicles();
      },
    });
    t.list.field("tariffs", {
      type: "Tariff",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.thirdPartyLog
          .findUnique({
            where: { id: _parent.id },
          })
          .tariffs();
      },
    });
  },
});

export const exportThirdPartyLogLogQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportThirdPartyLogLog", {
      type: ThirdPartyLog,
      args: {
        action: nonNull(stringArg()),
        mode: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const dateTo = endOfDay(new Date(args.dateTo));
        const dateFrom = startOfDay(new Date(dateTo));
        return await ctx.prisma.thirdPartyLog.findMany({
          where: {
            action: args.action,
            mode: args.mode,
            timeStamp: {
              lte: new Date(dateTo),
              gte: new Date(dateFrom),
            },
          },
          orderBy: {
            timeStamp: "desc",
          },
        });
      },
    });
  },
});

export const ThirdPartyLogPaginate = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedThirdPartyLogs", {
      type: FeedThirdPartyLogs,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(ThirdPartyLogOrderByInput)) }),
      },
      async resolve(parent, args, ctx) {
        const where = args.filter
          ? {
              OR: [
                {
                  userEmail: {
                    contains: args.filter,
                  },
                },
                { orgName: args.filter },
              ],
            }
          : {};

        const thirdPartyLogs = await ctx.prisma.thirdPartyLog.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.ThirdPartyLogOrderByWithRelationInput>
            | undefined,
        });

        const totalThirdPartyLogs = await ctx.prisma.thirdPartyLog.count({
          where,
        });
        const maxPage = Math.ceil(totalThirdPartyLogs / 20);

        return {
          thirdPartyLogs,
          maxPage,
          totalThirdPartyLogs,
        };
      },
    });
  },
});

export const FeedThirdPartyLogs = objectType({
  name: "FeedThirdPartyLogs",
  definition(t) {
    t.nonNull.list.nonNull.field("thirdPartyLogs", { type: ThirdPartyLog });
    t.nonNull.int("totalThirdPartyLogs");
    t.int("maxPage");
  },
});

export const thirdPartyLogsByEmailQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("thirdPartyLogsByEmail", {
      type: ThirdPartyLog,
      args: { userEmail: nonNull(stringArg()) },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.thirdPartyLog.findMany({
          where: {
            userEmail: args.userEmail,
          },
        });
      },
    });
  },
});

export const thirdPartyLogInput = inputObjectType({
  name: "thirdPartyLogInput",
  definition(t) {
    t.string("userEmail");
    t.string("orgName");
    t.string("action");
    t.string("mode");
    t.json("oldValue");
    t.json("newValue");
  },
});

export const thirdPartyLogCreateInput = inputObjectType({
  name: "thirdPartyLogCreateInput",
  definition(t) {
    t.json("newValue");
  },
});

export const thirdPartyLogEditInput = inputObjectType({
  name: "thirdPartyLogEditInput",
  definition(t) {
    t.json("oldValue");
    t.json("newValue");
  },
});

export const thirdPartyLogDeleteInput = inputObjectType({
  name: "thirdPartyLogDeleteInput",
  definition(t) {
    t.json("oldValue");
  },
});

export const operationLogStatusInput = inputObjectType({
  name: "operationLogStatusInput",
  definition(t) {
    t.nonNull.string("action");
    t.nonNull.json("oldValue");
    t.nonNull.json("newValue");
  },
});

export const ThirdPartyLogOrderByInput = inputObjectType({
  name: "LogOrderByInput",
  definition(t) {
    t.field("timeStamp", { type: Sort });
  },
});
