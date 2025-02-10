import { prisma } from "@/lib/prisma";

export const RoleService = {
  async getRoleById(id: number) {
    return prisma.role.findFirst({
      where: {
        id,
      },
    });
  },
};
