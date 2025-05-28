import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpMessages } from "@/common/response/messages";
import { logger } from "@/lib/logger";
import { EmployeeAttendanceGetByIdSchema } from "@/schemas/employee-attendance";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import { StatusCodes } from "http-status-codes";
import type { IEmployeeAttendanceById } from "@/app/api/employee-attendance/types";
import { failureResponse, successResponse } from "@/common/utils";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number.parseInt((await params).id);
    const requestParams: IEmployeeAttendanceById = { id };

    const validationRequest = await validateRequestByUrlParams<IEmployeeAttendanceById>(
      requestParams,
      EmployeeAttendanceGetByIdSchema,
    );

    if (validationRequest.response) {
      return validationRequest.response;
    }

    const validRequestData = validationRequest.data;
    if (!validRequestData) {
      return failureResponse(HttpMessages.error.invalidRequest, {});
    }

    const existingEmployeeAttendance = await EmployeeAttendanceService.getEmployeeAttendanceById(validRequestData.id);
    if (!existingEmployeeAttendance) {
      return failureResponse(HttpMessages.employeeAttendance.notFoundById, {}, StatusCodes.NOT_FOUND);
    }

    return successResponse(HttpMessages.employeeAttendance.foundById, existingEmployeeAttendance);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return failureResponse(
      HttpMessages.error.internalServerError,
      { error: HttpMessages.error.internalServerError },
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
}
