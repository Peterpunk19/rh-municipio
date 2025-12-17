import { prisma } from "@/lib/prisma";
import { createAttendance } from "@/app/api/employee-payroll/tests/seeds/helpers/createAttendance";

export async function createIncident(
  employeeId: number,
  locationId: number,
  ascriptionId: number,
  employeeAttendanceTypeId: number,
  incidentName: string,
  date: string,
  checkIn: string,
  checkOut: string,
  jobScheduleEmployeeId?: number | null,
  jobScheduleCalendarId?: number | null,
) {
  const inc = await prisma.incident.findFirst({
    where: { name: incidentName },
  });

  const ei = await prisma.employeeIncidents.create({
    data: {
      employee_id: employeeId,
      incident_id: inc!.id,
      incident_status_id: 2,
      folio: `${employeeId}${Date.now()}`,
      description: "Seed Incident",
      start_date: new Date(date),
      end_date: new Date(date),
      created_by_id: employeeId,
      active: true,
    },
  });

  await prisma.employeeIncidentDays.create({
    data: {
      employee_incident_id: ei.id,
      date: new Date(date),
      value: 1,
    },
  });

  await prisma.employeeIncidentsStatus.create({
    data: {
      employee_incident_id: ei.id,
      incident_status_id: 2,
      created_by_id: employeeId,
    },
  });

  const attendance = await createAttendance(employeeId, locationId, ascriptionId, employeeAttendanceTypeId, {
    checkIn: checkIn,
    checkOut: checkOut,
    jobScheduleEmployeeId: jobScheduleEmployeeId ?? null,
    jobScheduleCalendarId: jobScheduleCalendarId ?? null,
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
}
