import { prisma } from "@/lib/prisma";

export const OccupationService = {
  async getOccupationById(id: number) {
    const occupation = await prisma.occupation.findFirst({
      where: {
        id,
      },
    });

    return occupation ? occupation.id : null;
  },
};
