import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { MaritalStatusFilterSchema, MaritalStatusPostSchema } from "@/schemas/catalogs";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { handleCatalogCreate } from "@/app/api/catalogs/helpers/handleCatalogCreate";
import { HttpMessages } from "@/common/response/messages";
import { MaritalStatusService } from "@/app/api/services/marital-status.service";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: MaritalStatusFilterSchema,
    serviceMethod: CatalogsService.getMaritalStatus,
  });
}

export async function POST(request: NextRequest) {
  return handleCatalogCreate({
    request,
    createSchema: MaritalStatusPostSchema,
    serviceMethod: MaritalStatusService.createMaritalStatus,
    message: HttpMessages.maritalStatus,
  });
}
