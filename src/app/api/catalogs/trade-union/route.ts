import { CatalogsService } from "@/app/api/services/catalogs.service";
import { TradeUnionFilterSchema, TradeUnionPostSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { handleCatalogCreate } from "@/app/api/catalogs/helpers/handleCatalogCreate";
import { NextRequest } from "next/server";
import { TradeUnionService } from "@/app/api/services/trade-union.service";
import { HttpMessages } from "@/common/response/messages";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: TradeUnionFilterSchema,
    serviceMethod: CatalogsService.getTradeUnion,
  });
}

export async function POST(request: NextRequest) {
  return handleCatalogCreate({
    request,
    createSchema: TradeUnionPostSchema,
    serviceMethod: TradeUnionService.createTradeUnion,
    message: HttpMessages.tradeUnion,
  });
}
