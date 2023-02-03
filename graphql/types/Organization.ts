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

export const Organization = objectType({
  name: "Organization",
  definition(t) {
    t.string("id");
    t.string("orgName");
    t.string("region");
    t.string("city");
    t.string("mobileNumber");
    t.field("description", { type: OrgDesc });
    t.date("createdAt");
    t.date("updatedAt");
    t.nonNull.list.nonNull.field("branchs", {
      type: "Branch",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.organization
          .findUnique({
            where: { id: _parent.id },
          })
          .branchs();
      },
    });
  },
});

export const OrganizationPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedOrganization", {
      type: FeedOrganization,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(OrganizationOrderByInput)) }), // 1
      },
      resolve: async (parent, args, ctx) => {
        const where = args.filter
          ? {
              OR: [
                { id: args.filter },
                { orgName: args.filter },
                { mobileNumber: args.filter },
              ],
            }
          : {};

        const organizations = await ctx.prisma.organization.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.OrganizationOrderByWithRelationInput>
            | undefined,
        });

        const totalOrganization = await ctx.prisma.organization.count({
          where,
        }); // 2
        const maxPage = Math.ceil(totalOrganization / 20);

        return {
          organizations,
          maxPage,
          totalOrganization,
        };
      },
    });
  },
});

export const organizationByName = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("organizationByName", {
      type: "Organization",
      args: { orgName: nonNull(stringArg()) },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.organization.findUnique({
          where: {
            orgName: args.orgName,
          },
        });
      },
    });
  },
});

export const listAllOrganization = extendType({
  type: "Query",
  definition(t) {
    t.list.field("listAllOrganization", {
      type: "Organization",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.organization.findMany();
      },
    });
  },
});

export const FeedOrganization = objectType({
  name: "FeedOrganization",
  definition(t) {
    t.nonNull.list.nonNull.field("organizations", { type: Organization });
    t.nonNull.int("totalOrganization");
    t.int("maxPage");
  },
});

// Mutation

export const createOrganizationMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createOrganization", {
      type: Organization,
      args: {
        input: nonNull(organizationCreateInput),
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
          throw new Error(`You do not have permission to perform this action`);
        }

        return await ctx.prisma.organization.create({
          data: {
            // ...args.input,
            orgName: args.input.orgName,
            region: args.input.region ?? null,
            city: args.input.city ?? null,
            mobileNumber: args.input.mobileNumber,
            description: args.input.description,
          },
        });
      },
    });
  },
});

export const updateOrganizationMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateOrganization", {
      type: Organization,
      args: {
        id: nonNull(stringArg()),
        input: nonNull(organizationUpdateInput),
      },
      resolve: async (_parent, args, ctx) => {
        // const user = await ctx.prisma.user.findUnique({
        //   where: {
        //     email: ctx.session.user.email,
        //   },
        // });
        // if (!user || user.role !== "SUPERADMIN") {
        //   throw new Error(`You do not have permission to perform action`);
        // }
        return ctx.prisma.organization.update({
          where: { id: args.id },
          data: {
            ...args.input,
          },
        });
      },
    });
  },
});

export const deleteOrganizationMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteOrganization", {
      type: Organization,
      args: {
        orgId: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        // const user = await ctx.prisma.user.findUnique({
        //   where: {
        //     email: ctx.session.user.email,
        //   },
        // });
        // if (!user || user.role !== "SUPERADMIN") {
        //   throw new Error(`You do not have permission to perform action`);
        // }
        return await ctx.prisma.organization.delete({
          where: {
            id: args.orgId,
          },
        });
      },
    });
  },
});

export const organizationCreateInput = inputObjectType({
  name: "organizationCreateInput",
  definition(t) {
    t.string("orgName");
    t.nullable.string("region");
    t.nullable.string("city");
    t.string("mobileNumber");
    t.field("description", { type: OrgDesc });
  },
});

export const organizationUpdateInput = inputObjectType({
  name: "organizationUpdateInput",
  definition(t) {
    t.string("orgName");
    t.string("region");
    t.string("city");
    t.string("mobileNumber");
  },
});

export const organizationConnectInput = inputObjectType({
  name: "organizationConnectInput",
  definition(t) {
    t.string("id");
  },
});

export const OrganizationOrderByInput = inputObjectType({
  name: "OrganizationOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});

export const OrgDesc = enumType({
  name: "OrgDesc",
  members: ["MINISTRY", "INSURANCE", "TRAFFICPOLICE"],
});
