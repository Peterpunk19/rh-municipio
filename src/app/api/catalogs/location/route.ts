import { CatalogsService } from "@/app/api/services/catalogs.service";
import { LocationService } from "@/app/api/services/location.service";
import { LocationFilterSchema, LocationPostSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { handleCatalogCreate } from "@/app/api/catalogs/helpers/handleCatalogCreate";
import { NextRequest } from "next/server";
import { HttpMessages } from "@/common/response/messages";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: LocationFilterSchema,
    serviceMethod: CatalogsService.getLocations,
  });
}

export async function POST(request: NextRequest) {
  return handleCatalogCreate({
    request,
    createSchema: LocationPostSchema,
    serviceMethod: LocationService.createLocation,
    message: HttpMessages.location,
  });
}
