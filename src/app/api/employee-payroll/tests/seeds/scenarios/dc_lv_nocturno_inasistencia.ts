import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedDC_LV_Nocturno_Inasistencia(numberEmployee: string) {
  const { employee, ascription, location, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee,
    name: "DC_LV_Nocturno_Inasistencia",
    attendanceType: "digital_clock",
  });

  await generateMonthlyAttendances({
    employeeId: employee.id,
    locationId: location.id,
    ascriptionId: ascription.id,
    attendanceTypeId: employeeAttendanceType.id,
    year: 2025,
    month: 12,
    untilDay: 15,
    excludeDays: ["2025-12-08"],
    jornadas: {
      lunesViernes: {
        weekdays: [1, 2, 3, 4, 5],
        startDay: 1,
        endDay: 5,
        startHourId: 43,
        endHourId: 15,
        checkIn: "21:00",
        checkOut: "07:00",
      },
    },
  });

  // Lunes 08 inasistencia
}
