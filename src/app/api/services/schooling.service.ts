import { prisma } from "@/lib/prisma";
import { HttpMessages } from "@/common/response/messages";
import { ISchoolingCreate } from "@/interfaces/Catalogs";

export const SchoolingService = {
  async getSchoolingByDisplayName(display_name: string) {
    const schooling = await prisma.schooling.findFirst({
      where: {
        display_name: display_name,
      },
    });

    return schooling ? schooling.id : null;
  },

  async getSchoolingByCveCode(cve_code: string) {
    const schooling = await prisma.schooling.findFirst({
      where: {
        cve_code: cve_code,
      },
    });

    return schooling ? schooling.id : null;
  },

  async createSchooling(data: ISchoolingCreate) {
    const existingSchooling = await SchoolingService.getSchoolingByDisplayName(data.name);
    const existingSchoolingByCveCode = await SchoolingService.getSchoolingByCveCode(data.cve_code);
    console.log("existingSchooling", existingSchooling);
    console.log("existingSchoolingByCveCode", existingSchoolingByCveCode);
    if (existingSchooling) {
      throw new Error(HttpMessages.schooling.alreadyExists);
    }
    if (existingSchoolingByCveCode) {
      throw new Error(HttpMessages.schooling.cveCodeExists);
    }
    return prisma.schooling.create({
      data: {
        name: data.name,
        display_name: data.display_name,
        active: data.active,
        cve_code: data.cve_code,
      },
    });
  },
};
