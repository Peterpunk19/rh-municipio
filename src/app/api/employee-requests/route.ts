import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { EmployeeRequestsGetFilterSchema } from "@/schemas/employee-requests";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { getParamsFromUrl } from "@/common/utils";
import { logger } from "@/lib/logger";
import type { IEmployeeRequestsFilters } from "./types";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function GET(request: Request) {
  try {
    const params = {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      request_id: null,
      request_status_id: null,
      created_at: null,
      request_date: null,
      search: null,
    };

    const requestParams = await getParamsFromUrl(request, params);
    const validationRequest = await validateRequestByUrlParams<IEmployeeRequestsFilters>(
      requestParams,
      EmployeeRequestsGetFilterSchema,
    );

    if (validationRequest.response) return validationRequest.response;

    const validRequestData = validationRequest.data;
    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const employeeRequests = await EmployeeRequestService.getEmployeeRequestsByParams(validRequestData);
    if (!employeeRequests || employeeRequests.total === 0) {
      const response = HttpResponse.success(HttpMessages.employeeRequests.notFound, {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });

      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.employeeRequests.getSuccess, employeeRequests);
    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error(error.message);
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });
    return handleHttpResponse(response);
  }
}
