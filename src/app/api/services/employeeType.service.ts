import { prisma } from "@/lib/prisma";

export const EmployeeTypeService = {
  async getEmployeeTypeByName(name: string) {
    return prisma.employeeType.findFirst({
      where: { name },
    });
  },
  async getEmployeeTypeByDisplayName(display_name: string) {
    const employeeType = await prisma.employeeType.findFirst({
      where: { display_name: display_name },
    });

    return employeeType ? employeeType.id : null;
  },
};
