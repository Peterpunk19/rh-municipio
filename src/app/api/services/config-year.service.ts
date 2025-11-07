import { prisma } from "@/lib/prisma";

export const ConfigYearService = {
  async getConfigYears() {
    return prisma.configYear.findMany({
      orderBy: { year: "desc" },
    });
  },

  async getActiveConfigYear() {
    return prisma.configYear.findFirst({
      where: { active: true },
    });
  },

  async createConfigYear(year: number, displayName?: string) {
    return prisma.configYear.create({
      data: {
        year,
        display_name: displayName || String(year),
        active: false,
      },
    });
  },

  async updateConfigYear(id: number, data: { active?: boolean; display_name?: string }) {
    if (data.active) {
      await prisma.configYear.updateMany({
        where: { id: { not: id } },
        data: { active: false },
      });
    }

    return prisma.configYear.update({
      where: { id },
      data: {
        active: data.active,
        display_name: data.display_name,
      },
    });
  },

  async deleteConfigYear(id: number) {
    const relatedRecords = await prisma.categoryEmployeeType.count({
      where: { config_year_id: id },
    });

    if (relatedRecords > 0) {
      throw new Error("No se puede eliminar el año de configuración porque tiene registros asociados");
    }

    return prisma.configYear.delete({
      where: { id },
    });
  },
};
