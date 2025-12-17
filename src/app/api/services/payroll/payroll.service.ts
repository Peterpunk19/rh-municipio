import { PrismaClient, EmployeeHiring, EmployeeAscriptions, Attendance, JobScheduleEmployee } from "@prisma/client";
import {
  AttendanceTypeName,
  DailyContext,
  computeDiscountSummary,
  computeIncapacitySummary,
  computeDiasAPagar,
} from "./rules";

const prisma = new PrismaClient();

export interface PayrollParams {
  startDate: Date;
  endDate: Date;
  search: string | null | undefined;
  page: number;
  limit: number;
}

export interface PayrollResult {
  employeeId: number;
  numberEmployee: string;
  categoryDisplayName: string;
  employeeTypeDisplayName: string;
  fullname: string;
  attendanceType: AttendanceTypeName;
  antiguedadYears: number;
  diasPeriodo: number;
  diasAPagar: number;
  discountSummary: ReturnType<typeof computeDiscountSummary>;
  incapacitySummary: ReturnType<typeof computeIncapacitySummary>;
  salarioBase: number;
  salarioAjustado: number;
  salarioFinal: number;
}

function getAttendanceTypeName(att: Attendance | null | undefined): AttendanceTypeName {
  if (!att) return "digital_clock";

  if (att.name === "attendance_list") return "attendance_list";
  if (att.name === "intercalated") return "intercalated";
  return "digital_clock";
}

function jsDayToDayId(jsDay: number): number {
  return jsDay === 0 ? 7 : jsDay;
}

function buildDateRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  current.setHours(0, 0, 0, 0);

  const last = new Date(end);
  last.setHours(0, 0, 0, 0);

  while (current <= last) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function calculateAntiguedadYears(hiring: EmployeeHiring, endDate: Date): number {
  const start = hiring.start_job_date;
  const diffMs = endDate.getTime() - start.getTime();
  const years = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, Math.floor(years));
}

function getLogicalAttendanceDate(ea: any, schedulesById: Map<number, JobScheduleEmployee>): Date | null {
  const ci: Date | null = ea.check_in ? new Date(ea.check_in) : null;
  const co: Date | null = ea.check_out ? new Date(ea.check_out) : null;

  const scheduleId: number | undefined = ea.job_schedule_employee_id ?? ea.jobScheduleEmployeeId;
  const schedule = scheduleId ? schedulesById.get(scheduleId) : undefined;

  if (!schedule) {
    const base = ci ?? co;
    return base ? new Date(base.getFullYear(), base.getMonth(), base.getDate()) : null;
  }

  const isNightShift = schedule.end_hour_id < schedule.start_hour_id;

  if (!isNightShift) {
    const base = ci ?? co;
    return base ? new Date(base.getFullYear(), base.getMonth(), base.getDate()) : null;
  }

  if (ci) {
    return new Date(ci.getFullYear(), ci.getMonth(), ci.getDate());
  }

  if (co) {
    const prev = new Date(co);
    prev.setDate(prev.getDate() - 1);
    return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate());
  }

  return null;
}

function buildDailyContextsForEmployee(params: PayrollParams, employeeData: any): DailyContext[] {
  const { startDate, endDate } = params;
  const dates = buildDateRange(startDate, endDate);

  const attendances = (employeeData.employee_attendance ?? []) as any[];
  const incidents = (employeeData.employee_incidents ?? []) as any[];
  const calendars = (employeeData.job_schedule_calendar ?? []) as any[];
  const jobSchedules = (employeeData.job_schedule_employee ?? []) as JobScheduleEmployee[];

  const schedulesById = new Map<number, JobScheduleEmployee>();
  for (const js of jobSchedules) {
    schedulesById.set(js.id, js);
  }

  const attendanceByKey = new Map<string, any[]>();

  for (const ea of attendances) {
    const logicalDate = getLogicalAttendanceDate(ea, schedulesById);
    if (!logicalDate) continue;

    const key = logicalDate.toISOString().slice(0, 10);
    const list = attendanceByKey.get(key) ?? [];
    list.push(ea);
    attendanceByKey.set(key, list);
  }

  const dailies: DailyContext[] = [];

  for (const date of dates) {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();

    const dayOfWeek = jsDayToDayId(date.getDay());

    const key = date.toISOString().slice(0, 10);
    const todayAttendances = attendanceByKey.get(key) ?? [];

    const hasFullAttendance = todayAttendances.some((ea) => ea.check_in && ea.check_out);
    const hasCheckInOnly = todayAttendances.some((ea) => ea.check_in && !ea.check_out);
    const hasCheckOutOnly = todayAttendances.some((ea) => !ea.check_in && ea.check_out);

    const isScheduledDay = calendars.some((jc: any) => {
      const c = new Date(jc.date);
      return c.getFullYear() === y && c.getMonth() === m && c.getDate() === d;
    });

    const dayIncidents = incidents.flatMap((ei: any) => {
      return ei.employee_incident_days
        .filter((eid: any) => {
          const ed = new Date(eid.date);
          return ed.getFullYear() === y && ed.getMonth() === m && ed.getDate() === d;
        })
        .map((eid: any) => ({
          date,
          incident: ei.incident,
          incidentDay: eid,
        }));
    });

    dailies.push({
      date,
      dayOfWeek,
      hasFullAttendance,
      hasCheckInOnly,
      hasCheckOutOnly,
      isScheduledDay,
      incidents: dayIncidents,
    });
  }

  return dailies;
}

export async function calculatePayroll(params: PayrollParams) {
  const { startDate, endDate, search } = params;
  const diasPeriodo = 15;

  const page = params.page ?? 1;
  const limit = params.limit ?? 20;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (search && search.trim() !== "") {
    const terms = search.split(" ").filter(Boolean);

    whereClause.AND = terms.map((term) => ({
      OR: [
        { name: { contains: term } },
        { paternal_last_name: { contains: term } },
        { maternal_last_name: { contains: term } },
        { rfc: { contains: term } },
        { curp: { contains: term } },
        { number_employee: { contains: term } },
      ],
    }));
  }

  // 🔥 TOTAL SIN PAGINAR
  const total = await prisma.employee.count({
    where: {
      active: true,
      ...(whereClause.AND ? { AND: whereClause.AND } : {}),
    },
  });

  // 🔥 CONSULTA PAGINADA
  const employees = await prisma.employee.findMany({
    where: {
      active: true,
      ...(whereClause.AND ? { AND: whereClause.AND } : {}),
    },
    include: {
      employee_ascriptions: {
        select: {
          direccion: {
            select: {
              id: true,
              name: true,
              display_name: true,
              secretaria: {
                select: {
                  id: true,
                  name: true,
                  display_name: true,
                },
              },
            },
          },
        },
      },
      employee_hiring: {
        where: { active: true },
        include: {
          category: true,
          employee_type: true,
        },
      },
      employee_attendance_type: {
        where: { active: true },
        include: { attendance: true },
      },
      employee_attendance: {
        where: {
          active: true,
          OR: [{ check_in: { gte: startDate, lte: endDate } }, { check_out: { gte: startDate, lte: endDate } }],
        },
      },
      employee_incidents: {
        where: {
          active: true,
          incident_status_id: 2,
          start_date: { lte: endDate },
          end_date: { gte: startDate },
        },
        include: {
          incident: true,
          employee_incident_days: true,
        },
      },
      job_schedule_calendar: {
        where: {
          active: true,
          date: { gte: startDate, lte: endDate },
        },
        include: {
          start_hour: true,
          end_hour: true,
        },
      },
      job_schedule_employee: true,
    },
    skip,
    take: limit,
  });

  const cetRows = await prisma.categoryEmployeeType.findMany({
    where: { active: true },
    include: {
      category: true,
      employee_type: true,
      config_year: true,
    },
  });

  const results: PayrollResult[] = [];

  for (const e of employees) {
    const hiring = e.employee_hiring[0] as EmployeeHiring | undefined;
    if (!hiring || !hiring.category_id || !hiring.employee_type_id) continue;

    const ascription = e.employee_ascriptions[0] as EmployeeAscriptions | undefined;

    const cet = cetRows.find(
      (row) =>
        row.category_id === hiring.category_id &&
        row.employee_type_id === hiring.employee_type_id &&
        (!row.config_year || row.config_year.year === endDate.getFullYear()),
    );

    const salarioBase = cet?.salary ? Number(cet.salary) : 0;

    const attTypeRecord = e.employee_attendance_type[0];
    const attendanceTypeName = getAttendanceTypeName(attTypeRecord?.attendance);

    const antiguedadYears = calculateAntiguedadYears(hiring, endDate);

    const dailies = buildDailyContextsForEmployee(params, e);

    const schedules: Pick<JobScheduleEmployee, "start_day_id" | "end_day_id">[] = e.job_schedule_employee.map(
      (js: JobScheduleEmployee) => ({
        start_day_id: js.start_day_id,
        end_day_id: js.end_day_id,
      }),
    );

    const discountSummary = computeDiscountSummary(dailies, schedules, attendanceTypeName);

    const incapacitySummary = computeIncapacitySummary(dailies, antiguedadYears);

    const salarioAjustado = salarioBase * incapacitySummary.factorSalario;
    const diasAPagar = computeDiasAPagar(attendanceTypeName, discountSummary, diasPeriodo);
    const salarioFinal = (diasAPagar / diasPeriodo) * salarioAjustado;

    const fullname = `${e.name} ${e.paternal_last_name} ${e.maternal_last_name}`.trim();

    results.push({
      employeeId: e.id,
      numberEmployee: e.number_employee,
      secretariaDisplayName: ascription?.direccion?.secretaria?.display_name,
      direccionDisplayName: ascription?.direccion?.display_name,
      employeeTypeDisplayName: cet?.employee_type?.display_name,
      employeeTypeDisplayName: cet?.employee_type?.display_name,
      categoryDisplayName: cet?.category?.display_name,
      fullname,
      attendanceType: attendanceTypeName,
      antiguedadYears,
      diasPeriodo,
      diasAPagar,
      discountSummary,
      incapacitySummary,
      salarioBase,
      salarioAjustado,
      salarioFinal,
    });
  }

  const totalPages = Math.ceil(total / limit);

  return {
    total,
    totalPages,
    currentPage: page,
    data: results,
  };
}
