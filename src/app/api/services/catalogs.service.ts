import { prisma } from "@/lib/prisma";

export const CatalogsService = {
  async getGender() {
    return prisma.gender.findMany();
  },
  async getCategory() {
    return prisma.category.findMany();
  },
  async getSecretarias() {
    return prisma.secretaria.findMany();
  },
  async getDirecciones(secretariaId: number) {
    return prisma.direccion.findMany({
      where: { secretaria_id: secretariaId },
    });
  },
  async getDepartamentos(direccionId: number) {
    return prisma.departamento.findMany({
      where: { direccion_id: direccionId },
    });
  },
  async getEmployeeTypes() {
    return prisma.employeeType.findMany();
  },
  async getPayrolls() {
    return prisma.payroll.findMany();
  },
  async getLocations() {
    return prisma.location.findMany();
  },
};
