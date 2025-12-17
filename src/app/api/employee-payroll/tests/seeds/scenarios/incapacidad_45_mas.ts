import { prisma } from "@/lib/prisma";
import { createEmployeeSeed } from "@/app/api/employee-payroll/tests/seeds/helpers/createEmployee";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";

export default async function seedIncapacidad45Mas(numberEmployee: string) {
  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed({
    numberEmployee: numberEmployee,
    name: "Incapacidad_Mayor45",
    attendanceType: "attendance_list",
  });

  // Ajustamos antigüedad para que tenga >10 años
  await prisma.employeeHiring.updateMany({
    where: { employee_id: employee.id },
    data: { start_job_date: new Date("2010-01-01") },
  });

  // Incapacidad de 60 días => >45 días
  const incident = await prisma.incident.findFirst({
    where: { name: "incapacidad" },
  });

  const ei = await prisma.employeeIncidents.create({
    data: {
      employee_id: employee.id,
      incident_id: incident!.id,
      incident_status_id: 2,
      folio: `${employee.id}-${Date.now()}`,
      start_date: new Date("2025-10-01"),
      end_date: new Date("2025-11-30"),
      description: "Incapacidad larga",
      created_by_id: employee.id,
      active: true,
    },
  });

  await prisma.employeeIncidentsStatus.create({
    data: {
      employee_incident_id: ei.id,
      incident_status_id: 2,
      created_by_id: employee.id,
    },
  });

  // Generar los 60 días y marcar el porcentaje según regla
  const start = new Date("2025-10-01");
  const end = new Date("2025-11-30");

  let current = new Date(start);

  while (current <= end) {
    await prisma.employeeIncidentDays.create({
      data: {
        employee_incident_id: ei.id,
        date: new Date(current),
        value: 1,
        percentage_salary: 80, // >10 años => 80%
      },
    });

    const attendance = await createAttendance(employee.id, location.id, ascription.id, employeeAttendanceType.id, {
      checkIn: new Date(current).toISOString(),
      checkOut: new Date(current).toISOString(),
    });

    await prisma.employeeAttendanceIncident.create({
      data: {
        employee_attendance: {
          connect: { id: attendance.id },
        },
        employee_incident: {
          connect: { id: ei.id },
        },
        created_at: new Date(),
      },
    });

    current.setDate(current.getDate() + 1);
  }
}
