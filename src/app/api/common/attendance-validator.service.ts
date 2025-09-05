import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { INCIDENT_TYPES_ID } from "@/common/constants/IncidentTypes";
import { INCIDENT_STATUS_ID } from "@/common/constants/IncidentStatus";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";

dayjs.extend(isoWeek);

interface AttendanceInput {
  id: number;
  numberEmployee: string;
  isEntry: number;
  dateTime: string;
}

export class AttendanceValidator {
  static async shouldSaveAttendance(numberEmployee: string, isEntry: number, dateTime: string): Promise<boolean> {
    const attendanceDate = new Date(dateTime);

    const existingRecords = await EmployeeAttendanceService.findByEmployeeAndDateTime(numberEmployee, attendanceDate);

    if (isEntry === 1) {
      const hasExistingEntry = existingRecords.some(
        (record) => record.check_in !== null && this.isSameDay(record.check_in, attendanceDate),
      );
      return !hasExistingEntry;
    }

    if (isEntry === 0) {
      const hasExistingExit = existingRecords.some(
        (record) => record.check_out !== null && this.isSameDay(record.check_out, attendanceDate),
      );
      return !hasExistingExit;
    }

    return true;
  }

  private static isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  static async validateAttendance(record: AttendanceInput, employeeData: any) {
    if (record.isEntry !== 1) return null;

    const attendanceDate = dayjs(record.dateTime);
    const dayOfWeek = attendanceDate.isoWeekday();

    const schedule = employeeData.job_schedule_employee.find((s: any) => {
      const startDay = s.start_day.id;
      const endDay = s.end_day.id;
      return dayOfWeek >= startDay && dayOfWeek <= endDay;
    });

    if (!schedule) return null;

    const [startHour, startMinute] = schedule.start_hour.display_name.split(":");
    const scheduledStart = attendanceDate.hour(parseInt(startHour)).minute(parseInt(startMinute)).second(0);

    const toleranceLimit = scheduledStart.add(15, "minute");

    if (attendanceDate.isAfter(toleranceLimit)) {
      const folio = await EmployeeIncidentsService.getFolio();

      const [incident] = await EmployeeIncidentsService.createEmployeeIncidents({
        folio,
        incidentId: INCIDENT_TYPES_ID.RETARDO,
        description: "Retardo automático detectado en registro de asistencia",
        startDate: new Date(attendanceDate.format("YYYY-MM-DD")).toISOString(),
        endDate: new Date(attendanceDate.format("YYYY-MM-DD")).toISOString(),
        incidentDates: [record.dateTime],
        employeeId: employeeData.id,
        incidentStatusId: INCIDENT_STATUS_ID.CREADA,
        createdBy: employeeData.id,
      });

      return incident.id;
    }

    return null;
  }
}
