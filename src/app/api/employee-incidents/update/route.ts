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
import { INCIDENT_STATUS_ID } from "@/common/constants/IncidentStatus";
import { validateIncidentsRolesPermissions } from "@/app/api/common/utils.service";

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

    const existingIncidentStatusId = await CatalogsService.getCatalogById("incidentStatus", incidentStatusId);

    if (!existingIncidentStatusId) return failureResponse(HttpMessages.incidentStatus.idNotFound);

    const employeeIncident = await EmployeeIncidentsService.getEmployeeIncidentById(employeeIncidentId);

    if (!employeeIncident) return failureResponse(HttpMessages.employeeIncidents.notFoundById);

    const permissionValidation = await validateIncidentsRolesPermissions(
      roleId,
      Number(employeeIncident.incident_id),
      existingIncidentStatusId.permission_name,
    );
    if (!permissionValidation)
      return failureResponse(HttpMessages.employeeIncidents.incidentsRolesPermissionsUpdateFailed);

    if (incidentStatusId === INCIDENT_STATUS_ID.CANCELADA && employeeIncident.employee.user_id !== userId) {
      return failureResponse(HttpMessages.employeeIncidents.invalidUserToCancel);
    }

    const currentStatusId = employeeIncident.incident_status_id as unknown as number;
    if (currentStatusId !== undefined && currentStatusId === incidentStatusId)
      return failureResponse(HttpMessages.employeeIncidents.invalidUpdateData);

    const isInvalidEmployee = (incident: any) =>
      !incident.employee || !incident.employee.employee_hiring?.length || !incident.employee.employee_location?.length;

    if (isInvalidEmployee(employeeIncident))
      return failureResponse(HttpMessages.employeeIncidents.employeeWithoutHiringOrLocation);

    const validateEmployeeIncidentStatusId = await EmployeeIncidentsStatusService.validateEmployeeIncidentStatus(
      employeeIncidentId,
      incidentStatusId,
    );

    if (validateEmployeeIncidentStatusId) return failureResponse(HttpMessages.incidentStatus.invalidIncidentStatusId);

    const employeeData = employeeIncident.employee as unknown as {
      id: number;
      number_employee: string;
      employee_ascriptions: { id: number }[];
      employee_hiring: { id: number }[];
      employee_location: { id: number }[];
      employee_attendance_type: { id: number }[];
    };

    const startDate = employeeIncident.start_date as unknown as string | Date;
    const endDate = employeeIncident.end_date as unknown as string | Date;
    const employeeId_value = employeeIncident.employee_id as unknown as number | undefined;
    const incidentDays = employeeIncident.employee_incident_days as unknown as any[];

    if (
      !employeeData.employee_ascriptions?.length ||
      !employeeData.employee_hiring?.length ||
      !employeeData.employee_location?.length ||
      !employeeData.employee_attendance_type?.length
    ) {
      return failureResponse(HttpMessages.error.invalidRequest);
    }
    const updateData = {
      id: employeeIncidentId,
      incidentStatusId: incidentStatusId,
      numberEmployee: employeeData.number_employee,
      employeeId: employeeData.id,
      employeeAscriptionId: employeeData.employee_ascriptions?.[0]?.id,
      employeeHiringId: employeeData.employee_hiring?.[0]?.id,
      employeeLocationId: employeeData.employee_location?.[0]?.id,
      employeeAttendanceTypeId: employeeData.employee_attendance_type?.[0]?.id,
      createdById:
        incidentStatusId === INCIDENT_STATUS_ID.CANCELADA
          ? employeeId_value
            ? Number(employeeId_value)
            : Number(employeeId)
          : Number(employeeId),
      checkIn: startDate ?? new Date(),
      checkOut: endDate ?? new Date(),
      employeeIncidentDays: incidentDays ?? [],
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
