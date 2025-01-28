import { prisma } from "@/lib/prisma";

export const CatalogsService = {
  async getGender() {
    return prisma.gender.findMany();
  },
};
