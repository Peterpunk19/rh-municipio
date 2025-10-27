import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { buildWhereClause, encryptPassword, getPaginationData } from "@/common/utils";
import type { IUser, IUserFilters } from "@/app/api/users/interface";
import { logger } from "@/lib/logger";
import { SYSTEM_LOG_ACTIONS } from "@/common/constants/SystemLogActions";

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

    if (!data) {
      return null;
    }

    let employee = null;
    if (data.employee_id) {
      employee = await prisma.employee.findUnique({
        where: { id: data.employee_id },
        select: {
          name: true,
          paternal_last_name: true,
          maternal_last_name: true,
          gender_id: true,
          number_employee: true,
        },
      });
    }

    return {
      id: data.id,
      username: data.username,
      employee_id: data.employee_id,
      name: employee?.name,
      paternal_last_name: employee?.paternal_last_name,
      maternal_last_name: employee?.maternal_last_name,
      gender_id: employee?.gender_id,
      role_id: data.role_id,
      role_display_name: data.role.display_name,
      number_employee: employee?.number_employee,
      active: data.active,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  },

  async getUserInfoAuthById(id: number) {
    const data = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        employee_id: true,
        role_id: true,
        role: {
          select: {
            name: true,
            display_name: true,
          },
        },
      },
    });

    if (!data) {
      return null;
    }

    let employee = null;
    if (data.employee_id) {
      employee = await prisma.employee.findUnique({
        where: { id: data.employee_id },
        select: {
          id: true,
          name: true,
          paternal_last_name: true,
          maternal_last_name: true,
          gender_id: true,
          number_employee: true,
        },
      });
    }

    return {
      id: data.id,
      username: data.username,
      employee_id: employee?.id,
      name: employee?.name,
      paternal_last_name: employee?.paternal_last_name,
      maternal_last_name: employee?.maternal_last_name,
      role_id: data.role_id,
      role_name: data.role.name,
      role_display_name: data.role.display_name,
      number_employee: employee?.number_employee,
    };
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
        must_change_password: user.must_change_password ?? false,
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

    const employeeIds = data.map((user) => user.employee_id).filter((id): id is number => id !== null);

    const employees = await prisma.employee.findMany({
      where: {
        id: { in: employeeIds },
      },
      select: {
        id: true,
        name: true,
        paternal_last_name: true,
        maternal_last_name: true,
      },
    });

    const employeeMap = new Map(employees.map((emp) => [emp.id, emp]));

    const total = await prisma.user.count({ where: whereClause });
    const pagination = await getPaginationData(total, limit, page);

    const users = data.map((user) => {
      const employee = user.employee_id ? employeeMap.get(user.employee_id) : null;
      return {
        id: user.id,
        username: user.username,
        name: employee?.name,
        paternal_last_name: employee?.paternal_last_name,
        maternal_last_name: employee?.maternal_last_name,
        role_id: user.role_id,
        role_display_name: user.role.display_name,
        active: user.active,
        active_display_name: user.active ? "Activo" : "Inactivo",
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    });

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

  async getActiveUserDirecciones(user_id: number) {
    return prisma.userDireccion.findMany({
      where: {
        user_id,
        active: true,
      },
      select: {
        direccion: {
          select: {
            id: true,
            name: true,
          },
        },
        created_at: true,
        updated_at: true,
      },
    });
  },

  async resetUserPassword(
    userId: number,
    adminUserId: number,
    temporaryPassword: string,
  ): Promise<{
    success: boolean;
    message?: string;
    temporaryPassword?: string;
  }> {
    try {
      const hashedPassword = await encryptPassword(temporaryPassword);

      await prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: {
            password: hashedPassword,
            must_change_password: true,
            updated_at: new Date(),
          },
        });

        await tx.systemLogs.create({
          data: {
            type: "change-password",
            performed_by_id: adminUserId,
            affected_user_id: userId,
            description: `Administrador reseteó la contraseña del usuario ID ${userId}`,
            metadata: {
              action: SYSTEM_LOG_ACTIONS.PASSWORD_RESET,
              timestamp: new Date().toISOString(),
            },
          },
        });
      });

      return {
        success: true,
        temporaryPassword,
      };
    } catch (error: any) {
      logger.error("Error resetting user password", {
        userId,
        adminUserId,
        error: error.message,
        stack: error.stack,
      });

      return {
        success: false,
        message: error.message,
      };
    }
  },
};
