import { prisma } from "@/lib/prisma";

export const CategoryService = {
  async getCategoryByDisplayNameToImport(displayName: string) {
    const category = await prisma.category.upsert({
      where: { display_name: displayName },
      update: {},
      create: {
        display_name: displayName,
        name: displayName.toLowerCase().replace(/\s+/g, "_"),
      },
    });

    return category.id;
  },
};
