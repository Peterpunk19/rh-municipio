import { CatalogsService } from "@/app/api/services/catalogs.service";
import { DireccionFilterSchema, DireccionPostSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { handleCatalogCreate } from "@/app/api/catalogs/helpers/handleCatalogCreate";
import { DireccionService } from "@/app/api/services/direccion.service";
import { HttpMessages } from "@/common/response/messages";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: DireccionFilterSchema,
    serviceMethod: CatalogsService.getDirecciones,
    additionalParams: { secretaria_id: null },
  });
}

export async function POST(request: NextRequest) {
  return handleCatalogCreate({
    request,
    createSchema: DireccionPostSchema,
    serviceMethod: DireccionService.createDireccion,
    message: HttpMessages.direccion,
  });
}
