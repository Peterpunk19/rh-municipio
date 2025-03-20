import { prisma } from "@/lib/prisma";

export const RequestService = {
  async getRequestById(id: number) {
    return prisma.request.findFirst({
      where: {
        id,
      },
    });
  },
};
