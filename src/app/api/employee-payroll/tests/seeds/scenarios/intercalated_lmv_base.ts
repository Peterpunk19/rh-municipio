import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { generateIntercalatedAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateIntercalatedAttendances";

export default async function seedIntercalated_LMV_Base(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "Intercalated_LMV_Base",
    attendanceType: "intercalated",
  });

  await generateIntercalatedAttendances({
    employeeId: employee.id,
    locationId: location.id,
    ascriptionId: ascription.id,
    attendanceTypeId: employeeAttendanceType.id,
    scheduleDays: ["2025-12-01", "2025-12-03", "2025-12-05", "2025-12-08", "2025-12-10", "2025-12-12", "2025-12-15"],
    jornada: {
      startHourId: 17,
      endHourId: 33,
      checkIn: "08:00",
      checkOut: "16:00",
    },
  });
}
