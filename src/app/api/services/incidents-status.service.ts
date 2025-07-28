import { prisma } from "@/lib/prisma";

export const IncidentsStatusService = {
  async validateIncidentStatus(incidentStatusId: number) {
    return await prisma.incidentStatus.findUnique({
      where: {
        id: incidentStatusId,
      },
    });
  },

  async getIncidentsStatus() {
    return prisma.incidentStatus.findMany({
      where: {
        active: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  },
};
