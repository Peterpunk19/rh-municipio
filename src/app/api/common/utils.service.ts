import type { IEmployeeIncident } from "@/app/api/employee-incidents/types";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { EmployeeService } from "@/app/api/services/employee.service";
import { INCIDENT_STATUS } from "@/common/constants/IncidentStatus";
import type { IEmployeeAttendance } from "@/app/api/employee-attendance/types";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";

let cachedIncidentStatus: Awaited<ReturnType<typeof CatalogsService.getIncidentStatusByName>> | null = null;

export const getFolio = async (body: IEmployeeIncident) => {
  const folio = await EmployeeIncidentsService.getFolio();

  if (!folio) {
    return HttpResponse.failure(HttpMessages.employeeIncidents.folioError, {});
  }

  body.folio = folio;

  return null;
};

export const getIncidentStatus = async (body: IEmployeeIncident) => {
  if (!cachedIncidentStatus) {
    cachedIncidentStatus = await CatalogsService.getIncidentStatusByName(INCIDENT_STATUS.CREADA);
  }

  if (!cachedIncidentStatus) {
    return HttpResponse.failure(HttpMessages.incidentStatus.notFound, {});
  }

  body.incidentStatusId = cachedIncidentStatus.id;
  return null;
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

  if (await EmployeeAttendanceService.validateEmployeeAttendance(body)) {
    return HttpResponse.failure(HttpMessages.employeeAttendance.invalidData, {});
  }

  return null;
};
