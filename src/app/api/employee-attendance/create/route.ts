import { NextRequest } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { HttpMessages } from "@/common/response/messages";
import type { IEmployeeAttendance } from "@/app/api/employee-attendance/types";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import { getEmployee, validateEmployeeData } from "@/app/api/common/utils.service";
import { EmployeeAttendancePostSchema } from "@/schemas/employee-attendance";
import { logger } from "@/lib/logger";
import { IEmployee } from "@/app/api/employee-attendance/create/types";

export async function POST(request: NextRequest) {
  const { response, data: body } = await validateRequest<IEmployeeAttendance>(request, EmployeeAttendancePostSchema);
  if (response) {
    return response;
  }

  if (!body) return handleHttpResponse(HttpResponse.failure(HttpMessages.error.validationFields, {}));

  try {
    const employee: IEmployee | null = await getEmployee(body);

    if (!employee) {
      return handleHttpResponse(HttpResponse.failure(HttpMessages.employee.idNotFound, {}));
    }

    const validationResponse = await validateEmployeeData(employee, body);
    if (validationResponse) return handleHttpResponse(validationResponse);

    body.employeeHiringId = employee.employee_hiring[0].id;
    body.employeeLocationId = employee.employee_location[0].id;
    body.createdById = employee.id;

    const [employeeAttendance] = await EmployeeAttendanceService.createEmployeeAttendance(body);

    const response = HttpResponse.success(HttpMessages.employeeAttendance.createdSuccess, employeeAttendance);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
      error: HttpMessages.error.internalServerError,
    });

    return handleHttpResponse(response);
  }
}
