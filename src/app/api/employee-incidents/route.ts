import { handleHttpResponse } from "@/common/response/handler";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import type { IEmployeeIncidentFilters } from "@/app/api/employee-incidents/types";
import { EmployeeIncidentsGetFilterSchema } from "@/schemas/employee-incidents";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { getParamsFromUrl } from "@/common/utils";

export async function GET(request: Request) {
  try {
    const params = {
      page: 1,
      limit: 5,
      incident_id: null,
      incident_status_id: null,
      start_date: null,
      end_date: null,
      search: null,
    };

    const requestParams = await getParamsFromUrl(request, params);

    const validationRequest = await validateRequestByUrlParams<IEmployeeIncidentFilters>(
      requestParams,
      EmployeeIncidentsGetFilterSchema,
    );

    if (validationRequest.response) return validationRequest.response;

    const validRequestData = validationRequest.data;

    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const existingEmployees = await EmployeeIncidentsService.getEmployeesIncidentsByParams(validRequestData);

    if (existingEmployees && existingEmployees.total === 0) {
      const response = HttpResponse.success(HttpMessages.employeeIncidents.notFound, {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });

      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.employeeIncidents.getSuccess, existingEmployees);

    return handleHttpResponse(response);
  } catch (error) {
    console.error(`An error occurred detail: ${error}`);
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
