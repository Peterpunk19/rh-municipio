import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import { logger } from "@/lib/logger";
import type { NextRequest } from "next/server";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import { validateRequest } from "@/common/request/validateRequest";
import { EmployeeAttendanceBulkInsertSchema } from "@/schemas/employee-attendance";
import { AttendanceValidator } from "@/app/api/common/attendance-validator.service";

interface AttendanceRequest {
  id: number;
  numberEmployee: string;
  dateTime: string;
  isEntry: number;
}

interface AttendanceResponse extends AttendanceRequest {
  status: "success" | "error";
  errorMessage?: string;
}

export async function POST(request: NextRequest) {
  try {
    const validatedRequest = await validateRequest<AttendanceRequest[]>(request, EmployeeAttendanceBulkInsertSchema);
    if (validatedRequest.response) return validatedRequest.response;

    const body = validatedRequest.data;
    if (!body || !Array.isArray(body)) {
      return handleHttpResponse(HttpResponse.failure(HttpMessages.error.invalidRequest, {}));
    }

    const employeeNumbers = body.map((emp) => String(emp.numberEmployee));
    const employees = await EmployeeService.getEmployeesForBulkAttendance(employeeNumbers);

    const createdById = 1;
    const processedRecords: AttendanceResponse[] = [];

    for (const record of body) {
      const responseRecord: AttendanceResponse = {
        ...record,
        status: "success",
      };

      try {
        const { numberEmployee, isEntry, dateTime } = record;
        const timestamp = new Date(dateTime);

        if (isNaN(timestamp.getTime())) {
          throw new Error("Formato de fecha inválido");
        }

        const employee = employees.find((e) => e.number_employee === numberEmployee);
        if (!employee) {
          throw new Error("Empleado no encontrado");
        }

        if (employee.employee_attendance_type[0]?.attendance?.name !== "digital_clock") {
          responseRecord.status = "error";
          responseRecord.errorMessage = HttpMessages.employeeAttendanceType.notValid;
          processedRecords.push(responseRecord);
          continue;
        }

        if (!employee.employee_ascriptions.length) {
          responseRecord.status = "error";
          responseRecord.errorMessage = HttpMessages.employeeAscription.notFound;
          processedRecords.push(responseRecord);
          continue;
        }

        if (!employee.employee_location.length) {
          responseRecord.status = "error";
          responseRecord.errorMessage = HttpMessages.employeeLocation.notFound;
          processedRecords.push(responseRecord);
          continue;
        }

        if (!employee.employee_attendance_type.length) {
          responseRecord.status = "error";
          responseRecord.errorMessage = HttpMessages.employeeAttendanceType.notFound;
          processedRecords.push(responseRecord);
          continue;
        }

        const [ascription, location, attendanceType] = [
          employee.employee_ascriptions[0],
          employee.employee_location[0],
          employee.employee_attendance_type[0],
        ];

        const shouldSave = await AttendanceValidator.shouldSaveAttendance(numberEmployee, isEntry, dateTime);

        if (!shouldSave) {
          responseRecord.status = "error";
          responseRecord.errorMessage = "Ya existe un registro con esta fecha";
          processedRecords.push(responseRecord);
          continue;
        }

        let existingRecord = null;
        if (isEntry === 1) {
          existingRecord = await EmployeeAttendanceService.findMatchingRecordForCheckIn(numberEmployee, timestamp);
        } else {
          existingRecord = await EmployeeAttendanceService.findMatchingRecordForCheckOut(numberEmployee, timestamp);
        }

        const incidentId = await AttendanceValidator.validateAttendance(record, employee);

        if (existingRecord) {
          if (isEntry === 1) {
            await EmployeeAttendanceService.updateAttendanceCheckIn(existingRecord.id, timestamp, incidentId);
          } else {
            await EmployeeAttendanceService.updateAttendanceCheckOut(existingRecord.id, timestamp);
          }
        } else {
          const attendanceData = {
            employee_id: employee.id,
            check_in: isEntry === 1 ? timestamp : null,
            check_out: isEntry === 0 ? timestamp : null,
            active: true,
            created_by_id: createdById,
            employee_ascription_id: ascription.id,
            employee_location_id: location.id,
            employee_attendance_type_id: attendanceType.id,
            employee_incident_id: incidentId,
            description: isEntry === 1 ? "Entrada registrada" : "Salida registrada",
          };

          await EmployeeAttendanceService.createSingleAttendance(attendanceData);
        }
      } catch (error) {
        logger.error(error instanceof Error ? error : { error });
        responseRecord.status = "error";
        responseRecord.errorMessage = error instanceof Error ? error.message : "Error desconocido";
      }

      processedRecords.push(responseRecord);
    }

    return handleHttpResponse(HttpResponse.success(HttpMessages.employeeAttendance.processed, processedRecords));
  } catch (error) {
    logger.error(error instanceof Error ? error : { error: "Unknown error" });
    return handleHttpResponse(HttpResponse.internalServerError(HttpMessages.error.internalServerError, {}));
  }
}
