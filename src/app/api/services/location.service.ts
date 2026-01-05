import { prisma } from "@/lib/prisma";
import { ICatalogCreate } from "@/interfaces/Catalogs";
import { HttpMessages } from "@/common/response/messages";

export const LocationService = {
  async getLocationById(id: number) {
    return prisma.location.findFirst({
      where: {
        id,
      },
    });
  },

  async getLocationByDisplayNameToImport(display_name: string) {
    const location = await prisma.location.upsert({
      where: { display_name },
      update: {},
      create: {
        display_name,
        name: display_name.toLowerCase().replace(/\s+/g, "_"),
      },
    });

    return location.id;
  },

  async getLocationByName(name: string) {
    return prisma.location.findFirst({
      where: { name },
    });
  },

  async createLocation(data: ICatalogCreate) {
    const existingLocation = await LocationService.getLocationByName(data.name);
    if (existingLocation) {
      throw new Error(HttpMessages.location.alreadyExists);
    }
    return prisma.location.create({
      data: {
        name: data.name,
        display_name: data.display_name,
        active: data.active ?? true,
      },
    });
  },
};
