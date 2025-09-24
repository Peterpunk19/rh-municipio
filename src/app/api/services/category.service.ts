import { prisma } from "@/lib/prisma";

export const CategoryService = {
  normalizeCategoryName(displayName: string): string {
    return displayName
      .trim()
      .replace(/['"]/g, "") // elimina comillas simples y dobles
      .normalize("NFD") // separa acentos
      .replace(/[\u0300-\u036f]/g, "") // elimina acentos
      .toLowerCase()
      .replace(/\s+/g, "_"); // reemplaza espacios por guión bajo
  },

  async getCategoryByDisplayName(displayName: string) {
    const normalizedName = this.normalizeCategoryName(displayName);

    const category = await prisma.category.findUnique({
      where: { name: normalizedName },
    });

    return category ? category.id : null;
  },
};
