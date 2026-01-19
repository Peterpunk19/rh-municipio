import { EmployeeTypeService } from "@/app/api/services/employeeType.service";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { EmployeeTypeFilterSchema, EmployeeTypePostSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { handleCatalogCreate } from "@/app/api/catalogs/helpers/handleCatalogCreate";
import { NextRequest } from "next/server";
import { HttpMessages } from "@/common/response/messages";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: EmployeeTypeFilterSchema,
    serviceMethod: CatalogsService.getEmployeeTypes,
  });
}

export async function POST(request: NextRequest) {
  return handleCatalogCreate({
    request,
    createSchema: EmployeeTypePostSchema,
    serviceMethod: EmployeeTypeService.createEmployeeType,
    message: HttpMessages.employeeType,
  });
}
