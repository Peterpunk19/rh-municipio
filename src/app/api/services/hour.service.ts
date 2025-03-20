import { prisma } from "@/lib/prisma";

export const HourService = {
  async getHourById(id: number) {
    return prisma.hour.findFirst({
      where: {
        id,
      },
    });
  },
};
