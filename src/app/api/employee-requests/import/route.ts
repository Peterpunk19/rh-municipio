import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import type { IEmployeeRequest } from "@/app/api/employee-requests/types";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function formatFolio(folio: number): string {
  return String(folio).padStart(6, "0");
}

function mapToIEmployeeRequest(data: any, folio: string, userId: number): IEmployeeRequest {
  const requestId = getRandomNumber(1, 4);
  const baseData = {
    folio,
    oficio: data.oficio || "",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    requestId: requestId,
    employeeId: data.id || "",
    requestStatusId: getRandomNumber(1, 5),
    requestDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    requestedById: userId,
  };
  switch (requestId) {
    case 1:
      return {
        ...baseData,
        startDate: getRandomDate(new Date("2000-01-01"), new Date("2025-01-01")),
        endDate: getRandomDate(new Date("2000-01-01"), new Date("2025-01-01")),
        schedule: [
          {
            startDayId: 1,
            endDayId: 5,
            startHourId: 17,
            endHourId: 33,
          },
        ],
      };
    case 2:
      return {
        ...baseData,
        startDate: getRandomDate(new Date("2000-01-01"), new Date("2025-01-01")),
        endDate: getRandomDate(new Date("2000-01-01"), new Date("2025-01-01")),
        locationId: getRandomNumber(1, 10),
      };
    case 3:
      return {
        ...baseData,
        attendanceId: 1,
        attendanceDate: getRandomDate(new Date("2025-01-01"), new Date("2025-04-02")),
      };
    case 4:
      return {
        ...baseData,
        locationId: getRandomNumber(1, 10),
      };
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResponse = await authMiddleware();
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    const userId = authResponse.userId;

    const createdEmployeesRequests: IEmployeeRequest[] = [];

    const employees = await EmployeeService.getEmployeesByParams({
      limit: 10,
      page: 1,
    });

    let folio = await EmployeeRequestService.getFolio();

    for (const employeeData of employees.data) {
      const formattedFolio = formatFolio(Number(folio));
      const employeeMapped = mapToIEmployeeRequest(employeeData, formattedFolio, userId);
      Number(folio++);

      console.log(employeeMapped);

      const [employee] = await EmployeeRequestService.createEmployeeRequest(employeeMapped);
      createdEmployeesRequests.push(employee);
    }

    const response = HttpResponse.success(HttpMessages.employeeRequests.createdSuccess, {
      createdEmployeesRequests,
    });

    return handleHttpResponse(response);
  } catch (error: any) {
    console.log(error.message);

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
