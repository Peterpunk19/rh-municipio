import { HttpMessages } from "@/common/response/messages";
import { ICatalogCreate } from "@/interfaces/Catalogs";
import { prisma } from "@/lib/prisma";

export const MaritalStatusService = {
  async getMaritalStatusByName(name: string) {
    return prisma.maritalStatus.findFirst({
      where: { name },
    });
  },
  async createMaritalStatus(data: ICatalogCreate) {
    const existingMaritalStatus = await MaritalStatusService.getMaritalStatusByName(data.name);
    if (existingMaritalStatus) {
      throw new Error(HttpMessages.maritalStatus.alreadyExists);
    }
    return prisma.maritalStatus.create({
      data: {
        name: data.name,
        display_name: data.display_name,
        active: data.active,
      },
    });
  },
};
