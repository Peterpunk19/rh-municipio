import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword, getPaginationData } from "@/common/utils";
import { IUser, IUserFilters } from "@/app/api/users/interface";

export const UserService = {
  async getUserByUsername(username: string) {
    return prisma.user.findFirst({
      where: {
        username,
      },
    });
  },

  async getUserByUuid(uuid: string) {
    return prisma.user.findFirst({
      where: {
        uuid,
      },
    });
  },

  async getUserByEmployeeId(employee_id: number) {
    return prisma.user.findFirst({
      where: {
        employee_id,
      },
    });
  },

  async getUserById(id: number) {
    const data = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        role_id: true,
        role: {
          select: {
            display_name: true,
          },
        },
        active: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (data) {
      return {
        id: data.id,
        username: data.username,
        role_id: data.role_id,
        role_display_name: data.role.display_name,
        active: data.active,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    }

    return null;
  },

  async createUser(user: IUser) {
    return await prisma.user.create({
      data: {
        uuid: user.uuid ?? uuidv4(),
        username: user.username,
        password: await encryptPassword(user.password),
        active: true,
        employee_id: user.employee_id ?? null,
        role: {
          connect: { id: user.role_id },
        },
      },
      select: {
        id: true,
        uuid: true,
        username: true,
        role_id: true,
        active: true,
        created_at: true,
      },
    });
  },

  async getUsersByParams(userFilters: IUserFilters) {
    const limit = userFilters.limit;
    const page = userFilters.page;
    const offset = (page - 1) * limit;

    const whereClause: any = {
      active: userFilters.active,
    };

    if (userFilters.role_id) {
      whereClause.role_id = userFilters.role_id;
    }

    const data = await prisma.user.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      select: {
        id: true,
        username: true,
        role_id: true,
        role: {
          select: {
            display_name: true,
          },
        },
        active: true,
        created_at: true,
        updated_at: true,
      },
    });

    const total = await prisma.user.count({ where: whereClause });
    const pagination = await getPaginationData(total, limit, page);

    const users = data.map((user) => ({
      id: user.id,
      username: user.username,
      role_id: user.role_id,
      role_display_name: user.role.display_name,
      active: user.active,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    return {
      ...pagination,
      users,
    };
  },

  async deactivateUser(id: number) {
    return await prisma.user.update({
      where: { id: id },
      data: {
        active: false,
        updated_at: new Date(),
      },
      select: {
        id: true,
        uuid: true,
        username: true,
        active: true,
        updated_at: true,
      },
    });
  },
};
