import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import { validateRequest } from "@/common/request/validateRequest";
import { EmployeeAttendanceBulkInsertSchema } from "@/schemas/employee-attendance";

interface IEmployeeAttendance {
  numberEmployee: string;
  dateTime: string;
  isEntry: number;
}

export async function POST(request: NextRequest) {
  try {
    const validatedRequest = await validateRequest<IEmployeeAttendance[]>(request, EmployeeAttendanceBulkInsertSchema);

    if (validatedRequest.response) return validatedRequest.response;

    const body = validatedRequest.data;

    if (!body) {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
      return handleHttpResponse(response);
    }

    const employeeNumbers = body.map((emp: { numberEmployee: any }) => String(emp.numberEmployee));
    const employees = await EmployeeService.getEmployeesForBulkAttendance(employeeNumbers);

    const createdById = 1;
    const attendancesToCreateSuccess = [];
    const attendancesToCreateError: never[] = [];
    const attendancesCheckOutSuccess = [];
    const attendancesCheckOutError = [];

    for (const record of body) {
      const { numberEmployee, isEntry, dateTime } = record as IEmployeeAttendance;

      const employee = employees.find((e) => e.number_employee === numberEmployee);

      if (!employee) {
        attendancesCheckOutError.push({
          message: `Empleado con número ${record.numberEmployee} no encontrado`,
          ...record,
        });
      }

      if (employee) {
        const employeeAscriptions = employee.employee_ascriptions[0];
        if (!employeeAscriptions) {
          throw new Error(`Empleado ${record.numberEmployee} no tiene ascripción asignada`);
        }

        const employeeLocation = employee.employee_location[0];
        if (!employeeLocation) {
          throw new Error(`Empleado ${record.numberEmployee} no tiene ubicacion asignada`);
        }

        const employeeAttendanceType = employee.employee_attendance_type[0];
        if (!employeeAttendanceType) {
          throw new Error(`Empleado ${record.numberEmployee} no tiene tipo de asistencia asignada`);
        }

        if (isEntry === 1) {
          attendancesToCreateSuccess.push({
            check_in: new Date(dateTime),
            check_out: null,
            active: true,
            created_by_id: createdById,
            employee_ascription_id: employeeAscriptions.id,
            employee_location_id: employeeLocation.id,
            employee_attendance_type_id: employeeAttendanceType.id,
            description: "Entrada automática",
          });
        }

        if (isEntry === 0) {
          try {
            await EmployeeAttendanceService.updateAttendanceById(
              employee.number_employee,
              employeeAscriptions.id,
              employeeLocation.id,
              dateTime,
            );

            attendancesCheckOutSuccess.push(record);
          } catch (err) {
            attendancesCheckOutError.push({
              message: `Error al registrar salida: ${(err as Error).message}`,
              ...record,
            });
          }
        }
      }
    }

    if (attendancesToCreateSuccess.length > 0) {
      await EmployeeAttendanceService.createEmployeeAttendanceByBulk(attendancesToCreateSuccess);
    }

    const response = HttpResponse.success(
      attendancesToCreateSuccess.length
        ? HttpMessages.employeeAttendance.createdSuccess
        : HttpMessages.employeeAttendance.notCreated,
      {
        attendancesToCreateSuccess,
        attendancesToCreateError,
        attendancesCheckOutSuccess,
        attendancesCheckOutError,
      },
    );

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
      error: HttpMessages.error.internalServerError,
    });
    return handleHttpResponse(response);
  }
}
