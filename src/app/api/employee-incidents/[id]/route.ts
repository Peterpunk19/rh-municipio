import { handleHttpResponse } from "@/common/response/handler";
import { EmployeeGetByIdSchema } from "@/schemas/employee";
import type { IEmployeeById } from "@/app/api/employees/interface";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { failureResponse, successResponse } from "@/common/utils";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { validateIncidentsRolesPermissions } from "@/app/api/common/utils.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import { INCIDENTS_ROLES_PERMISSIONS } from "@/common/constants/IncidentsRolesPermissions";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const { roleId } = authData;

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

    const permissionValidation = await validateIncidentsRolesPermissions(
      roleId,
      Number(existingEmployeeIncident.incident_id),
      INCIDENTS_ROLES_PERMISSIONS.CAN_VIEW,
    );
    if (!permissionValidation)
      return failureResponse(HttpMessages.employeeIncidents.incidentsRolesPermissionsViewFailed);

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
