import { Employee, EmployeeHiring, EmployeeIncidentDays, Incident, JobScheduleEmployee } from "@prisma/client";

export type AttendanceTypeName = "digital_clock" | "attendance_list" | "intercalated";

export interface DailyIncident {
  date: Date;
  incident: Incident;
  incidentDay: EmployeeIncidentDays;
}

export interface DailyContext {
  date: Date;
  dayOfWeek: number;
  hasFullAttendance: boolean;
  hasCheckInOnly: boolean;
  hasCheckOutOnly: boolean;
  isScheduledDay: boolean;
  incidents: DailyIncident[];
}

export interface DiscountSummary {
  faltasDirectas: number;
  faltasPorInasistencias: number;
  faltasPorRetardoMayor: number;
  faltasPorRetardoNormal: number;
  faltasPorOmisiones: number;
  permisosSinGoce: number;
  totalFaltas: number;
}

export interface IncapacitySummary {
  totalDiasIncapacidad: number;
  factorSalario: number; // 0.5, 0.6, 0.7, 0.8 o 1
}

export interface EmployeeContext {
  employee: Employee;
  hiring: EmployeeHiring;
  attendanceTypeName: AttendanceTypeName;
  antiguedadYears: number;
}

/**
 * Peso del día (para faltas y retardos) según Day.id:
 *  - Lunes-Viernes (1..5): 1
 *  - Sábado (6): 2
 *  - Domingo (7): 3
 */
export function getDayWeight(dayOfWeek: number): 1 | 2 | 3 {
  if (dayOfWeek === 7) return 3;
  if (dayOfWeek === 6) return 2;
  return 1; // lunes-viernes
}

/**
 * Determina si un día es laboral para digital_clock / attendance_list
 * según los rangos de JobScheduleEmployee.
 * start_day_id / end_day_id están ligados a Day.id (1..7 para Lunes..Domingo).
 */
export function isWorkdayBySchedule(
  dayOfWeek: number,
  schedules: Pick<JobScheduleEmployee, "start_day_id" | "end_day_id">[],
): boolean {
  if (!schedules.length) return false;
  return schedules.some((s) => {
    if (s.start_day_id < 1 || s.start_day_id > 7) return false;
    if (s.end_day_id < 1 || s.end_day_id > 7) return false;
    return dayOfWeek >= s.start_day_id && dayOfWeek <= s.end_day_id;
  });
}

/**
 * Retardo normal → acumulamos unidades según día (1 / 2 / 3).
 * Luego faltasPorRetardoNormal = floor(unidades / 3)
 */
export function computeRetardoUnits(dailies: DailyContext[], workdayPredicate: (day: DailyContext) => boolean): number {
  let totalUnits = 0;

  for (const day of dailies) {
    if (!workdayPredicate(day)) continue;

    for (const di of day.incidents) {
      if (di.incident.name === "retardo") {
        totalUnits += getDayWeight(day.dayOfWeek);
      }
    }
  }

  return totalUnits;
}

/**
 * Retardo mayor = falta directa (peso 1/2/3).
 */
export function computeFaltasPorRetardoMayor(
  dailies: DailyContext[],
  workdayPredicate: (day: DailyContext) => boolean,
): number {
  let total = 0;

  for (const day of dailies) {
    if (!workdayPredicate(day)) continue;

    const hasRetardoMayor = day.incidents.some((di) => di.incident.name === "retardo_mayor");
    if (hasRetardoMayor) {
      total += getDayWeight(day.dayOfWeek);
    }
  }

  return total;
}

/**
 * Faltas directas por incidencia "falta".
 */
export function computeFaltasDirectas(
  dailies: DailyContext[],
  workdayPredicate: (day: DailyContext) => boolean,
): number {
  let total = 0;

  for (const day of dailies) {
    if (!workdayPredicate(day)) continue;

    const weight = getDayWeight(day.dayOfWeek);
    for (const di of day.incidents) {
      if (di.incident.name === "falta") {
        total += weight;
      }
    }
  }

  return total;
}

/**
 * Permiso sin goce = siempre 1 día por cada día con incidencia,
 * siempre que sea día laboral.
 */
export function computePermisosSinGoce(
  dailies: DailyContext[],
  workdayPredicate: (day: DailyContext) => boolean,
): number {
  let total = 0;

  for (const day of dailies) {
    if (!workdayPredicate(day)) continue;

    for (const di of day.incidents) {
      if (di.incident.name === "permiso_sin_goce") {
        total += 1;
      }
    }
  }

  return total;
}

/**
 * Omisión de entrada o salida = falta (peso 1/2/3).
 * Aplica solo cuando hay checador:
 * - digital_clock
 * - intercalated
 */
export function computeFaltasPorOmisiones(
  dailies: DailyContext[],
  workdayPredicate: (day: DailyContext) => boolean,
): number {
  let total = 0;

  for (const day of dailies) {
    if (!workdayPredicate(day)) continue;

    // Si ya tiene asistencia completa → no se evalúa omisión
    if (day.hasFullAttendance) continue;

    if (day.hasCheckInOnly || day.hasCheckOutOnly) {
      total += getDayWeight(day.dayOfWeek);
    }
  }

  return total;
}

/**
 * Faltas por INASISTENCIA:
 * Día laboral (según jornada) donde:
 *   - NO hay asistencias (ni completa ni parcial)
 *   - NO hay ninguna incidencia (de ningún tipo)
 *
 * SOLO aplica a:
 *   - digital_clock
 *   - intercalated
 *
 * attendance_list NO se penaliza por falta de asistencia, porque no checa.
 */
export function computeFaltasPorInasistencias(
  dailies: DailyContext[],
  attendanceType: AttendanceTypeName,
  workdayPredicate: (day: DailyContext) => boolean,
): number {
  if (attendanceType === "attendance_list") return 0;

  let total = 0;

  for (const day of dailies) {
    if (!workdayPredicate(day)) continue;

    const hasAnyAttendance = day.hasFullAttendance || day.hasCheckInOnly || day.hasCheckOutOnly;

    const hasAnyIncident = day.incidents.length > 0;

    if (!hasAnyAttendance && !hasAnyIncident) {
      total += getDayWeight(day.dayOfWeek);
    }
  }

  return total;
}

/**
 * Incapacidad: sumamos días de incapacidad del periodo y calculamos factor de salario.
 * Si total > 45, aplicamos factor según antigüedad.
 */
export function computeIncapacitySummary(dailies: DailyContext[]): IncapacitySummary {
  let totalDias = 0;
  let totalFactor = 0;

  for (const day of dailies) {
    for (const di of day.incidents) {
      if (di.incident.name === "incapacidad") {
        totalDias += 1;

        const percentage = di.incidentDay.percentage_salary ?? 0;
        totalFactor += percentage / 100;
      }
    }
  }

  if (totalDias === 0) {
    return {
      totalDiasIncapacidad: 0,
      factorSalario: 1,
    };
  }

  const factorPromedio = totalFactor / totalDias;

  return {
    totalDiasIncapacidad: totalDias,
    factorSalario: factorPromedio,
  };
}

/**
 * Resumen de descuentos (faltas) para un empleado en el periodo.
 * Se basa SIEMPRE en días laborales:
 *  - digital_clock: días laborales según JobScheduleEmployee
 *  - attendance_list: días laborales según JobScheduleEmployee (solo incidencias, no asiste)
 *  - intercalated: días laborales según JobScheduleCalendar (isScheduledDay)
 */
export function computeDiscountSummary(
  dailies: DailyContext[],
  schedules: Pick<JobScheduleEmployee, "start_day_id" | "end_day_id">[],
  attendanceType: AttendanceTypeName,
): DiscountSummary {
  const workdayPredicate = (day: DailyContext): boolean => {
    if (attendanceType === "intercalated") {
      return day.isScheduledDay;
    }
    return isWorkdayBySchedule(day.dayOfWeek, schedules);
  };

  const faltasDirectas = computeFaltasDirectas(dailies, workdayPredicate);
  const faltasPorRetardoMayor = computeFaltasPorRetardoMayor(dailies, workdayPredicate);

  const retardoUnits = computeRetardoUnits(dailies, workdayPredicate);
  const faltasPorRetardoNormal = Math.floor(retardoUnits / 3);

  const faltasPorOmisiones =
    attendanceType === "attendance_list" ? 0 : computeFaltasPorOmisiones(dailies, workdayPredicate);

  const permisosSinGoce = computePermisosSinGoce(dailies, workdayPredicate);

  const faltasPorInasistencias = computeFaltasPorInasistencias(dailies, attendanceType, workdayPredicate);

  const totalFaltas =
    faltasDirectas +
    faltasPorInasistencias +
    faltasPorRetardoMayor +
    faltasPorRetardoNormal +
    faltasPorOmisiones +
    permisosSinGoce;

  return {
    faltasDirectas,
    faltasPorInasistencias,
    faltasPorRetardoMayor,
    faltasPorRetardoNormal,
    faltasPorOmisiones,
    permisosSinGoce,
    totalFaltas,
  };
}

/**
 * Días a pagar:
 * - Siempre se parte de 15 días (quincena).
 * - Se descuentan SOLO faltas laborales (totalFaltas).
 * - Si totalFaltas = 0 → cobra la quincena completa (15),
 *   sin importar si trabaja L-V, fines de semana, o festivos.
 *
 * La diferencia entre tipos está en cómo se consideran días laborales:
 *  - digital_clock: JobScheduleEmployee + asistencias
 *  - attendance_list: JobScheduleEmployee + solo incidencias
 *  - intercalated: JobScheduleCalendar
 */
export function computeDiasAPagar(
  attendanceType: AttendanceTypeName,
  discountSummary: DiscountSummary,
  diasPeriodo = 15,
): number {
  const { totalFaltas } = discountSummary;

  if (totalFaltas === 0) return diasPeriodo;

  const dias = diasPeriodo - totalFaltas;
  return dias < 0 ? 0 : dias;
}
