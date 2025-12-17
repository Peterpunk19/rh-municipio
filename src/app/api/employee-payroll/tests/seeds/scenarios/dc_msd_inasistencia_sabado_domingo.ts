import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedDC_MSD_InasistenciaSabadoDomingo(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "DC_MSD_InasistenciaSabadoDomingo",
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
    excludeDays: ["2025-12-06", "2025-12-07"],
    jornadas: {
      miercoles: {
        weekdays: [3],
        startDay: 3,
        endDay: 3,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
      sabadoDomingo: {
        weekdays: [6, 0],
        startDay: 6,
        endDay: 7,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
    },
  });

  // Inasistencia Sabado 2025-12-06
  // Inasistencia Domingo 2025-12-07
}
