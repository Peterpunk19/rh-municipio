import { prisma } from "@/lib/prisma";

export const RequestsStatusService = {
  async getRequestStatusById(requestStatusId: number) {
    return await prisma.requestStatus.findUnique({
      where: {
        id: requestStatusId,
      },
    });
  },

  async getRequestsStatus() {
    return prisma.requestStatus.findMany({
      where: {
        active: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  },
};
