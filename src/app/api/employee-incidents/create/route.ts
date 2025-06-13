import { NextRequest } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { HttpMessages } from "@/common/response/messages";
import type { IEmployeeIncident } from "@/app/api/employee-incidents/types";
import { EmployeeIncidentsPostSchema } from "@/schemas/employee-incidents";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";
import {
  getFolio,
  getIncidentStatus,
  validateEmployee,
  validateEmployeeIncident,
} from "@/app/api/common/utils.service";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const validationRequest = await validateRequest<IEmployeeIncident>(request, EmployeeIncidentsPostSchema);
  if (validationRequest.response) return validationRequest.response;

  const body = validationRequest.data;

  if (!body) {
    const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
    return handleHttpResponse(response);
  }

  const authData = await authMiddleware();

  if (authData instanceof NextResponse) {
    return authData;
  }

  const { userId: userAuthenticatedId } = authData;

  try {
    for (const validation of [getFolio, getIncidentStatus, validateEmployee, validateEmployeeIncident]) {
      const validationResponse = await validation(body);
      if (validationResponse) return handleHttpResponse(validationResponse);
    }

    const createData = {
      ...body,
      createdBy: userAuthenticatedId,
    };

    const [createEmployeeIncidents] = await EmployeeIncidentsService.createEmployeeIncidents(createData);
    const response = HttpResponse.success(HttpMessages.employeeIncidents.createdSuccess, createEmployeeIncidents);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
