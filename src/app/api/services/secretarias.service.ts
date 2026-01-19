import { prisma } from "@/lib/prisma";
import { HttpMessages } from "@/common/response/messages";
import { ICatalogCreate } from "@/interfaces/Catalogs";

export const SecretariaService = {
  async getSecretariaByName(name: string) {
    return prisma.secretaria.findFirst({
      where: { name },
    });
  },
  async createSecretaria(data: ICatalogCreate) {
    const existingSecretaria = await SecretariaService.getSecretariaByName(data.name);
    if (existingSecretaria) {
      throw new Error(HttpMessages.secretaria.alreadyExists);
    }
    return prisma.secretaria.create({
      data: {
        name: data.name,
        display_name: data.display_name,
        active: data.active,
      },
    });
  },
};
