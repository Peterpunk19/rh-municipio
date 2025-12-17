import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createWeeklySchedule } from "@/app/api/employee-payroll/tests/seeds/helpers/createSchedule";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedAL_Base(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "AL_Base",
    attendanceType: "attendance_list",
  });

  await generateMonthlyAttendances({
    employeeId: employee.id,
    locationId: location?.id,
    ascriptionId: ascription?.id,
    attendanceTypeId: employeeAttendanceType?.id,
    year: 2025,
    month: 12,
    untilDay: 15,
    createAttendances: false,
    jornadas: {
      lunesViernes: {
        weekdays: [1, 2, 3, 4, 5],
        startDay: 1,
        endDay: 5,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
    },
  });

  // Lista de asistencia solo registra incidencias
  // Y si no hay incidencias => paga quincena completa
  // No se registran asistencias.
  // No incidencias => 15 días completos.
}
