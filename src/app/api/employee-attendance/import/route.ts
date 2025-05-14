import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import { IEmployeeAttendance } from "@/app/api/employee-attendance/types";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import { EmployeeLocationService } from "@/app/api/services/employee-location.service";
import { UserService } from "@/app/api/services/user.service";
import { getRandomDate, getRandomElement } from "@/common/utils";
import { StatusCodes } from "http-status-codes";
import { logger } from "@/lib/logger";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const createdEmployeesAttendance: IEmployeeAttendance[] = [];

    const LIMIT = 1;
    const PAGE = 1;

    const getUsers = await UserService.getUsersByParams({
      limit: LIMIT,
      page: PAGE,
      active: true,
    });

    if (!getUsers?.users?.[0]?.id) {
      const response = HttpResponse.failure(HttpMessages.user.notFoundCreator, {}, StatusCodes.NOT_FOUND);
      return handleHttpResponse(response);
    }

    const createdById = getUsers.users[0].id;

    const employees = await EmployeeService.getEmployeesByParams({
      limit: 1000,
      page: 1,
      employee_id: body.employee_id || null,
      active: true,
    });

    if (!employees.data.length) {
      const response = HttpResponse.failure(HttpMessages.employeeAttendance.notFound, {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });
      return handleHttpResponse(response);
    }

    const [catalogLocation, catalogAttendance, catalogCategory, catalogEmployeeType, catalogDireccion] =
      await Promise.all([
        CatalogsService.getLocations(),
        CatalogsService.getAttendance(),
        CatalogsService.getCategory(),
        CatalogsService.getEmployeeTypes(),
        CatalogsService.getDirecciones(1),
      ]);

    const randomLocation = getRandomElement(catalogLocation);
    const randomAttendance = getRandomElement(catalogAttendance);
    const randomCategory = getRandomElement(catalogCategory);
    const randomEmployeeType = getRandomElement(catalogEmployeeType);
    const randomDireccion = getRandomElement(catalogDireccion);

    const fromDate = body.from ? new Date(body.from) : null;
    const toDate = body.to ? new Date(body.to) : null;

    if (fromDate) fromDate.setHours(0, 0, 0, 0);
    if (toDate) toDate.setHours(0, 0, 0, 0);

    const workStartHour = 8;
    const workShiftLengthInHours = 8;

    for (const employeeData of employees.data) {
      let employeeLocationId: number;

      if (!employeeData.employee_location[0]?.id) {
        const employeeLocation = await EmployeeLocationService.createEmployeeLocation({
          employeeId: employeeData.id,
          locationId: randomLocation.id,
          active: true,
          createdBy: createdById,
          attendanceId: randomAttendance.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        employeeLocationId = employeeLocation[0].id;
      } else {
        employeeLocationId = employeeData.employee_location[0].id;
      }

      let employeeHiringId: number;
      if (!employeeData.employee_hiring[0]?.id) {
        const employeeHiring = await EmployeeService.createEmployeeHiring({
          employeeId: employeeData.id,
          startJobDate: new Date().toISOString(),
          endJobDate: new Date().toISOString(),
          categoryId: randomCategory.id,
          employeeTypeId: randomEmployeeType.id,
          direccionId: randomDireccion.id,
        });
        employeeHiringId = employeeHiring.id;
      } else {
        employeeHiringId = employeeData.employee_hiring[0].id;
      }

      const employeeAttendances: IEmployeeAttendance[] = [];

      if (fromDate && toDate) {
        for (let date = new Date(fromDate); date <= toDate; date.setDate(date.getDate() + 1)) {
          const checkInDateTime = new Date(date);
          checkInDateTime.setHours(workStartHour, 0, 0, 0);

          const checkOutDateTime = new Date(checkInDateTime);
          checkOutDateTime.setHours(checkInDateTime.getHours() + workShiftLengthInHours);

          const [attendance] = await EmployeeAttendanceService.createEmployeeAttendance({
            checkIn: checkInDateTime.toISOString(),
            checkOut: checkOutDateTime.toISOString(),
            employeeId: employeeData.id,
            employeeHiringId: employeeHiringId,
            employeeLocationId: employeeLocationId,
            createdById: createdById,
            active: true,
            description: "Asistencia generada automaticamente",
          });

          if (!attendance) {
            const response = HttpResponse.failure(
              HttpMessages.employeeAttendance.notCreated,
              {},
              StatusCodes.NOT_FOUND,
            );
            return handleHttpResponse(response);
          }

          employeeAttendances.push(attendance);
        }
      } else {
        const randomBaseDate = new Date(getRandomDate(new Date("2025-01-01"), new Date()));
        randomBaseDate.setHours(0, 0, 0, 0);

        const workStartHour = 8;
        const workShiftLengthInHours = 8;

        const checkInDateTime = new Date(randomBaseDate);
        checkInDateTime.setHours(workStartHour, 0, 0, 0);

        const checkOutDateTime = new Date(checkInDateTime);
        checkOutDateTime.setHours(checkInDateTime.getHours() + workShiftLengthInHours);

        const [employee] = await EmployeeAttendanceService.createEmployeeAttendance({
          checkIn: checkInDateTime.toISOString(),
          checkOut: checkOutDateTime.toISOString(),
          employeeId: employeeData.id,
          employeeHiringId: employeeHiringId,
          employeeLocationId: employeeLocationId,
          createdById: createdById,
          active: true,
          description: "Asistencia generada automaticamente",
        });

        if (!employee) {
          const response = HttpResponse.failure(HttpMessages.employeeAttendance.notCreated, {}, StatusCodes.NOT_FOUND);
          return handleHttpResponse(response);
        }
        createdEmployeesAttendance.push(employee);
      }
    }

    const response = HttpResponse.success(HttpMessages.employeeAttendance.createdSuccess, {
      createdEmployeesAttendance,
    });

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
      error: HttpMessages.error.internalServerError,
    });
    return handleHttpResponse(response);
  }
}
