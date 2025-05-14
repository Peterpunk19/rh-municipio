import { prisma } from "@/lib/prisma";

export const DireccionService = {
  async getDireccionById(id: number) {
    return prisma.direccion.findFirst({
      where: {
        id,
      },
    });
  },
};
