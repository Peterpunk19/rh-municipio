import { prisma } from "@/lib/prisma";
import { createEmployeeSeed } from "./createEmployee";
import { createAttendance } from "./createAttendance";
import { generateMonthlyAttendances } from "./generateAttendances";
import { withTime } from "@/common/utils";
import { generateIntercalatedAttendances } from "@/app/api/employee-payroll/tests/seeds/helpers/generateIntercalatedAttendances";

interface AntiguedadConfig {
  years: number;
  months?: number;
}

interface PaymentStep {
  days: number;
  percentage: number;
}

interface IncapacityScenarioParams {
  numberEmployee?: string;
  employeeId?: number;
  name?: string;
  antiguedad?: AntiguedadConfig;
  totalDays: number;
  paymentScheme: PaymentStep[];
  attendanceType?: "attendance_list" | "digital_clock" | "intercalated";
  startDate?: Date;
}

function startOfCurrentMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function calculateHiringDate(base: Date, antiguedad: AntiguedadConfig): Date {
  const d = new Date(base);
  d.setFullYear(d.getFullYear() - antiguedad.years);
  if (antiguedad.months) {
    d.setMonth(d.getMonth() - antiguedad.months);
  }
  return d;
}

export async function createIncapacityScenario(params: IncapacityScenarioParams) {
  const {
    numberEmployee,
    employeeId,
    name = "Incapacidad",
    antiguedad,
    totalDays,
    paymentScheme,
    attendanceType = "attendance_list",
    startDate,
  } = params;

  /* =========================
     1️⃣ Fecha base
     ========================= */
  const incapacityStart = startDate ?? startOfCurrentMonth();

  /* =========================
     2️⃣ Obtener o crear empleado
     ========================= */
  let employee, location, ascription, employeeAttendanceType;

  if (employeeId) {
    employee = await prisma.employee.findUniqueOrThrow({ where: { id: employeeId } });

    location = await prisma.employeeLocation.findFirst({
      where: { employee_id: employee.id, active: true },
    });

    ascription = await prisma.employeeAscriptions.findFirst({
      where: { employee_id: employee.id, active: true },
    });

    employeeAttendanceType = await prisma.employeeAttendanceType.findFirst({
      where: { employee_id: employee.id, active: true },
    });
  } else {
    if (!numberEmployee) {
      throw new Error("numberEmployee es requerido si no se pasa employeeId");
    }

    const seed = await createEmployeeSeed({
      numberEmployee,
      name,
      attendanceType,
    });

    employee = seed.employee;
    location = seed.location;
    ascription = seed.ascription;
    employeeAttendanceType = seed.employeeAttendanceType;
  }

  /* =========================
     3️⃣ Ajustar antigüedad (solo si aplica)
     ========================= */
  if (antiguedad) {
    const hiringStart = calculateHiringDate(incapacityStart, antiguedad);

    await prisma.employeeHiring.updateMany({
      where: { employee_id: employee.id },
      data: { start_job_date: hiringStart },
    });
  }

  /* =========================
     4️⃣ Jornada base
     ========================= */
  const { scheduleMap } = await generateMonthlyAttendances({
    employeeId: employee.id,
    locationId: location!.id,
    ascriptionId: ascription!.id,
    attendanceTypeId: employeeAttendanceType!.id,
    year: incapacityStart.getFullYear(),
    month: incapacityStart.getMonth() + 1,
    untilDay: totalDays,
    jornadas: {
      lunesViernes: {
        weekdays: [1, 2, 3, 4, 5],
        startDay: 1,
        endDay: 5,
        startHourId: 17,
        endHourId: 33,
        checkIn: "08:00",
        checkOut: "16:00",
      },
    },
    createAttendances: false,
  });

  const scheduleId = scheduleMap["lunesViernes"];

  /* =========================
     5️⃣ Incidencia
     ========================= */
  const incident = await prisma.incident.findFirst({
    where: { name: "incapacidad" },
  });

  if (!incident) throw new Error("Incidente 'incapacidad' no existe");

  const ei = await prisma.employeeIncidents.create({
    data: {
      employee_id: employee.id,
      incident_id: incident.id,
      incident_status_id: 2,
      folio: `${employee.id}-${Date.now()}`,
      start_date: incapacityStart,
      end_date: new Date(
        incapacityStart.getFullYear(),
        incapacityStart.getMonth(),
        incapacityStart.getDate() + totalDays - 1,
      ),
      description: `Incapacidad ${totalDays} días`,
      created_by_id: employee.id,
      active: true,
    },
  });

  /* =========================
     6️⃣ Días de incapacidad
     ========================= */
  let current = new Date(incapacityStart);
  let dayCounter = 1;

  for (const step of paymentScheme) {
    for (let i = 0; i < step.days && dayCounter <= totalDays; i++) {
      await prisma.employeeIncidentDays.create({
        data: {
          employee_incident_id: ei.id,
          date: new Date(current),
          value: 1,
          percentage_salary: step.percentage,
        },
      });

      const checkIn = withTime(current, 8, 0).toString();
      const checkOut = withTime(current, 16, 0).toString();

      const attendance = await createAttendance(employee.id, location!.id, ascription!.id, employeeAttendanceType!.id, {
        checkIn,
        checkOut,
        jobScheduleEmployeeId: scheduleId,
        jobScheduleCalendarId: null,
      });

      await prisma.employeeAttendanceIncident.create({
        data: {
          employee_attendance_id: attendance.id,
          employee_incident_id: ei.id,
        },
      });

      current.setDate(current.getDate() + 1);
      dayCounter++;
    }
  }

  return {
    employee,
    incident: ei,
    incapacityStart,
  };
}

interface EmployeeSeed {
  numberEmployee: string;
  name: string;
  attendanceType: "intercalated";
}

interface JornadaConfig {
  startHourId: number;
  endHourId: number;
  checkIn: string;
  checkOut: string;
}

interface IntercalatedIncapacityScenarioParams {
  employeeSeed: {
    numberEmployee: string;
    name: string;
    attendanceType: "intercalated";
  };
  antiguedad?: AntiguedadConfig;
  totalDays: number;
  paymentScheme: PaymentStep[];
  scheduleDays: string[];
  excludeDays?: string[];
  jornada: JornadaConfig;
  incident: {
    name: string;
  };
  startDate?: Date;
}

export async function createIntercalatedIncapacityScenario(params: IntercalatedIncapacityScenarioParams) {
  const {
    employeeSeed,
    antiguedad,
    totalDays,
    paymentScheme,
    scheduleDays,
    excludeDays = [],
    jornada,
    incident,
    startDate,
  } = params;

  const incapacityStart = startDate ?? startOfCurrentMonth();

  const { employee, location, ascription, employeeAttendanceType } = await createEmployeeSeed(employeeSeed);

  if (antiguedad) {
    const hiringStart = calculateHiringDate(new Date(), antiguedad);

    await prisma.employeeHiring.updateMany({
      where: { employee_id: employee.id },
      data: { start_job_date: hiringStart },
    });
  }

  const calendarResults = await generateIntercalatedAttendances({
    employeeId: employee.id,
    locationId: location.id,
    ascriptionId: ascription.id,
    attendanceTypeId: employeeAttendanceType.id,
    scheduleDays,
    excludeDays,
    jornada,
  });

  const calendarMap = new Map(calendarResults.map((r) => [r.date, r.calendarId]));

  const incidentEntity = await prisma.incident.findFirst({
    where: { name: incident.name },
  });

  if (!incidentEntity) {
    throw new Error(`Incidente '${incident.name}' no existe`);
  }

  const ei = await prisma.employeeIncidents.create({
    data: {
      employee_id: employee.id,
      incident_id: incidentEntity.id,
      incident_status_id: 2,
      folio: `${employee.id}-${Date.now()}`,
      start_date: incapacityStart,
      end_date: new Date(
        incapacityStart.getFullYear(),
        incapacityStart.getMonth(),
        incapacityStart.getDate() + totalDays - 1,
      ),
      description: `Incapacidad ${totalDays} días`,
      created_by_id: employee.id,
      active: true,
    },
  });

  let current = new Date(incapacityStart);
  let dayCounter = 1;

  for (const step of paymentScheme) {
    for (let i = 0; i < step.days && dayCounter <= totalDays; i++) {
      const dayStr = current.toISOString().slice(0, 10);
      const calendarId = calendarMap.get(dayStr);

      await prisma.employeeIncidentDays.create({
        data: {
          employee_incident_id: ei.id,
          date: new Date(current),
          value: 1,
          percentage_salary: step.percentage,
        },
      });

      const attendance = await createAttendance(employee.id, location.id, ascription.id, employeeAttendanceType.id, {
        checkIn: `${dayStr}T${jornada.checkIn}:00`,
        checkOut: `${dayStr}T${jornada.checkOut}:00`,
        jobScheduleEmployeeId: null,
        jobScheduleCalendarId: calendarId,
      });

      await prisma.employeeAttendanceIncident.create({
        data: {
          employee_attendance_id: attendance.id,
          employee_incident_id: ei.id,
        },
      });

      current.setDate(current.getDate() + 1);
      dayCounter++;
    }
  }

  return {
    employee,
    location,
    ascription,
    employeeAttendanceType,
    incident: ei,
    incapacityStart,
    results: calendarResults,
  };
}
