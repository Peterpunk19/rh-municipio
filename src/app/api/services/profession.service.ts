import { prisma } from "@/lib/prisma";
import { HttpMessages } from "@/common/response/messages";
import { ICatalogCreate } from "@/interfaces/Catalogs";

export const ProfessionService = {
  async getProfessionById(id: number) {
    const profession = await prisma.profession.findFirst({
      where: {
        id,
      },
    });

    return profession ? profession.id : null;
  },
  async getProfessionByName(name: string) {
    return prisma.profession.findFirst({
      where: { name },
    });
  },
  async createProfession(data: ICatalogCreate) {
    const existingProfession = await ProfessionService.getProfessionByName(data.name);
    if (existingProfession) {
      throw new Error(HttpMessages.profession.alreadyExists);
    }
    return prisma.profession.create({
      data: {
        name: data.name,
        display_name: data.display_name,
        active: data.active,
      },
    });
  },
};
