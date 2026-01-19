import { prisma } from "@/lib/prisma";
import { HttpMessages } from "@/common/response/messages";
import { ICatalogCreate } from "@/interfaces/Catalogs";

export const TradeUnionService = {
  async getTradeUnionByName(name: string) {
    return prisma.tradeUnion.findFirst({
      where: { name },
    });
  },
  async createTradeUnion(data: ICatalogCreate) {
    const existingTradeUnion = await TradeUnionService.getTradeUnionByName(data.name);
    if (existingTradeUnion) {
      throw new Error(HttpMessages.tradeUnion.alreadyExists);
    }
    return prisma.tradeUnion.create({
      data: {
        name: data.name,
        display_name: data.display_name,
        active: data.active,
      },
    });
  },
};
