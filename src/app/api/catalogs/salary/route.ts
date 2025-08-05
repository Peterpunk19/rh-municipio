import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = Number(searchParams.get("categoryId"));
    const employeeTypeId = Number(searchParams.get("employeeTypeId"));

    if (!categoryId || !employeeTypeId) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const salary = await CatalogsService.getSalaryByCategoryAndEmployeeType(categoryId, employeeTypeId);

    if (!salary) {
      const response = HttpResponse.failure(HttpMessages.error.notFound, {});
      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.catalog.success, salary);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
