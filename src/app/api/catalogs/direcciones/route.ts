import { CatalogsService } from "@/app/api/services/catalogs.service";
import { DireccionFilterSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: DireccionFilterSchema,
    serviceMethod: CatalogsService.getDirecciones,
    additionalParams: { secretaria_id: null },
  });
}
