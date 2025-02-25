import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { IEmployeeIncident } from "@/app/api/employee-incidents/types";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function formatFolio(folio: number): string {
  return String(folio).padStart(6, "0");
}

function mapToIEmployeeIncident(data: any, folio: string): IEmployeeIncident {
  return {
    folio,
    employeeId: data.id || "",
    startDate: getRandomDate(new Date("2000-01-01"), new Date("2025-01-01")),
    endDate: getRandomDate(new Date("2000-01-01"), new Date("2025-01-01")),
    incidentId: getRandomNumber(1, 5),
    incidentStatusId: getRandomNumber(1, 5),
    description: "TEST IMPORT",
  };
}

export async function POST() {
  try {
    const createdEmployeesIncidents: IEmployeeIncident[] = [];

    const employees = await EmployeeService.getEmployeesByParams({
      limit: 50,
      page: 1,
    });

    let folio = await EmployeeIncidentsService.getFolio();

    for (const employeeData of employees.data) {
      const formattedFolio = formatFolio(Number(folio));
      const employeeMapped = mapToIEmployeeIncident(employeeData, formattedFolio);
      Number(folio++);

      console.log(employeeMapped);

      const [employee] = await EmployeeIncidentsService.createEmployeeIncidents(employeeMapped);
      createdEmployeesIncidents.push(employee);
    }

    const response = HttpResponse.success(HttpMessages.employeeIncidents.createdSuccess, {
      createdEmployeesIncidents,
    });

    return handleHttpResponse(response);
  } catch (error: any) {
    console.log(error.message);

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
