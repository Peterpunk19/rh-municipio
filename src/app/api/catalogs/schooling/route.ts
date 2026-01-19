import { CatalogsService } from "@/app/api/services/catalogs.service";
import { SchoolingFilterSchema, SchoolingPostSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { handleCatalogCreate } from "@/app/api/catalogs/helpers/handleCatalogCreate";
import { NextRequest } from "next/server";
import { HttpMessages } from "@/common/response/messages";
import { SchoolingService } from "@/app/api/services/schooling.service";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: SchoolingFilterSchema,
    serviceMethod: CatalogsService.getSchooling,
  });
}

export async function POST(request: NextRequest) {
  return handleCatalogCreate({
    request,
    createSchema: SchoolingPostSchema,
    serviceMethod: SchoolingService.createSchooling,
    message: HttpMessages.schooling,
  });
}
