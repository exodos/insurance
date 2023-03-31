import { DateTimeResolver } from "graphql-scalars";
import { changePhone } from "./../../lib/config";
import { Prisma } from "@prisma/client";
import {
  arg,
  asNexusMethod,
  enumType,
  extendType,
  inputObjectType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { hashPassword, verifyPassword } from "../../lib/auth";
import { membershipConnectInput, membershipCreateInput } from "./Membership";
import { organizationConnectInput } from "./Organization";

export const GQLDate = asNexusMethod(DateTimeResolver, "date");

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("firstName");
    t.string("lastName");
    t.nullable.string("region");
    t.nullable.string("city");
    t.string("email");
    t.string("mobileNumber");
    t.string("password");
    t.boolean("adminRestPassword");
    t.date("createdAt");
    t.date("updatedAt");
    t.field("memberships", {
      type: "Membership",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: { id: _parent.id },
          })
          .memberships();
      },
    });
    t.list.field("insuredPoliceReports", {
      type: "InsuredPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: { id: _parent.id },
          })
          .insuredPoliceReports();
      },
    });
    t.list.field("unInsuredPoliceReports", {
      type: "UnInsuredPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: { id: _parent.id },
          })
          .unInsuredPoliceReports();
      },
    });
    t.list.field("hitAndRunPoliceReports", {
      type: "HitAndRunPoliceReport",
      async resolve(_parent, _args, ctx) {
        return await ctx.prisma.user
          .findUnique({
            where: { id: _parent.id },
          })
          .hitAndRunPoliceReports();
      },
    });
    t.field("organizations", {
      type: "Organization",
      resolve: async (_parent, _args, ctx) => {
        return await ctx.prisma.user
          .findUnique({
            where: { id: _parent.id },
          })
          .organizations();
      },
    });
  },
});

export const UserPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedUser", {
      type: FeedUser,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(UserOrderByInput)) }), // 1
      },
      resolve: async (parent, args, ctx) => {
        const where = args.filter
          ? {
              OR: [
                { firstName: args.filter },
                { lastName: args.filter },
                { email: args.filter },
                { mobileNumber: changePhone(args.filter) },
              ],
            }
          : {};

        const user = await ctx.prisma.user.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>
            | undefined,
        });

        const totalUser = await ctx.prisma.user.count({
          where,
        }); // 2
        const maxPage = Math.ceil(totalUser / args?.take);

        return {
          user,
          maxPage,
          totalUser,
        };
      },
    });
  },
});

export const UserBranchPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedUserBranch", {
      type: FeedUserBranch,
      args: {
        branchId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(UserOrderByInput)) }),
      },
      resolve: async (parent, args, ctx) => {
        const where = args.filter
          ? {
              memberships: {
                branchId: args.branchId,
              },
              OR: [
                { firstName: args.filter },
                { lastName: args.filter },
                { email: args.filter },
                { mobileNumber: changePhone(args.filter) },
              ],
            }
          : {
              memberships: {
                branchId: args.branchId,
              },
            };

        const user = await ctx.prisma.user.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>
            | undefined,
        });

        const totalUser = await ctx.prisma.user.count({
          where,
        }); // 2
        const maxPage = Math.ceil(totalUser / args?.take);

        return {
          user,
          maxPage,
          totalUser,
        };
      },
    });
  },
});

export const UserInsurerPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedUserInsurer", {
      type: FeedUserInsurer,
      args: {
        orgId: nonNull(stringArg()),
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(UserOrderByInput)) }),
      },
      resolve: async (parent, args, ctx) => {
        const where = args.filter
          ? {
              memberships: {
                branchs: {
                  orgId: args.orgId,
                },
              },
              OR: [
                { firstName: args.filter },
                { lastName: args.filter },
                { email: args.filter },
                { mobileNumber: changePhone(args.filter) },
              ],
            }
          : {
              memberships: {
                branchs: {
                  orgId: args.orgId,
                },
              },
            };

        const user = await ctx.prisma.user.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>
            | undefined,
        });

        const totalUser = await ctx.prisma.user.count({
          where,
        }); // 2
        const maxPage = Math.ceil(totalUser / args?.take);

        return {
          user,
          maxPage,
          totalUser,
        };
      },
    });
  },
});

export const exportUserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportUser", {
      type: User,
      args: {
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.user.findMany({
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

export const exportUserInsurerQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportUserInsurer", {
      type: User,
      args: {
        orgId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.user.findMany({
          where: {
            memberships: {
              branchs: {
                orgId: args.orgId,
              },
            },
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

export const exportUserBranchQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("exportUserBranch", {
      type: User,
      args: {
        branchId: nonNull(stringArg()),
        dateFrom: nonNull(stringArg()),
        dateTo: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        return await ctx.prisma.user.findMany({
          where: {
            memberships: {
              branchId: args.branchId,
            },
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

export const userByEmail = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("userByEmail", {
      type: User,
      args: { email: nonNull(stringArg()) },
      resolve: async (_parent, args, ctx) => {
        return ctx.prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });
      },
    });
  },
});

export const usersByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("usersByID", {
      type: User,
      args: { userId: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        const user = ctx.prisma.user.findUnique({
          where: {
            id: args.userId,
          },
        });
        return user;
      },
    });
  },
});

export const FeedUser = objectType({
  name: "FeedUser",
  definition(t) {
    t.nonNull.list.nonNull.field("user", { type: User });
    t.nonNull.int("totalUser");
    t.int("maxPage");
  },
});

export const FeedUserInsurer = objectType({
  name: "FeedUserInsurer",
  definition(t) {
    t.nonNull.list.nonNull.field("user", { type: User });
    t.nonNull.int("totalUser");
    t.int("maxPage");
  },
});
export const FeedUserBranch = objectType({
  name: "FeedUserBranch",
  definition(t) {
    t.nonNull.list.nonNull.field("user", { type: User });
    t.nonNull.int("totalUser");
    t.int("maxPage");
  },
});

// Mutation

export const createUserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
      type: User,
      args: {
        input: nonNull(userCreateInput),
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
        if (
          !user ||
          (user.memberships.role !== "SUPERADMIN" &&
            user.memberships.role !== "INSURER" &&
            user.memberships.role !== "BRANCHADMIN" &&
            user.memberships.role !== "TRAFFICPOLICEADMIN")
        ) {
          throw new Error(`You do not have permission to perform this action`);
        }

        const newValue = {
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          region: args.input.region ?? null,
          city: args.input.city ?? null,
          email: args.input.email,
          mobileNumber: changePhone(args.input.mobileNumber),
          // password: await hashPassword(args.input.password),
          role: args.input.memberships.role,
          branchId: args.input.memberships.branchs.id,
        };
        return await ctx.prisma.user.create({
          data: {
            firstName: args.input.firstName,
            lastName: args.input.lastName,
            region: args.input.region ?? null,
            city: args.input.city ?? null,
            email: args.input.email,
            mobileNumber: changePhone(args.input.mobileNumber),
            password: await hashPassword(args.input.password),
            organizations: {
              connect: {
                id: args.input.organizations.id,
              },
            },
            memberships: {
              create: {
                role: args.input.memberships.role,
                branchs: {
                  connect: {
                    id: args.input.memberships.branchs.id,
                  },
                },
              },
            },
            thirdPartyLogs: {
              create: {
                userEmail: user.email,
                action: "Create",
                mode: "User",
                newValue: newValue,
                branchCon: {
                  connect: {
                    id: args.input.memberships.branchs.id,
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

export const updateUserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateUser", {
      type: User,
      args: {
        userId: nonNull(stringArg()),
        input: nonNull(userUpdateInput),
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
        if (
          !user ||
          (user.memberships.role !== "SUPERADMIN" &&
            user.memberships.role !== "INSURER" &&
            user.memberships.role !== "TRAFFICPOLICEADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }

        const oldUser = await ctx.prisma.user.findFirst({
          where: { id: args.userId },
          include: {
            memberships: true,
          },
        });

        const oldValue = {
          firstName: oldUser?.firstName,
          lastName: oldUser?.lastName,
          region: oldUser?.region ?? null,
          city: oldUser?.city ?? null,
          email: oldUser?.email,
          mobileNumber: changePhone(oldUser?.mobileNumber),
          role: oldUser?.memberships.role,
          branchId: oldUser?.memberships?.branchId,
        };
        const newValue = {
          firstName: args.input.firstName,
          lastName: args.input.lastName,
          region: args.input.region ?? null,
          city: args.input.city ?? null,
          email: args.input.email,
          mobileNumber: changePhone(args.input.mobileNumber),
          role: args.input.memberships.role,
          branchId: oldUser.memberships.branchId,
        };
        return ctx.prisma.user.update({
          where: { id: args.userId },
          data: {
            ...args.input,
            memberships: {
              update: {
                role: args.input.memberships.role,
              },
            },
            thirdPartyLogs: {
              create: {
                userEmail: user.email,
                action: "Edit",
                mode: "User",
                oldValue: oldValue,
                newValue: newValue,
                branchCon: {
                  connect: {
                    id: oldUser?.memberships.branchId,
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

export const deleteUserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteUser", {
      type: User,
      args: {
        id: nonNull(stringArg()),
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
        if (
          !user ||
          (user.memberships.role !== "SUPERADMIN" &&
            user.memberships.role !== "INSURER" &&
            user.memberships.role !== "BRANCHADMIN" &&
            user.memberships.role !== "TRAFFICPOLICEADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }
        const oldUser = await ctx.prisma.user.findFirst({
          where: { id: args.id },
          include: {
            memberships: true,
          },
        });

        const oldValue = {
          firstName: oldUser?.firstName,
          lastName: oldUser?.lastName,
          region: oldUser?.region ?? null,
          city: oldUser?.city ?? null,
          email: oldUser?.email,
          mobileNumber: changePhone(oldUser?.mobileNumber),
          role: oldUser?.memberships.role,
          branchId: oldUser?.memberships?.branchId,
        };

        return await ctx.prisma.$transaction(async (tx) => {
          const userData = await tx.user.delete({
            where: {
              id: args.id,
            },
          });
          const logger = await tx.thirdPartyLog.create({
            data: {
              userEmail: user.email,
              action: "Delete",
              mode: "User",
              oldValue: oldValue,
              branchCon: {
                connect: {
                  id: oldUser?.memberships.branchId,
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

export const changeUserPasswordMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("changeUserPassword", {
      type: User,
      args: {
        id: nonNull(stringArg()),
        currentPassword: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
        const hashedPass = await hashPassword(args.password);

        const verify = verifyPassword(args.currentPassword, user.password);

        if (!verify) {
          throw new Error(`Current Password And New Password Must Much!!`);
        }

        return await ctx.prisma.user.update({
          where: {
            id: args.id,
          },
          data: {
            password: hashedPass,
            adminRestPassword: false,
          },
        });
      },
    });
  },
});

export const adminChangeUserPasswordMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("adminChangeUserPassword", {
      type: User,
      args: {
        id: nonNull(stringArg()),
        password: nonNull(stringArg()),
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
        if (
          !user ||
          (user.memberships.role !== "SUPERADMIN" &&
            user.memberships.role !== "INSURER" &&
            user.memberships.role !== "TRAFFICPOLICEADMIN")
        ) {
          throw new Error(`You do not have permission to perform action`);
        }

        return await ctx.prisma.user.update({
          where: {
            id: args.id,
          },
          data: {
            password: await hashPassword(args.password),
            adminRestPassword: true,
          },
        });
      },
    });
  },
});
export const userCreateInput = inputObjectType({
  name: "userCreateInput",
  definition(t) {
    t.string("firstName");
    t.string("lastName");
    t.string("region");
    t.string("city");
    t.string("email");
    t.string("mobileNumber");
    t.string("password");
    t.field("memberships", { type: membershipCreateInput });
    t.field("organizations", { type: organizationConnectInput });
  },
});

export const userUpdateInput = inputObjectType({
  name: "userUpdateInput",
  definition(t) {
    t.string("firstName");
    t.string("lastName");
    t.nullable.string("region");
    t.nullable.string("city");
    t.string("email");
    t.string("mobileNumber");
    t.field("memberships", { type: membershipConnectInput });

    // t.nonNull.field("thirdPartyLogs", { type: thirdPartyLogEditInput });
  },
});

export const userConnectInput = inputObjectType({
  name: "userConnectInput",
  definition(t) {
    t.nonNull.string("mobileNumber");
  },
});

export const userInput = inputObjectType({
  name: "userInput",
  definition(t) {
    t.nonNull.string("id");
  },
});

export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"],
});

export const UserOrderByInput = inputObjectType({
  name: "UserOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});
