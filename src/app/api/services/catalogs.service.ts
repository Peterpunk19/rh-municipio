import { prisma } from "@/lib/prisma";

export const CatalogsService = {
  async getGender() {
    return prisma.gender.findMany();
  },

  async getCategory() {
    return prisma.category.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getSecretarias() {
    return prisma.secretaria.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getDirecciones(secretariaId: number) {
    return prisma.direccion.findMany({
      where: { secretaria_id: secretariaId },
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getEmployeeTypes() {
    return prisma.employeeType.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getLocations() {
    return prisma.location.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getDays() {
    return prisma.day.findMany();
  },

  async getHours() {
    return prisma.hour.findMany();
  },

  async getState() {
    return prisma.state.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getMunicipalities(stateId: number) {
    return prisma.municipality.findMany({
      where: { state_id: stateId },
      orderBy: {
        display_name: "asc",
      },
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
