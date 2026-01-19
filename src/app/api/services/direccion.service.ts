import { prisma } from "@/lib/prisma";
import { IDireccionCreate } from "@/interfaces/Catalogs";
import { HttpMessages } from "@/common/response/messages";

export const DireccionService = {
  async getDireccionById(id: number) {
    return prisma.direccion.findFirst({
      where: {
        id,
      },
    });
  },
  async getDireccionByName(name: string) {
    return prisma.direccion.findFirst({
      where: {
        name,
      },
    });
  },
  async getDireccionByDisplayNameToImport(displayName: string) {
    const direccion = await prisma.direccion.findFirst({
      where: { display_name: displayName },
    });

    return direccion ? direccion.id : null;
  },

  async createDireccion(data: IDireccionCreate) {
    const existingDireccion = await DireccionService.getDireccionByName(data.name);
    if (existingDireccion) {
      throw new Error(HttpMessages.direccion.alreadyExists);
    }
    return prisma.direccion.create({
      data: {
        name: data.name,
        display_name: data.display_name,
        secretaria_id: data.secretaria_id,
        active: data.active,
      },
    });
  },
};
