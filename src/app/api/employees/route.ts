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
    const limit = Number.parseInt(searchParams.get("limit") || ("5" as string), 10);
    const active = searchParams.has("active") ? searchParams.get("active") : null;
    const employee_type = searchParams.has("employee_type")
      ? Number.parseInt(searchParams.get("employee_type")!, 10)
      : null;
    const employee_status = searchParams.has("employee_status")
      ? Number.parseInt(searchParams.get("employee_status")!, 10)
      : null;
    const gender = searchParams.has("gender") ? Number.parseInt(searchParams.get("gender")!, 10) : null;
    const location = searchParams.has("location") ? Number.parseInt(searchParams.get("location")!, 10) : null;
    const category = searchParams.has("category") ? Number.parseInt(searchParams.get("category")!, 10) : null;
    const direccion = searchParams.has("direccion") ? Number.parseInt(searchParams.get("direccion")!, 10) : null;
    const secretaria = searchParams.has("secretaria") ? Number.parseInt(searchParams.get("secretaria")!, 10) : null;
    const start_job_date_start = searchParams.has("start_job_date_start")
      ? searchParams.get("start_job_date_start")
      : null;
    const start_job_date_end = searchParams.has("start_job_date_end") ? searchParams.get("start_job_date_end") : null;
    const end_job_date_start = searchParams.has("end_job_date_start") ? searchParams.get("end_job_date_start") : null;
    const end_job_date_end = searchParams.has("end_job_date_end") ? searchParams.get("end_job_date_end") : null;
    const search = searchParams.has("search") ? searchParams.get("search") : null;
    const requestParams = {
      page,
      limit,
      active,
      gender,
      category,
      employee_type,
      employee_status,
      location,
      direccion,
      secretaria,
      start_job_date_start,
      start_job_date_end,
      end_job_date_start,
      end_job_date_end,
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
