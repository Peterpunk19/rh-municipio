import { handleHttpResponse } from "@/common/response/handler";
import { EmployeeGetByIdSchema } from "@/schemas/employee";
import type { IEmployeeById } from "@/app/api/employees/interface";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { failureResponse, successResponse } from "@/common/utils";
import { logger } from "@/lib/logger";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number.parseInt((await params).id);
    if (isNaN(id)) return failureResponse(HttpMessages.error.invalidId);

    const validationRequest = await validateRequestByUrlParams<IEmployeeById>({ id }, EmployeeGetByIdSchema);
    if (validationRequest.response) return validationRequest.response;

    const searchParams = request.nextUrl?.searchParams ?? new URLSearchParams();
    const isPDF = searchParams.get("isPDF") === "true";
    const incidentDateParam = searchParams.get("incidentDate");
    const incidentDate = incidentDateParam ? new Date(incidentDateParam) : undefined;

    const existingEmployeeIncident = await EmployeeIncidentsService.getEmployeeIncidentById(id, isPDF, incidentDate);
    if (!existingEmployeeIncident) return failureResponse(HttpMessages.employeeIncidents.notFoundById);

    return successResponse(HttpMessages.employeeIncidents.foundById, existingEmployeeIncident);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    return handleHttpResponse(
      HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
        error: HttpMessages.error.internalServerError,
      }),
    );
  }
}
