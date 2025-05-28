import { handleHttpResponse } from "@/common/response/handler";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import type { IEmployeeAttendanceFilters } from "@/app/api/employee-attendance/types";
import { EmployeeAttendanceGetFilterSchema } from "@/schemas/employee-attendance";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import { getParamsFromUrl, getRoleValueById } from "@/common/utils";
import { logger } from "@/lib/logger";
import { ROLES } from "@/common/constants/Roles";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function GET(request: Request) {
  try {
    const params = {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      employeeId: null,
      checkIn: null,
      checkOut: null,
      typeAttendance: null,
      location: null,
      organismPublic: null,
      organismAdministrative: null,
      search: null,
    };

    const requestParams = await getParamsFromUrl(request, params);

    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const { roleId, employeeId } = authData;
    const role = getRoleValueById(roleId);

    const validationRequest = await validateRequestByUrlParams<IEmployeeAttendanceFilters>(
      requestParams,
      EmployeeAttendanceGetFilterSchema,
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
      validRequestData.employeeId = Number(employeeId);
    }

    const existingEmployeesAttendances =
      await EmployeeAttendanceService.getEmployeesAttendanceByParams(validRequestData);

    if (existingEmployeesAttendances && existingEmployeesAttendances.total === 0) {
      const response = HttpResponse.success(HttpMessages.employeeAttendance.notFound, {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });

      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.employeeAttendance.getSuccess, existingEmployeesAttendances);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
      error: HttpMessages.error.internalServerError,
    });
    return handleHttpResponse(response);
  }
}
