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
  validateIncidentsRolesPermissions,
  getEmployeeDireccion,
} from "@/app/api/common/utils.service";
import { logger } from "@/lib/logger";
import { failureResponse, getRoleValueById, validateDireccionAccess } from "@/common/utils";
import { EmployeeService } from "@/app/api/services/employee.service";
import { INCIDENTS_ROLES_PERMISSIONS } from "@/common/constants/IncidentsRolesPermissions";
import { IncidentRulesService } from "@/app/api/services/incident-rules.service";

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

  const { employeeId, roleId, userId } = authData;
  const role = getRoleValueById(roleId);

  try {
    const direccionValidation = await validateDireccionAccess(role, userId, Number(body.employeeId), EmployeeService);

    if (!direccionValidation.allowed) {
      const response = HttpResponse.failure(HttpMessages.employeeIncidents.notAllowedToCreateForDifferentDireccion, {});
      return handleHttpResponse(response);
    }

    const permissionValidation = await validateIncidentsRolesPermissions(
      roleId,
      Number(body.incidentId),
      INCIDENTS_ROLES_PERMISSIONS.CAN_CREATE,
    );
    if (!permissionValidation)
      return failureResponse(HttpMessages.employeeIncidents.incidentsRolesPermissionsCreateFailed);

    for (const validation of [getFolio, getIncidentStatus, validateEmployee, validateEmployeeIncident]) {
      const validationResponse = await validation(body);
      if (validationResponse) return handleHttpResponse(validationResponse);
    }

    const rulesValidation = await IncidentRulesService.validateIncidentRules(body);
    if (rulesValidation) return handleHttpResponse(rulesValidation);

    const datesToCheck = body.incidentDates || [];

    if (datesToCheck.length > 0) {
      const conflicts = await EmployeeIncidentsService.findDateConflicts(Number(body.employeeId), datesToCheck);
      if (conflicts.length > 0) {
        const response = HttpResponse.failure(HttpMessages.incidentRules.notSameDay, {
          dates: conflicts.map((d) => d.toISOString().slice(0, 10)),
        });
        return handleHttpResponse(response);
      }
    }

    const direccionId = await getEmployeeDireccion(Number(body.employeeId));
    const createData = {
      ...body,
      createdBy: employeeId ? Number(employeeId) : userId,
      direccionId: direccionId ? Number(direccionId) : null,
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
