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
    t.string("orgCode");
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
    t.nonNull.list.nonNull.field("users", {
      type: "User",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.organization
          .findUnique({
            where: { id: _parent.id },
          })
          .users();
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
        const maxPage = Math.ceil(totalOrganization / args?.take);

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

export const listInsuranceOrganizationQuery = extendType({
  type: "Query",
  definition(t) {
    t.list.field("listInsuranceOrganization", {
      type: Organization,
      args: { description: nonNull(OrgDesc) },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.organization.findMany({
          where: {
            description: args.description,
          },
        });
      },
    });
  },
});

export const exportOrganizationQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportOrganization", {
      type: Organization,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.organization.findMany({
          where: {
            updatedAt: {
              lte: new Date(args.dateTo),
              gte: new Date(args.dateFrom),
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
            email: ctx?.session?.user?.email,
          },
          include: {
            memberships: true,
          },
        });
        if (!user || user.memberships.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform this action`);
        }

        const newValue = {
          orgName: args.input.orgName,
          region: args.input.region ?? null,
          city: args.input.city ?? null,
          mobileNumber: args.input.mobileNumber,
          description: args.input.description,
        };

        return await ctx.prisma.organization.create({
          data: {
            orgName: args.input.orgName,
            orgCode: args.input.orgCode,
            region: args.input.region ?? null,
            city: args.input.city ?? null,
            mobileNumber: args.input.mobileNumber,
            description: args.input.description,
            thirdPartyLogs: {
              create: {
                userEmail: user.email,
                action: "Create",
                mode: "Organization",
                newValue: newValue,
                branchCon: {
                  connect: {
                    id: user?.memberships.branchId,
                  },
                },
              },
            },
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
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx?.session?.user?.email,
          },
          include: {
            memberships: true,
          },
        });
        if (!user || user?.memberships?.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }
        const oldOrg = await ctx.prisma.organization.findFirst({
          where: {
            id: args.id,
          },
        });
        const oldValue = {
          orgName: oldOrg.orgName,
          region: oldOrg.region ?? null,
          city: oldOrg.city ?? null,
          mobileNumber: oldOrg.mobileNumber,
        };
        const newValue = {
          orgName: args.input.orgName,
          region: args.input.region ?? null,
          city: args.input.city ?? null,
          mobileNumber: args.input.mobileNumber,
        };
        return ctx.prisma.organization.update({
          where: { id: args.id },
          data: {
            ...args.input,
            thirdPartyLogs: {
              create: {
                userEmail: user.email,
                action: "Update",
                mode: "Organization",
                oldValue: oldValue,
                newValue: newValue,
                branchCon: {
                  connect: {
                    id: user?.memberships.branchId,
                  },
                },
              },
            },
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
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx?.session?.user?.email,
          },
          include: {
            memberships: true,
          },
        });
        if (!user || user?.memberships?.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }
        const oldOrg = await ctx.prisma.organization.findFirst({
          where: {
            id: args.orgId,
          },
        });
        const oldValue = {
          orgName: oldOrg.orgName,
          region: oldOrg.region ?? null,
          city: oldOrg.city ?? null,
          mobileNumber: oldOrg.mobileNumber,
        };
        return await ctx.prisma.$transaction(async (tx) => {
          const orgData = tx.organization.delete({
            where: {
              id: args.orgId,
            },
          });
          const logger = await tx.thirdPartyLog.create({
            data: {
              userEmail: user.email,
              action: "Delete",
              mode: "Organization",
              oldValue: oldValue,
              branchCon: {
                connect: {
                  id: user?.memberships.branchId,
                },
              },
            },
          });
          return logger;
        });
      },
    });
  },
});

export const organizationCreateInput = inputObjectType({
  name: "organizationCreateInput",
  definition(t) {
    t.string("orgName");
    t.string("orgCode");
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
