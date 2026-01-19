import { CatalogsService } from "@/app/api/services/catalogs.service";
import { ProfessionFilterSchema, ProfessionPostSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { handleCatalogCreate } from "@/app/api/catalogs/helpers/handleCatalogCreate";
import { NextRequest } from "next/server";
import { ProfessionService } from "@/app/api/services/profession.service";
import { HttpMessages } from "@/common/response/messages";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: ProfessionFilterSchema,
    serviceMethod: CatalogsService.getProfession,
  });
}

export async function POST(request: NextRequest) {
  return handleCatalogCreate({
    request,
    createSchema: ProfessionPostSchema,
    serviceMethod: ProfessionService.createProfession,
    message: HttpMessages.profession,
  });
}
