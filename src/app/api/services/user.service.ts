import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { buildWhereClause, encryptPassword, getPaginationData } from "@/common/utils";
import type { IUser, IUserFilters } from "@/app/api/users/interface";

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
        employee_id: true,
        employee: {
          select: {
            name: true,
            paternal_last_name: true,
            maternal_last_name: true,
            gender_id: true,
            number_employee: true,
          },
        },
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
        employee_id: data.employee_id,
        name: data.employee?.name,
        paternal_last_name: data.employee?.paternal_last_name,
        maternal_last_name: data.employee?.maternal_last_name,
        gender_id: data.employee?.gender_id,
        role_id: data.role_id,
        role_display_name: data.role.display_name,
        number_employee: data.employee?.number_employee,
        active: data.active,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    }

    return null;
  },

  async getUserInfoAuthById(id: number) {
    const data = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        employee: {
          select: {
            id: true,
            name: true,
            paternal_last_name: true,
            maternal_last_name: true,
            gender_id: true,
            number_employee: true,
          },
        },
        role_id: true,
        role: {
          select: {
            name: true,
            display_name: true,
          },
        },
      },
    });

    if (data) {
      return {
        id: data.id,
        username: data.username,
        employee_id: data.employee?.id,
        name: data.employee?.name,
        paternal_last_name: data.employee?.paternal_last_name,
        maternal_last_name: data.employee?.maternal_last_name,
        role_id: data.role_id,
        role_name: data.role.name,
        role_display_name: data.role.display_name,
        number_employee: data.employee?.number_employee,
      };
    }

    return null;
  },

  async createUser(user: IUser) {
    return prisma.$transaction(async (tx) => {
      if (user.direcciones_ids && user.direcciones_ids.length > 0) {
        const existingUserDirecciones = await this.findActiveUserDireccionesByRoleAndDirecciones(
          user.role_id,
          user.direcciones_ids,
        );

        for (const userDireccion of existingUserDirecciones) {
          await tx.userDireccion.update({
            where: { id: userDireccion.id },
            data: {
              active: false,
              updated_at: new Date(),
            },
          });
        }
      }

      const userData: any = {
        uuid: user.uuid ?? uuidv4(),
        username: user.username,
        password: await encryptPassword(user.password),
        active: true,
        employee_id: user.employee_id ?? null,
        role: {
          connect: { id: user.role_id },
        },
      };

      if (user.created_by_id) {
        userData.created_by = {
          connect: { id: user.created_by_id },
        };
      }

      const createUser = await tx.user.create({
        data: userData,
        select: {
          id: true,
          uuid: true,
          username: true,
          role_id: true,
          active: true,
          created_at: true,
        },
      });

      if (user.direcciones_ids && user.direcciones_ids.length > 0) {
        await tx.userDireccion.createMany({
          data: user.direcciones_ids.map((direccion_id) => ({
            user_id: createUser.id,
            direccion_id,
            created_by_id: user.created_by_id ?? 1,
          })),
        });
      }

      return createUser;
    });
  },

  async getUsersByParams(userFilters: IUserFilters) {
    const limit = userFilters.limit;
    const page = userFilters.page;
    const offset = (page - 1) * limit;
    const filterMappings = {
      active: "active",
      role_id: "role_id",
    };

    const searchMappings = [
      { path: ["username"], operators: ["contains"] },
      { path: ["employee", "name"], operators: ["is", "contains"] },
      { path: ["employee", "paternal_last_name"], operators: ["is", "contains"] },
      { path: ["employee", "maternal_last_name"], operators: ["is", "contains"] },
    ];
    const whereClause = await buildWhereClause(filterMappings, userFilters, searchMappings);

    const data = await prisma.user.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      select: {
        id: true,
        username: true,
        employee_id: true,
        employee: {
          select: {
            name: true,
            paternal_last_name: true,
            maternal_last_name: true,
          },
        },
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
      name: user.employee?.name,
      paternal_last_name: user.employee?.paternal_last_name,
      maternal_last_name: user.employee?.maternal_last_name,
      role_id: user.role_id,
      role_display_name: user.role.display_name,
      active: user.active,
      active_display_name: user.active ? "Activo" : "Inactivo",
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    return {
      ...pagination,
      users,
    };
  },

  async changeStatusUser(id: number, active?: boolean) {
    return await prisma.user.update({
      where: { id: id },
      data: {
        active: active,
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

  async findActiveUserDireccionesByRoleAndDirecciones(role_id: number, direcciones_ids: number[]) {
    const userDirecciones = await prisma.userDireccion.findMany({
      where: {
        active: true,
        direccion_id: {
          in: direcciones_ids,
        },
        user: {
          role_id: role_id,
          active: true,
        },
      },
      select: {
        id: true,
        user_id: true,
        direccion_id: true,
      },
    });

    return userDirecciones;
  },
};
