import { prisma } from "@/lib/prisma";

export const MunicipalityService = {
  async getMunicipalityByCveCode(cve_code: string) {
    const municipality = await prisma.municipality.findFirst({
      where: {
        cve_code: cve_code,
      },
    });

    return municipality ? municipality.id : null;
  },
};
