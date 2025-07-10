import { NextRequest, NextResponse } from "next/server";
import { EmployeeRequestPostSchema } from "@/schemas/employee-requests";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { HttpMessages } from "@/common/response/messages";
import { IEmployeeRequest, IRequestValidations } from "@/app/api/employee-requests/types";
import { RequestService } from "@/app/api/services/request.service";
import { DayService } from "@/app/api/services/day.service";
import { HourService } from "@/app/api/services/hour.service";
import { LocationService } from "@/app/api/services/location.service";
import { AttendanceService } from "@/app/api/services/attendance.service";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import {
  getEmployeeRequestFolio,
  getRequestStatus,
  validateEmployee,
  validateEmployeeRequest,
  validateExistence,
} from "@/app/api/common/utils.service";
import { startOfDay } from "@/common/utils";
import { logger } from "@/lib/logger";
import { authMiddleware } from "@/middleware/authMiddleware";
import { DireccionService } from "@/app/api/services/direccion.service";
import { getRoleValueById, validateDireccionAccess } from "@/common/utils";
import { EmployeeService } from "@/app/api/services/employee.service";

const requestValidations: IRequestValidations = {
  schedule_change_request: [
    { id: "startDayId", service: DayService.getDayById, message: HttpMessages.day.notFoundById },
    { id: "endDayId", service: DayService.getDayById, message: HttpMessages.day.notFoundById },
    { id: "startHourId", service: HourService.getHourById, message: HttpMessages.hour.notFoundById },
    { id: "endHourId", service: HourService.getHourById, message: HttpMessages.hour.notFoundById },
  ],
  location_change_request: [
    { id: "locationId", service: LocationService.getLocationById, message: HttpMessages.location.notFoundById },
  ],
  checker_change_request: [
    { id: "attendanceId", service: AttendanceService.getAttendanceById, message: HttpMessages.attendance.notFoundById },
  ],
  fingerprint_registration_request: [
    { id: "locationId", service: LocationService.getLocationById, message: HttpMessages.location.notFoundById },
  ],
  adscription_change_request: [
    { id: "locationId", service: LocationService.getLocationById, message: HttpMessages.location.notFoundById },
    { id: "direccionId", service: DireccionService.getDireccionById, message: HttpMessages.location.notFoundById },
    { id: "attendanceId", service: AttendanceService.getAttendanceById, message: HttpMessages.attendance.notFoundById },
  ],
};

export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware();
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  const validationRequest = await validateRequest<IEmployeeRequest>(request, EmployeeRequestPostSchema);
  if (validationRequest.response) return validationRequest.response;

  const body = validationRequest.data;

  if (!body) {
    return handleHttpResponse(HttpResponse.failure(HttpMessages.error.invalidRequest, {}));
  }

  const { userId, roleId } = authResponse;
  const role = getRoleValueById(roleId);

  body.requestedById = userId;

  try {
    const direccionValidation = await validateDireccionAccess(role, userId, Number(body.employeeId), EmployeeService);

    if (!direccionValidation.allowed) {
      const response = HttpResponse.failure(
        direccionValidation.errorMessage || HttpMessages.employeeRequests.notAllowedToCreateForDifferentDireccion,
        {},
      );
      return handleHttpResponse(response);
    }

    const existingRequest = await RequestService.getRequestById(body.requestId);

    if (!existingRequest) {
      return handleHttpResponse(
        HttpResponse.failure(HttpMessages.error.notFound, {
          requestId: {
            messages: [HttpMessages.request.notFoundById],
          },
        }),
      );
    }

    const validations = requestValidations[existingRequest.name];

    if (!validations) {
      return handleHttpResponse(HttpResponse.failure(HttpMessages.request.validationsNotFound, {}));
    }

    const itemsToValidate =
      existingRequest.name === "schedule_change_request" && Array.isArray(body.schedule) ? body.schedule : [body];

    for (const item of itemsToValidate) {
      try {
        const validationPromises = validations.map((validation) => {
          const value = (item as any)[validation.id];
          return validateExistence(value, validation.id, validation.service, validation.message);
        });
        const responses = await Promise.all(validationPromises);
        const failedResponse = responses.find((response) => response);
        if (failedResponse) return handleHttpResponse(failedResponse);
      } catch (error: any) {
        return handleHttpResponse(
          HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message }),
        );
      }
    }

    if (!body.requestDate) body.requestDate = startOfDay(new Date()).toISOString();

    for (const validation of [validateEmployee, getEmployeeRequestFolio, getRequestStatus, validateEmployeeRequest]) {
      const validationResponse = await validation(body);
      if (validationResponse) return handleHttpResponse(validationResponse);
    }

    const [employeeRequest] = await EmployeeRequestService.createEmployeeRequest(body);
    const response = HttpResponse.success(HttpMessages.employeeRequests.createdSuccess, employeeRequest);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error(error.message);

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
