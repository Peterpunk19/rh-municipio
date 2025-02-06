import { handleHttpResponse } from "@/common/response/handler";
import { EmployeeGetByFilterSchema } from "@/schemas/employee";
import type { IEmployeeFilters } from "@/app/api/employees/interface";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeService } from "@/app/api/services/employee.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || ("1" as string), 10);
    const limit = Number.parseInt(searchParams.get("limit") || ("10" as string), 10);
    const active = searchParams.has("active") ? searchParams.get("active") : null;
    const status_employee_id = searchParams.has("status_employee_id")
      ? Number.parseInt(searchParams.get("status_employee_id")!, 10)
      : null;
    const location_id = searchParams.has("location_id") ? Number.parseInt(searchParams.get("location_id")!, 10) : null;
    const start_date = searchParams.has("start_date") ? searchParams.get("start_date") : null;
    const end_date = searchParams.has("end_date") ? searchParams.get("end_date") : null;
    const search = searchParams.has("search") ? searchParams.get("search") : null;
    const requestParams = {
      page,
      limit,
      active,
      status_employee_id,
      location_id,
      start_date,
      end_date,
      search,
    };
    const validationRequest = await validateRequestByUrlParams<IEmployeeFilters>(
      requestParams,
      EmployeeGetByFilterSchema,
    );
    if (validationRequest.response) return validationRequest.response;

    const validRequestData = validationRequest.data;

    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
      return handleHttpResponse(response);
    }
    const existingEmployees = await EmployeeService.getEmployeesByParams(validRequestData);

    if (existingEmployees && existingEmployees.total === 0) {
      const response = HttpResponse.success(HttpMessages.employee.notFound, {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });
      return handleHttpResponse(response);
    }
    const response = HttpResponse.success(HttpMessages.employee.getSuccess, existingEmployees);
    return handleHttpResponse(response);
  } catch (error) {
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
