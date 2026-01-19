import { ICreateOccupation } from "@/interfaces/Catalogs";
import { prisma } from "@/lib/prisma";
import { HttpMessages } from "@/common/response/messages";

export const OccupationService = {
  async getOccupationById(id: number) {
    const occupation = await prisma.occupation.findFirst({
      where: {
        id,
      },
    });

    return occupation ? occupation.id : null;
  },

  async getOccupationByDisplayName(display_name: string) {
    const occupation = await prisma.occupation.findFirst({
      where: {
        display_name: display_name,
      },
    });

    return occupation ? occupation.id : null;
  },

  async getOccupationByCveCode(cve_code: string) {
    const occupation = await prisma.occupation.findFirst({
      where: {
        cve_code: cve_code,
      },
    });

    return occupation ? occupation.id : null;
  },

  async createOccupation(data: ICreateOccupation) {
    const occupation = await OccupationService.getOccupationByDisplayName(data.display_name);
    const occupationByCveCode = await OccupationService.getOccupationByCveCode(data.cve_code);
    if (occupation) {
      throw new Error(HttpMessages.occupation.alreadyExists);
    }
    if (occupationByCveCode) {
      throw new Error(HttpMessages.occupation.cveCodeExists);
    }
    return prisma.occupation.create({
      data: {
        name: data.name,
        display_name: data.display_name,
        cve_code: data.cve_code,
        active: data.active ?? true,
      },
    });
  },
};
