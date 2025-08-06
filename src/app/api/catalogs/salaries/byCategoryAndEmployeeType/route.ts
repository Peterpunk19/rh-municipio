import { getParamsFromUrl } from "@/common/utils";
import { authMiddleware } from "@/middleware/authMiddleware";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { handleHttpResponse } from "@/common/response/handler";
import { NextResponse } from "next/server";
import { ISalariesByCategoryAndEmployeeTypeFilters } from "../types";
import { SalariesByCategoryAndEmployeeTypeFilterSchema } from "@/schemas/salaries";
import { SalariesService } from "@/app/api/services/salaries.service";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  try {
    const requestParams = {
      categoryId: null,
      employeeTypeId: null,
    };

    const params = await getParamsFromUrl(request, requestParams);

    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const validationRequest = await validateRequestByUrlParams<ISalariesByCategoryAndEmployeeTypeFilters>(
      params,
      SalariesByCategoryAndEmployeeTypeFilterSchema,
    );

    if (validationRequest.response) return validationRequest.response;

    const validRequestData = validationRequest.data;

    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const salary = await SalariesService.getSalariesByCategoryAndEmployeeType(
      validRequestData.categoryId as number,
      validRequestData.employeeTypeId as number,
    );

    if (!salary) {
      const response = HttpResponse.success(HttpMessages.salaries.notFound, {
        salary: null,
      });

      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.salaries.getSuccess, salary);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
