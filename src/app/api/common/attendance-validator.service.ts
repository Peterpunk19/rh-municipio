import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { INCIDENT_TYPES_ID } from "@/common/constants/IncidentTypes";
import { INCIDENT_STATUS_ID } from "@/common/constants/IncidentStatus";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import { getEmployeeDireccion } from "@/app/api/common/utils.service";

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
    if (!attendanceDate.isValid()) {
      throw new Error("Formato de fecha inválido");
    }

    // 1. Intentar obtener horario intercalado (JobScheduleCalendar)
    const calendarSchedule = this.getIntercaladoScheduleForRecord(employeeData, attendanceDate);

    if (calendarSchedule) {
      return await this.validateWithCalendarSchedule(record, employeeData, attendanceDate, calendarSchedule);
    }

    // 2. Si no hay calendario, usar horario fijo (JobScheduleEmployee)
    const fixedSchedule = this.getFixedSchedule(employeeData, attendanceDate);
    console.log("fixedSchedule");
    console.log(fixedSchedule);
    if (fixedSchedule) {
      return await this.validateWithFixedSchedule(record, employeeData, attendanceDate, fixedSchedule);
    }
    return null;
  }

  private static getIntercaladoScheduleForRecord(employeeData: any, attendanceDate: dayjs.Dayjs) {
    const calendars = employeeData.job_schedule_calendar || [];
    if (!calendars.length) return null;

    const schedule = calendars.find((cal: any) => {
      const checkIn = dayjs(cal.check_in);
      const checkOut = dayjs(cal.check_out);

      return (
        attendanceDate.isSame(checkIn) ||
        attendanceDate.isSame(checkOut) ||
        (attendanceDate.isAfter(checkIn) && attendanceDate.isBefore(checkOut))
      );
    });

    return schedule || null;
  }

  private static async validateWithCalendarSchedule(
    record: AttendanceInput,
    employeeData: any,
    attendanceDate: dayjs.Dayjs,
    schedule: any,
  ): Promise<number | null> {
    // Si es entrada, validamos retardo contra check_in/start_hour
    if (record.isEntry === 1) {
      const [startHour, startMinute] = schedule.start_hour.display_name.split(":");
      const scheduledStart = dayjs(schedule.check_in)
        .hour(parseInt(startHour, 10))
        .minute(parseInt(startMinute, 10))
        .second(0);

      const diffMinutes = attendanceDate.diff(scheduledStart, "minute");

      // ENTRE 16 Y 30 → retardo normal
      if (diffMinutes >= 16 && diffMinutes <= 30) {
        return await this.createRetardoIncident(record, employeeData, attendanceDate);
      }

      // DESPUÉS DE 31 → retardo mayor
      if (diffMinutes >= 31) {
        return await this.createRetardoMayorIncident(record, employeeData, attendanceDate);
      }
    }

    // lógica específica para salidas (isEntry === 0) salida anticipada, etc.

    return null;
  }

  private static getFixedSchedule(employeeData: any, attendanceDate: dayjs.Dayjs) {
    const dayOfWeek = attendanceDate.isoWeekday();

    const schedule = employeeData.job_schedule_employee.find((s: any) => {
      const startDay = s.start_day.id;
      const endDay = s.end_day.id;
      return dayOfWeek >= startDay && dayOfWeek <= endDay;
    });

    if (!schedule) return null;

    return schedule;
  }

  private static async validateWithFixedSchedule(
    record: AttendanceInput,
    employeeData: any,
    attendanceDate: dayjs.Dayjs,
    schedule: any,
  ): Promise<number | null> {
    if (record.isEntry === 1) {
      const [startHour, startMinute] = schedule.start_hour.display_name.split(":");
      const scheduledStart = attendanceDate.hour(parseInt(startHour)).minute(parseInt(startMinute)).second(0);

      const diffMinutes = attendanceDate.diff(scheduledStart, "minute");

      console.log("diffMinutes");
      console.log(diffMinutes);
      if (diffMinutes >= 16 && diffMinutes <= 30) {
        return await this.createRetardoIncident(record, employeeData, attendanceDate);
      }

      if (diffMinutes >= 31) {
        return await this.createRetardoMayorIncident(record, employeeData, attendanceDate);
      }
    }

    // lógica para salidas
    return null;
  }

  private static async createRetardoIncident(
    record: AttendanceInput,
    employeeData: any,
    attendanceDate: dayjs.Dayjs,
  ): Promise<number> {
    const folio = await EmployeeIncidentsService.getFolio();
    const direccionId = await getEmployeeDireccion(Number(employeeData.id));

    const [incident] = await EmployeeIncidentsService.createEmployeeIncidents({
      folio,
      incidentId: INCIDENT_TYPES_ID.RETARDO,
      description: "Retardo en entrada.",
      startDate: new Date(attendanceDate.format("YYYY-MM-DD")).toISOString(),
      endDate: new Date(attendanceDate.format("YYYY-MM-DD")).toISOString(),
      incidentDates: [record.dateTime],
      employeeId: employeeData.id,
      incidentStatusId: INCIDENT_STATUS_ID.CREADA,
      createdBy: employeeData.id,
      direccionId: direccionId ? Number(direccionId) : null,
    });

    return incident.id;
  }

  private static async createRetardoMayorIncident(
    record: AttendanceInput,
    employeeData: any,
    attendanceDate: dayjs.Dayjs,
  ): Promise<number> {
    const folio = await EmployeeIncidentsService.getFolio();
    const direccionId = await getEmployeeDireccion(Number(employeeData.id));

    const [incident] = await EmployeeIncidentsService.createEmployeeIncidents({
      folio,
      incidentId: INCIDENT_TYPES_ID.RETARDO_MAYOR, // ← DEBES AGREGAR ESTE NUEVO ID
      description: "Retardo mayor (+31 minutos). Descuento de 1 día.",
      startDate: new Date(attendanceDate.format("YYYY-MM-DD")).toISOString(),
      endDate: new Date(attendanceDate.format("YYYY-MM-DD")).toISOString(),
      incidentDates: [record.dateTime],
      employeeId: employeeData.id,
      incidentStatusId: INCIDENT_STATUS_ID.CREADA,
      createdBy: employeeData.id,
      direccionId: direccionId ? Number(direccionId) : null,
    });

    return incident.id;
  }
}
