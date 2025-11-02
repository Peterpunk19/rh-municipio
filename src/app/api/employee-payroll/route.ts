import { handleHttpResponse } from "@/common/response/handler";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { getParamsFromUrl, getRoleValueById } from "@/common/utils";
import { logger } from "@/lib/logger";
import { ROLES } from "@/common/constants/Roles";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { EmployeePayrollService } from "@/app/api/services/employee-payrolll.service";
import { EmployeePayrollGetFilterSchema } from "@/schemas/employee-payroll";
import { IEmployeePayrollFilters } from "@/app/api/employee-payroll/types";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function GET(request: Request) {
  try {
    const params = {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      search: null,
      from: null,
      to: null,
      employeeId: null,
      direccionId: null,
      employeeTypeId: null,
      typeAttendance: null,
    };

    const requestParams = await getParamsFromUrl(request, params);
    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const { roleId, employeeId } = authData;
    const role = getRoleValueById(roleId);

    const validationRequest = await validateRequestByUrlParams<IEmployeePayrollFilters>(
      requestParams,
      EmployeePayrollGetFilterSchema,
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

    const employeePayroll = await EmployeePayrollService.getEmployeesPayrollByParams(validRequestData);

    if (employeePayroll && employeePayroll.total === 0) {
      const response = HttpResponse.success(HttpMessages.employeeAttendance.notFound, {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });

      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.employeeAttendance.getSuccess, employeePayroll);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
      error: HttpMessages.error.internalServerError,
    });
    return handleHttpResponse(response);
  }
}
