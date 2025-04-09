import { prisma } from "@/lib/prisma";

export const DayService = {
  async getDayById(id: number) {
    return prisma.day.findFirst({
      where: {
        id,
      },
    });
  },
};
