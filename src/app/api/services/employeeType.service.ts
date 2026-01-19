import { HttpMessages } from "@/common/response/messages";
import { ICatalogCreate } from "@/interfaces/Catalogs";
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
  async createEmployeeType(data: ICatalogCreate) {
    const existingEmployeeType = await EmployeeTypeService.getEmployeeTypeByName(data.name);
    if (existingEmployeeType) {
      throw new Error(HttpMessages.employeeType.alreadyExists);
    }
    return prisma.employeeType.create({
      data: {
        name: data.name,
        display_name: data.display_name,
        active: data.active,
      },
    });
  },
};
