import { handleHttpResponse } from "@/common/response/handler";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import type { IEmployeeIncidentFilters } from "@/app/api/employee-incidents/types";
import { EmployeeIncidentsGetFilterSchema } from "@/schemas/employee-incidents";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { getParamsFromUrl, getRoleValueById } from "@/common/utils";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { ROLES } from "@/common/constants/Roles";
import { logger } from "@/lib/logger";
import { EmployeeService } from "@/app/api/services/employee.service";

export async function GET(request: Request) {
  try {
    const params = {
      page: 1,
      limit: 5,
      employee_id: null,
      incident_id: null,
      incident_status_id: null,
      start_date: null,
      end_date: null,
      search: null,
    };

    const requestParams = await getParamsFromUrl(request, params);

    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const { roleId, employeeId } = authData;
    const role = getRoleValueById(roleId);

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

    if (role === ROLES.EMPLEADO && requestParams.employee_id && requestParams.employee_id !== employeeId) {
      const response = HttpResponse.failure(HttpMessages.employeeIncidents.notAllowedToList, {});
      return handleHttpResponse(response);
    }

    if (role === ROLES.EMPLEADO) {
      validRequestData.employee_id = Number(employeeId);
    }

    if (role === ROLES.ENLACE || role === ROLES.SUBENLACE) {
      const employee = await EmployeeService.getEmployeeById(employeeId as number);
      const direccionId = employee?.employee_hiring?.[0]?.direccion?.id;
      if (typeof direccionId === "number" && !isNaN(direccionId)) {
        validRequestData.direccion_id = direccionId;
      }
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
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
