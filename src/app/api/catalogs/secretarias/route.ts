import { CatalogsService } from "@/app/api/services/catalogs.service";
import { SecretariaFilterSchema, SecretariaPostSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { handleCatalogCreate } from "@/app/api/catalogs/helpers/handleCatalogCreate";
import { NextRequest } from "next/server";
import { SecretariaService } from "@/app/api/services/secretarias.service";
import { HttpMessages } from "@/common/response/messages";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: SecretariaFilterSchema,
    serviceMethod: CatalogsService.getSecretarias,
  });
}

export async function POST(request: NextRequest) {
  return handleCatalogCreate({
    request,
    createSchema: SecretariaPostSchema,
    serviceMethod: SecretariaService.createSecretaria,
    message: HttpMessages.secretaria,
  });
}
