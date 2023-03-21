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
import { UserOrderByInput } from "./User";
import { OrgDesc } from "./Organization";
import { branchConnectInput } from "./Branch";

export const Membership = objectType({
  name: "Membership",
  definition(t) {
    t.string("id");
    t.field("role", { type: MembershipRole });
    t.date("createdAt");
    t.date("updatedAt");
    t.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.membership
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
    t.field("users", {
      type: "User",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.membership
          .findUnique({
            where: { id: _parent.id },
          })
          .users();
      },
    });
  },
});

export const MembershipPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedMembership", {
      type: FeedMembership,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(UserOrderByInput)) }), // 1
      },
      resolve: async (parent, args, ctx) => {
        const where = args.filter ? {} : {};

        const membership = await ctx.prisma.membership.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.PolicyOrderByWithRelationInput>
            | undefined,
        });

        const totalMembership = await ctx.prisma.membership.count({
          where,
        }); // 2
        const maxPage = Math.ceil(totalMembership / args?.take);

        return {
          membership,
          maxPage,
          totalMembership,
        };
      },
    });
  },
});
export const MembershipRoleList = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("roleList", {
      type: "Membership",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.membership.findMany({
          distinct: ["role"],
        });
      },
    });
  },
});

export const BranchRoleList = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("branchRoleList", {
      type: "Membership",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.membership.findMany({
          where: {
            NOT: {
              OR: [
                { role: "SUPERADMIN" },
                { role: "TRAFFICPOLICEADMIN" },
                { role: "TRAFFICPOLICEMEMBER" },
              ],
            },
          },
          distinct: ["role"],
        });
      },
    });
  },
});

export const roleByOrgDesc = extendType({
  type: "Query",
  definition(t) {
    t.field("feedRoleByOrgDesc", {
      type: FeedRoleByOrgDesc,
      args: {
        input: nonNull(orgRoleDescInput),
      },
      resolve: async (_parent, args, ctx) => {
        const membership = await ctx.prisma.membership.findMany({
          where: {
            NOT: {
              role: "TRAFFICPOLICEADMIN",
            },
            branchs: {
              organizations: {
                description: args.input.description,
              },
            },
          },
          distinct: ["role"],
        });

        return {
          membership,
        };
      },
    });
  },
});

export const PoliceRoleList = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("policeRoleList", {
      type: "Membership",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.membership.findMany({
          where: {
            OR: [
              { role: "TRAFFICPOLICEADMIN" },
              { role: "TRAFFICPOLICEMEMBER" },
            ],
          },
          distinct: ["role"],
        });
      },
    });
  },
});

export const FeedMembership = objectType({
  name: "FeedMembership",
  definition(t) {
    t.nonNull.list.nonNull.field("membership", { type: Membership });
    t.nonNull.int("totalMembership"); // 2
    t.int("maxPage");
  },
});

export const MembershipRole = enumType({
  name: "MembershipRole",
  members: [
    "SUPERADMIN",
    "INSURER",
    "BRANCHADMIN",
    "MEMBER",
    "USER",
    "TRAFFICPOLICEADMIN",
    "TRAFFICPOLICEMEMBER",
  ],
});

export const membershipCreateInput = inputObjectType({
  name: "membershipCreateInput",
  definition(t) {
    t.field("role", { type: MembershipRole });
    t.field("branchs", { type: branchConnectInput });
  },
});

export const membershipConnectInput = inputObjectType({
  name: "membershipConnectInput",
  definition(t) {
    t.field("role", { type: MembershipRole });
  },
});

export const FeedRoleByOrgDesc = objectType({
  name: "FeedRoleByOrgDesc",
  definition(t) {
    t.nonNull.list.nonNull.field("membership", { type: Membership });
  },
});

export const orgRoleDescInput = inputObjectType({
  name: "orgRoleDescInput",
  definition(t) {
    t.field("description", { type: OrgDesc });
  },
});
