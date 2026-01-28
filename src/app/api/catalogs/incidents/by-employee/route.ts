import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import { INCIDENT_TYPES_ID } from "@/common/constants/IncidentTypes";
import { GENDER } from "@/common/constants/Gender";
import { ROLES_ID_VALUES } from "@/common/constants/Roles";
import { EmployeeService } from "@/app/api/services/employee.service";
import { IncidentsRolesPermissionsService } from "@/app/api/services/incidents-roles-permissions";
import { UserService } from "@/app/api/services/user.service";
import { getParamsFromUrl } from "@/common/utils";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { IncidentByEmployeeGetSchema } from "@/schemas/catalogs";

export async function GET(request: NextRequest) {
  try {
    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const requestParams = {
      employee_id: null,
    };

    const params = await getParamsFromUrl(request, requestParams);

    const validationRequest = await validateRequestByUrlParams<typeof requestParams>(
      params,
      IncidentByEmployeeGetSchema,
    );

    if (validationRequest.response) return validationRequest.response;

    if (!validationRequest.data) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const employee = await EmployeeService.getEmployeeById(Number(validationRequest.data.employee_id));

    if (!employee) {
      const response = HttpResponse.failure(HttpMessages.employee.notFoundById, {});
      return handleHttpResponse(response);
    }

    const incidents = await IncidentsRolesPermissionsService.getIncidentsByRoleWithCreatePermission(
      Number(authData.roleId),
    );

    const userDirecciones = await UserService.getActiveUserDirecciones(authData.userId);

    const hasSeguridadPublicaAccess = userDirecciones.some(
      (ud) => ud.direccion.name === "direccion_de_seguridad_publica",
    );

    const genderName = employee.gender?.name;
    const attendanceTypeDisplayName = employee.employee_attendance_type?.[0]?.attendance?.display_name;
    const employeeInSeguridadPublica =
      employee.employee_ascriptions?.[0]?.direccion?.name === "direccion_de_seguridad_publica";

    const filteredIncidents = incidents.filter((incident) => {
      const id = incident.id;
      const isAdmin =
        authData.roleId === ROLES_ID_VALUES.admin || authData.roleId === ROLES_ID_VALUES.admin_incidencias;

      if (genderName === GENDER.MALE && id === INCIDENT_TYPES_ID.LACTANCIA) return false;
      if (genderName !== GENDER.MALE && id === INCIDENT_TYPES_ID.PATERNIDAD) return false;

      if (id === INCIDENT_TYPES_ID.SUSPENSION && !isAdmin) return false;

      if (id === INCIDENT_TYPES_ID.FALTA && attendanceTypeDisplayName !== "LISTA DE ASISTENCIA") return false;

      if (id === INCIDENT_TYPES_ID.ARRESTO) {
        if (!employeeInSeguridadPublica) return false;
        if (!isAdmin && !hasSeguridadPublicaAccess) return false;
      }

      return true;
    });

    const response = HttpResponse.success(HttpMessages.catalog.success, filteredIncidents);

    return handleHttpResponse(response);
  } catch (error: any) {
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
      error: error.message,
    });

    return handleHttpResponse(response);
  }
}
