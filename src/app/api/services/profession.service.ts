import { prisma } from "@/lib/prisma";

export const ProfessionService = {
  async getProfessionById(id: number) {
    const profession = await prisma.profession.findFirst({
      where: {
        id,
      },
    });

    return profession ? profession.id : null;
  },
};
