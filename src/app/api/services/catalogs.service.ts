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

  async getEmployeeTypes() {
    return prisma.employeeType.findMany();
  },

  async getLocations() {
    return prisma.location.findMany();
  },

  async getDays() {
    return prisma.day.findMany();
  },

  async getHours() {
    return prisma.hour.findMany();
  },

  async getState() {
    return prisma.state.findMany();
  },

  async getMunicipalities(stateId: number) {
    return prisma.municipality.findMany({
      where: { state_id: stateId },
    });
  },
  async getEmployeeStatus() {
    return prisma.statusEmployee.findMany(
      {
        orderBy: { display_name: 'asc' }
      }
    );
  },
};
