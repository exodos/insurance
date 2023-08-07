import { extendType, objectType } from "nexus";

export const CodeList = objectType({
  name: "CodeList",
  definition(t) {
    t.int("id");
    t.string("code");
    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const FeedCodeListCode = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("plateCode", {
      type: "CodeList",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.codeList.findMany({
          // select: {
          //   regionApp: true,
          // },
        });
      },
    });
  },
});

export const PlateCodePagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedPlateCodeList", {
      type: FeedCodeList,
      resolve: async (parent, args, ctx) => {
        const codeList = await ctx.prisma.codeList.findMany();

        const totalCodeList = await ctx.prisma.codeList.count();
        const maxPage = Math.ceil(totalCodeList / 20);

        return {
          codeList,
          maxPage,
          totalCodeList,
        };
      },
    });
  },
});

export const FeedCodeList = objectType({
  name: "FeedCodeList",
  definition(t) {
    t.nonNull.list.nonNull.field("codeList", { type: CodeList });
    t.nonNull.int("totalCodeList");
    t.int("maxPage");
  },
});
