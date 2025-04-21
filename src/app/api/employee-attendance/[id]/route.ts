import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpMessages } from "@/common/response/messages";
import { HttpResponse } from "@/common/response/model";
import { logger } from "@/lib/logger";
import { EmployeeAttendanceGetByIdSchema } from "@/schemas/employee-attendance";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import { StatusCodes } from "http-status-codes";
import { IEmployeeAttendanceById } from "@/app/api/employee-attendance/types";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id);
    const requestParams = { id };

    const validationRequest = await validateRequestByUrlParams<IEmployeeAttendanceById>(
      requestParams,
      EmployeeAttendanceGetByIdSchema,
    );

    if (validationRequest.response) {
      return validationRequest.response;
    }

    const validRequestData = validationRequest.data;
    if (!validRequestData) {
      return handleHttpResponse(HttpResponse.failure(HttpMessages.error.invalidRequest, {}));
    }

    const existingEmployeeAttendance = await EmployeeAttendanceService.getEmployeeAttendanceById(validRequestData.id);

    if (!existingEmployeeAttendance) {
      return handleHttpResponse(
        HttpResponse.failure(HttpMessages.employeeAttendance.notFoundById, {}, StatusCodes.NOT_FOUND),
      );
    }

    return handleHttpResponse(
      HttpResponse.success(HttpMessages.employeeAttendance.foundById, existingEmployeeAttendance),
    );
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return handleHttpResponse(
      HttpResponse.failure(HttpMessages.error.internalServerError, {
        error: HttpMessages.error.internalServerError,
      }),
    );
  }
}
