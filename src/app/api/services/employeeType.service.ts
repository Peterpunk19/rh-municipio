import { prisma } from "@/lib/prisma";

export const EmployeeTypeService = {
  async getEmployeeTypeByName(name: string) {
    return prisma.employeeType.findFirst({
      where: { name },
    });
  },
};
