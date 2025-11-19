import { NextRequest, NextResponse } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { HttpMessages } from "@/common/response/messages";
import { IJobScheduleCalendar } from "@/app/api/job-schedule-calendar/create/types";
import { logger } from "@/lib/logger";
import { JobScheduleCalendarPostSchema } from "@/schemas/job-schedule-calendar";
import { EmployeeService } from "@/app/api/services/employee.service";
import { JobScheduleCalendarService } from "@/app/api/services/job-schedule-calendar.service";
import { authMiddleware } from "@/middleware/authMiddleware";

export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware();
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  const { response, data: body } = await validateRequest<IJobScheduleCalendar>(request, JobScheduleCalendarPostSchema);
  if (response) {
    return response;
  }

  if (!body) return handleHttpResponse(HttpResponse.failure(HttpMessages.error.validationFields, {}));

  try {
    const employees = await EmployeeService.getEmployeesWithAttendanceType(body.employees);

    if (employees.length === 0) {
      return handleHttpResponse(HttpResponse.failure(HttpMessages.employee.idsNotFound, {}));
    }

    const validEmployees = employees.filter((e) => e.employee_attendance_type[0]?.attendance?.name === "intercalated");

    if (validEmployees.length === 0) {
      return handleHttpResponse(
        HttpResponse.failure("Ninguno de los empleados tiene asistencia tipo INTERCALADO.", {}),
      );
    }

    const invalidEmployees = employees.filter(
      (e) => e.employee_attendance_type[0]?.attendance?.name !== "intercalated",
    );

    if (invalidEmployees.length > 0) {
      return handleHttpResponse(
        HttpResponse.failure(
          `Los siguientes empleados NO son tipo intercalado: ${invalidEmployees.map((i) => i.id).join(", ")}`,
          {},
        ),
      );
    }

    body.employees = validEmployees.map((e) => e.id);

    const duplicated = body.schedules.map((s) => s.date).filter((date, index, arr) => arr.indexOf(date) !== index);

    if (duplicated.length > 0) {
      return handleHttpResponse(
        HttpResponse.failure(
          `No puedes enviar más de un horario para la misma fecha: ${[...new Set(duplicated)].join(", ")}`,
          {},
        ),
      );
    }

    const employeeAttendance = await JobScheduleCalendarService.saveJobScheduleCalendar(body, authResponse.userId);

    const response = HttpResponse.success(HttpMessages.employeeAttendance.createdSuccess, employeeAttendance);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
      error: HttpMessages.error.internalServerError,
    });

    return handleHttpResponse(response);
  }
}
