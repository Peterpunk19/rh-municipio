import { NextRequest, NextResponse } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { HttpMessages } from "@/common/response/messages";
import { IEmployeeIncidentById } from "@/app/api/employee-incidents/types";
import { EmployeeIncidentsUpdateSchema } from "@/schemas/employee-incidents";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { logger } from "@/lib/logger";
import { failureResponse } from "@/common/utils";
import { authMiddleware } from "@/middleware/authMiddleware";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { EmployeeIncidentsStatusService } from "@/app/api/services/employee-incidents-status.service";
import { IncidentsStatusService } from "@/app/api/services/incidents-status.service";
import { INCIDENT_STATUS_ID } from "@/common/constants/IncidentStatus";

export async function PUT(request: NextRequest) {
  try {
    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const { userId, roleId, employeeId } = authData;

    const validationRequest = await validateRequest<IEmployeeIncidentById>(request, EmployeeIncidentsUpdateSchema);
    if (validationRequest.response) return validationRequest.response;

    const body = validationRequest.data;
    if (!body) return failureResponse(HttpMessages.error.invalidRequest);

    const employeeIncidentId = Number(body.id);
    const incidentStatusId = Number(body.incidentStatusId);

    const isAllowedToUpdate = await IncidentsStatusService.validateIncidentStatus(incidentStatusId);

    if (!isAllowedToUpdate) return failureResponse(HttpMessages.incidentStatus.idNotFound);

    const rolesArray = isAllowedToUpdate.allowed_roles_to_update.split(",").map(Number);

    if (!rolesArray.includes(roleId)) {
      return failureResponse(HttpMessages.employeeIncidents.notAllowedToUpdate);
    }

    const employeeIncident = await EmployeeIncidentsService.getEmployeeIncidentById(employeeIncidentId);

    if (!employeeIncident) return failureResponse(HttpMessages.employeeIncidents.notFoundById);

    if (incidentStatusId === INCIDENT_STATUS_ID.CANCELADA && employeeIncident.employee.user_id !== userId) {
      return failureResponse(HttpMessages.employeeIncidents.invalidUserToCancel);
    }

    if (employeeIncident.incident_status_id === incidentStatusId)
      return failureResponse(HttpMessages.employeeIncidents.invalidUpdateData);

    const isInvalidEmployee = (incident: any) =>
      !incident.employee || !incident.employee.employee_hiring?.length || !incident.employee.employee_location?.length;

    if (isInvalidEmployee(employeeIncident))
      return failureResponse(HttpMessages.employeeIncidents.employeeWithoutHiringOrLocation);

    const existingIncidentStatusId = await CatalogsService.getCatalogById("incidentStatus", incidentStatusId);

    if (!existingIncidentStatusId) return failureResponse(HttpMessages.incidentStatus.idNotFound);

    const validateEmployeeIncidentStatusId = await EmployeeIncidentsStatusService.validateEmployeeIncidentStatus(
      employeeIncidentId,
      incidentStatusId,
    );

    if (validateEmployeeIncidentStatusId) return failureResponse(HttpMessages.incidentStatus.invalidIncidentStatusId);

    const updateData = {
      id: employeeIncidentId,
      incidentStatusId: incidentStatusId,
      employeeId: employeeIncident.employee.id,
      employeeHiringId: employeeIncident.employee.employee_hiring[0].id,
      employeeLocationId: employeeIncident.employee.employee_location[0].id,
      createdById:
        incidentStatusId === INCIDENT_STATUS_ID.CANCELADA ? employeeIncident.employee_id : Number(employeeId),
      checkIn: employeeIncident.start_date,
      checkOut: employeeIncident.end_date,
      employeeAttendanceTypeId: employeeIncident.employee.employee_attendance_type[0].id,
      employeeIncidentDays: employeeIncident.employee_incident_days,
      validatedById: Number(employeeId),
    };

    const [updatedEmployeeIncident] = await EmployeeIncidentsService.updateEmployeeIncidents(updateData);
    return handleHttpResponse(
      HttpResponse.success(HttpMessages.employeeIncidents.updatedSuccess, updatedEmployeeIncident),
    );
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    return handleHttpResponse(
      HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
        error: HttpMessages.error.internalServerError,
      }),
    );
  }
}
