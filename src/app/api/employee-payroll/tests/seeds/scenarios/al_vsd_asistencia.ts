import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { generateMonthlyAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateAttendances";

export default async function seedAL_VSD_Asistencia(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "AL_VSD_Asistencia",
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
      viernesSabadoDomingo: {
        weekdays: [5, 6, 7],
        startDay: 5,
        endDay: 7,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
    },
  });
}
