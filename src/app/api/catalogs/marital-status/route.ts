import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { MaritalStatusFilterSchema } from "@/schemas/catalogs";
import { CatalogsService } from "@/app/api/services/catalogs.service";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: MaritalStatusFilterSchema,
    serviceMethod: CatalogsService.getMaritalStatus,
    additionalParams: { year: null },
  });
}
