import { prisma } from "@/lib/prisma";

export const RoleModuleService = {
  async gerRoleModulesByIdRole(roleId: number) {
    return await prisma.roleModule.findMany({
      where: {
        role_id: roleId,
        can_view: true,
        module: { active: true },
      },
      include: { module: true },
    });
  },
};
