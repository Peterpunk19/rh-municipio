import { NextRequest, NextResponse } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeIncidentsBulkCreateSchema } from "@/schemas/employee-incidents";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import type { IEmployeeIncidentsBulkCreate } from "@/app/api/employee-incidents/types";
import { authMiddleware } from "@/middleware/authMiddleware";
import { logger } from "@/lib/logger";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { validateIncidentsRolesPermissions } from "@/app/api/common/utils.service";
import { INCIDENTS_ROLES_PERMISSIONS } from "@/common/constants/IncidentsRolesPermissions";

export async function POST(request: NextRequest) {
  const validationRequest = await validateRequest<IEmployeeIncidentsBulkCreate>(
    request,
    EmployeeIncidentsBulkCreateSchema,
  );
  if (validationRequest.response) {
    return validationRequest.response;
  }

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

  try {
    const incident = await CatalogsService.getCatalogById("incident", Number(body.incidentId));
    if (!incident) {
      return handleHttpResponse(HttpResponse.failure(HttpMessages.employeeIncidents.notFound, {}));
    }

    if (!(incident as any).allow_bulk_creation) {
      return handleHttpResponse(HttpResponse.failure(HttpMessages.employeeIncidents.bulkNotAllowed, {}));
    }

    const permissionValidation = await validateIncidentsRolesPermissions(
      Number(roleId),
      Number(body.incidentId),
      INCIDENTS_ROLES_PERMISSIONS.CAN_CREATE,
    );
    if (!permissionValidation) {
      return handleHttpResponse(
        HttpResponse.failure(HttpMessages.employeeIncidents.incidentsRolesPermissionsCreateFailed, {}),
      );
    }

    const result = await EmployeeIncidentsService.bulkCreateEmployeeIncidents({
      employeeIds: body.employeeIds,
      incidentId: Number(body.incidentId),
      startDate: body.startDate,
      endDate: body.endDate,
      description: body.description,
      oficio: body.oficio ?? null,
      incidentDates: body.incidentDates ?? [],
      startHour: body.startHour ?? null,
      endHour: body.endHour ?? null,
      roleId: Number(roleId),
      userId: Number(userId),
      createdBy: employeeId ? Number(employeeId) : Number(userId),
    });

    return handleHttpResponse(result);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
