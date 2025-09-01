import { prisma } from "@/lib/prisma";

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
};
