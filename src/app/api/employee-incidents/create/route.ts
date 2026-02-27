import { NextRequest, NextResponse } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { HttpMessages } from "@/common/response/messages";
import type { IEmployeeIncident } from "@/app/api/employee-incidents/types";
import { EmployeeIncidentsPostSchema } from "@/schemas/employee-incidents";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import {
  assignPercentageDays,
  getEmployeeDireccion,
  getFolio,
  getIncidentStatus,
  validateEmployee,
  validateEmployeeIncident,
  validateIncidentsRolesPermissions,
} from "@/app/api/common/utils.service";
import { logger } from "@/lib/logger";
import { failureResponse, getRoleValueById, validateDireccionAccess, validateIncidentDatesRange } from "@/common/utils";
import { EmployeeService } from "@/app/api/services/employee.service";
import { INCIDENTS_ROLES_PERMISSIONS } from "@/common/constants/IncidentsRolesPermissions";
import { IncidentRulesService } from "@/app/api/services/incident-rules.service";
import { INCIDENT_TYPES_ID } from "@/common/constants/IncidentTypes";
import { generateIncidentDates, validateIncidentDateConflicts } from "@/common/utils";

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

    if (body.incidentId === INCIDENT_TYPES_ID.LACTANCIA || body.incidentId === INCIDENT_TYPES_ID.ARRESTO) {
      body.incidentDates = generateIncidentDates(body.startDate, body.endDate);
    }

    const datesToValidate = body.incidentDates || [];

    if (
      datesToValidate.length > 0 &&
      body.incidentId !== INCIDENT_TYPES_ID.LACTANCIA &&
      body.incidentId !== INCIDENT_TYPES_ID.ARRESTO
    ) {
      const outOfRangeDates = validateIncidentDatesRange(datesToValidate, body.startDate, body.endDate);

      if (outOfRangeDates.length > 0) {
        return handleHttpResponse(
          HttpResponse.failure(HttpMessages.employeeIncidents.incidentDatesOutOfRange, {
            startDate: body.startDate,
            endDate: body.endDate,
            invalidDates: outOfRangeDates,
          }),
        );
      }
    }

    const rulesValidation = await IncidentRulesService.validateIncidentRules(body);
    if (rulesValidation && !rulesValidation.success) {
      return handleHttpResponse(rulesValidation);
    }

    if (rulesValidation && rulesValidation.success && body.incidentId === INCIDENT_TYPES_ID.LICENCIA_MEDICA) {
      const licenciaMedicaData = rulesValidation.responseObject as any;
      body.incidentDatesWithPercentage = assignPercentageDays(body.incidentDates, licenciaMedicaData);
    }

    const datesToCheck = body.incidentDates || [];
    const conflictValidation = await validateIncidentDateConflicts(
      Number(body.employeeId),
      datesToCheck,
      Number(body.incidentId),
    );

    if (conflictValidation.hasConflicts) {
      return handleHttpResponse(conflictValidation.error);
    }

    const direccionId = await getEmployeeDireccion(Number(body.employeeId));
    const createData = {
      ...body,
      createdBy: employeeId ? Number(employeeId) : userId,
      direccionId: direccionId ? Number(direccionId) : null,
    };

    if (body.incidentId === INCIDENT_TYPES_ID.INCAPACIDAD) {
      const hasOpenIncapacity = await EmployeeIncidentsService.hasOpenIncapacity(Number(body.employeeId));

      if (hasOpenIncapacity) {
        return failureResponse(HttpMessages.employeeIncidents.openIncapacity);
      }
    }

    const [createEmployeeIncidents] = await EmployeeIncidentsService.createEmployeeIncidents(createData);
    const response = HttpResponse.success(HttpMessages.employeeIncidents.createdSuccess, createEmployeeIncidents);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
