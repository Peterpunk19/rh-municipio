import { prisma } from "@/lib/prisma";

export async function createAttendance(
  employeeId: number,
  locationId: number,
  ascriptionId: number,
  employeeAttendanceTypeId: number,
  data: {
    checkIn?: string | null;
    checkOut?: string | null;
    jobScheduleEmployeeId?: number | null;
    jobScheduleCalendarId?: number | null;
  },
) {
  const { checkIn, checkOut, jobScheduleEmployeeId, jobScheduleCalendarId } = data;

  return prisma.employeeAttendance.create({
    data: {
      employee_id: employeeId,
      employee_location_id: locationId,
      employee_ascription_id: ascriptionId,
      created_by_id: 1,
      description: "Test seed",
      employee_attendance_type_id: employeeAttendanceTypeId,
      check_in: checkIn ? new Date(checkIn) : null,
      check_out: checkOut ? new Date(checkOut) : null,
      job_schedule_employee_id: jobScheduleEmployeeId ?? null,
      job_schedule_calendar_id: jobScheduleCalendarId ?? null,
    },
  });
}
