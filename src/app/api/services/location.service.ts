import { prisma } from "@/lib/prisma";

export const LocationService = {
  async getLocationById(id: number) {
    return prisma.location.findFirst({
      where: {
        id,
      },
    });
  },
};
