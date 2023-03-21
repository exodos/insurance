import { Prisma } from "@prisma/client";
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

export const RegionList = objectType({
  name: "RegionList",
  definition(t) {
    t.int("id");
    t.nullable.string("regionName");
    t.nullable.string("regionApp");
    t.date("createdAt");
  },
});

export const FeedRegionCode = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("regionCode", {
      type: "RegionList",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.regionList.findMany({
          // select: {
          //   regionApp: true,
          // },
        });
      },
    });
  },
});

export const RegionListPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedRegionList", {
      type: FeedRegionList,
      resolve: async (parent, args, ctx) => {
        const regionList = await ctx.prisma.regionList.findMany();

        const totalRegionList = await ctx.prisma.regionList.count();
        const maxPage = Math.ceil(totalRegionList / 10);

        return {
          // 4
          regionList,
          maxPage,
          totalRegionList,
        };
      },
    });
  },
});

export const FeedRegionList = objectType({
  name: "FeedRegionList",
  definition(t) {
    t.nonNull.list.nonNull.field("regionList", { type: RegionList }); // 1
    t.nonNull.int("totalRegionList"); // 2
    t.int("maxPage");
  },
});
