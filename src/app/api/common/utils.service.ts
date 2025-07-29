import type { IEmployeeIncident } from "@/app/api/employee-incidents/types";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { EmployeeService } from "@/app/api/services/employee.service";
import { INCIDENT_STATUS } from "@/common/constants/IncidentStatus";
import { REQUEST_STATUS } from "@/common/constants/RequestStatus";
import type { IEmployeeAttendance } from "@/app/api/employee-attendance/types";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import type { IEmployeeRequest } from "@/app/api/employee-requests/types";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { IncidentsRolesPermissionsService } from "@/app/api/services/incidents-roles-permissions";

let cachedIncidentStatus: Awaited<ReturnType<typeof CatalogsService.getIncidentStatusByName>> | null = null;
let cachedRequestStatus: Awaited<ReturnType<typeof CatalogsService.getRequestStatusByName>> | null = null;

async function getStatus<T>(
  body: T,
  statusKey: keyof T,
  cachedStatus: any | null,
  getStatusByName: (name: string) => Promise<any>,
  statusName: string,
  cacheSetter: (value: any) => void,
  errorMessage: string,
) {
  if (!cachedStatus) {
    cachedStatus = await getStatusByName(statusName);
    cacheSetter(cachedStatus);
  }

  if (!cachedStatus) {
    return HttpResponse.failure(errorMessage, {});
  }

  (body[statusKey] as any) = cachedStatus.id;
  return null;
}

export const getFolio = async (body: IEmployeeIncident) => {
  const folio = await EmployeeIncidentsService.getFolio();

  if (!folio) {
    return HttpResponse.failure(HttpMessages.employeeIncidents.folioError, {});
  }

  body.folio = folio;

  return null;
};

export const getIncidentStatus = async (body: IEmployeeIncident) => {
  return getStatus(
    body,
    "incidentStatusId",
    cachedIncidentStatus,
    CatalogsService.getIncidentStatusByName,
    INCIDENT_STATUS.CREADA,
    (value) => (cachedIncidentStatus = value),
    HttpMessages.incidentStatus.notFound,
  );
};

export const validateEmployee = async (body: any) => {
  const employee = await EmployeeService.getEmployeeById(body.employeeId);

  if (!employee) {
    return HttpResponse.failure(HttpMessages.employee.idNotFound, {});
  }

  return null;
};

export const validateEmployeeIncident = async (body: IEmployeeIncident) => {
  const employeeIncident = await EmployeeIncidentsService.validateEmployeeIncident(body);

  if (employeeIncident) {
    return HttpResponse.failure(HttpMessages.employeeIncidents.invalidData, {});
  }

  return null;
};

export const validateIncidentsRolesPermissions = async (roleId: number, incidentId: number, permissionType: string) => {
  return await IncidentsRolesPermissionsService.validateIncidentsRolesPermissions(
    roleId,
    incidentId,
    permissionType as any,
  );
};

export const getEmployee = async (body: any) => {
  return await EmployeeService.getEmployeeById(body.employeeId);
};

export const validateEmployeeData = async (employee: any, body: IEmployeeAttendance) => {
  if (!employee.employee_hiring.length) {
    return HttpResponse.failure(HttpMessages.employeeHiring.notFound, {});
  }

  if (!employee.employee_location.length) {
    return HttpResponse.failure(HttpMessages.employeeLocation.notFound, {});
  }

  if (!employee.employee_attendance_type.length) {
    return HttpResponse.failure(HttpMessages.employeeAttendanceType.notFound, {});
  }

  if (await EmployeeAttendanceService.validateEmployeeAttendance(body)) {
    return HttpResponse.failure(HttpMessages.employeeAttendance.invalidData, {});
  }

  return null;
};

export const getEmployeeRequestFolio = async (body: IEmployeeRequest) => {
  const folio = await EmployeeRequestService.getFolio();

  if (!folio) {
    return HttpResponse.failure(HttpMessages.employeeRequests.folioError, {});
  }

  body.folio = folio;

  return null;
};

export const getRequestStatus = async (body: IEmployeeRequest) => {
  return getStatus(
    body,
    "requestStatusId",
    cachedRequestStatus,
    CatalogsService.getRequestStatusByName,
    REQUEST_STATUS.CREADA,
    (value) => (cachedRequestStatus = value),
    HttpMessages.requestStatus.notFound,
  );
};

export const validateEmployeeRequest = async (body: IEmployeeRequest) => {
  const employeeRequest = await EmployeeRequestService.validateEmployeeRequest(body);

  if (employeeRequest) {
    return HttpResponse.failure(HttpMessages.employeeRequests.invalidData, {});
  }

  return null;
};

export const validateExistence = async (id: number, key: string, service: Function, notFoundMessage: string) => {
  try {
    const element = await service(id);
    if (!element) {
      return HttpResponse.failure(HttpMessages.error.notFound, {
        [key]: {
          messages: [notFoundMessage],
        },
      });
    }
    return null;
  } catch (error: any) {
    return HttpResponse.failure(HttpMessages.error.internalServerError, {
      [key]: {
        messages: [HttpMessages.error.internalServerError],
      },
    });
  }
};

export const getEmployeeDireccion = async (employeeId: number) => {
  const employee = await EmployeeService.getEmployeeById(employeeId);

  if (!employee || !employee.employee_hiring || employee.employee_hiring.length === 0) {
    return null;
  }

  const activeHiring = employee.employee_hiring.find((hiring) => hiring.active === true);
  if (!activeHiring || !activeHiring.direccion_id) {
    return null;
  }

  return activeHiring.direccion_id;
};
