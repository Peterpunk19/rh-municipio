import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword } from "@/common/utils";
import { IUser } from "@/app/api/user/interface";

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

  async createUser(user: IUser) {
    const create = await prisma.user.create({
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
    return create;
  },
};
