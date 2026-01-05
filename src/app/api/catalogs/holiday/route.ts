import { CatalogsService } from "@/app/api/services/catalogs.service";
import { HolidayFilterSchema, HolidayPostSchema } from "@/schemas/catalogs";
import { handleCatalogRequest } from "@/app/api/catalogs/helpers/handleCatalogRequest";
import { handleCatalogCreate } from "@/app/api/catalogs/helpers/handleCatalogCreate";
import { NextRequest } from "next/server";
import { HttpMessages } from "@/common/response/messages";
import { HolidayService } from "@/app/api/services/holiday.service";

export async function GET(request: Request) {
  return handleCatalogRequest({
    request,
    filterSchema: HolidayFilterSchema,
    serviceMethod: CatalogsService.getHolydays,
    additionalParams: { year: null },
  });
}

export async function POST(request: NextRequest) {
  return handleCatalogCreate({
    request,
    createSchema: HolidayPostSchema,
    serviceMethod: HolidayService.createHoliday,
    message: HttpMessages.holiday,
  });
}
