import { CatalogsService } from "@/app/api/services/catalogs.service";
import { SecretariaFilterSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: SecretariaFilterSchema,
    serviceMethod: CatalogsService.getSecretarias,
  });
}
