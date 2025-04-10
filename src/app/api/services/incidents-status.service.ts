import { prisma } from "@/lib/prisma";

export const IncidentsStatusService = {
  async validateIncidentStatus(incidentStatusId: number) {
    return await prisma.incidentStatus.findUnique({
      where: {
        id: incidentStatusId,
      },
    });
  },
};
