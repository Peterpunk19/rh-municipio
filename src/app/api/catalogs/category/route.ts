import { CatalogsService } from "@/app/api/services/catalogs.service";
import { CategoryFilterSchema, CategoryPostSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { handleCatalogCreate } from "@/app/api/catalogs/helpers/handleCatalogCreate";
import { NextRequest } from "next/server";
import { HttpMessages } from "@/common/response/messages";
import { CategoryService } from "@/app/api/services/category.service";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: CategoryFilterSchema,
    serviceMethod: CatalogsService.getCategory,
  });
}

export async function POST(request: NextRequest) {
  return handleCatalogCreate({
    request,
    createSchema: CategoryPostSchema,
    serviceMethod: CategoryService.createCategory,
    message: HttpMessages.category,
  });
}
