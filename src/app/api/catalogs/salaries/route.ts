import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { SalariesService } from "@/app/api/services/salaries.service";
import { logger } from "@/lib/logger";
import { getParamsFromUrl } from "@/common/utils";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { SalariesGetFilterSchema } from "@/schemas/salaries";
import { ISalariesFilters } from "./types";

export async function GET(request: Request) {
  try {
    const params = {
      page: 1,
      limit: 10,
      search: null,
      categoryId: null,
      employeeTypeId: null,
    };

    const requestParams = await getParamsFromUrl(request, params);

    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const validationRequest = await validateRequestByUrlParams<ISalariesFilters>(
      requestParams,
      SalariesGetFilterSchema,
    );

    if (validationRequest.response) return validationRequest.response;

    const validRequestData = validationRequest.data;

    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const salaries = await SalariesService.getSalariesByParams(validRequestData);

    if (salaries && salaries.total === 0) {
      const response = HttpResponse.success(HttpMessages.salaries.notFound, {
        salaries: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });

      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.salaries.getSuccess, salaries);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
