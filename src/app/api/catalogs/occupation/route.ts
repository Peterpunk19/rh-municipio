import { CatalogsService } from "@/app/api/services/catalogs.service";
import { OccupationService } from "@/app/api/services/occupation.service";
import { OccupationFilterSchema, OccupationPostSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { handleCatalogCreate } from "@/app/api/catalogs/helpers/handleCatalogCreate";
import { HttpMessages } from "@/common/response/messages";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: OccupationFilterSchema,
    serviceMethod: CatalogsService.getOccupation,
  });
}

export async function POST(request: NextRequest) {
  return handleCatalogCreate({
    request,
    createSchema: OccupationPostSchema,
    serviceMethod: OccupationService.createOccupation,
    message: HttpMessages.occupation,
  });
}
