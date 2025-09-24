import { prisma } from "@/lib/prisma";

export const SchoolingService = {
  async getSchoolingByDisplayName(display_name: string) {
    const schooling = await prisma.schooling.findFirst({
      where: {
        display_name: display_name,
      },
    });

    return schooling ? schooling.id : null;
  },
};
