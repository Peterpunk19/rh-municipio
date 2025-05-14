import { prisma } from "@/lib/prisma";

export const RoleService = {
  async getRoleById(id: number) {
    return prisma.role.findFirst({
      where: {
        id,
      },
    });
  },

  async getRoleByName(name: string) {
    return prisma.role.findFirst({
      where: {
        name,
      },
    });
  },
};
