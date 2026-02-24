import { IncidentTypes } from "@/common/constants/IncidentTypes";
import { INCIDENT_STATUS_ID } from "@/common/constants/IncidentStatus";

export async function resolveIncapacityContinuation({
  tx,
  employeeId,
  startDate,
}: {
  tx: any;
  employeeId: number;
  startDate: Date;
}): Promise<number> {
  const normalizedStart = new Date(startDate);
  normalizedStart.setHours(0, 0, 0, 0);

  // 1️⃣ Último día de incapacidad (CREADA, VALIDADA o APROBADA)
  const lastDay = await tx.employeeIncidentDays.findFirst({
    where: {
      date: { lt: normalizedStart },
      employee_incident: {
        employee_id: employeeId,
        incident: { name: IncidentTypes.INCAPACIDAD },
        incident_status_id: {
          in: [INCIDENT_STATUS_ID.CREADA, INCIDENT_STATUS_ID.VALIDADA, INCIDENT_STATUS_ID.APROBADA],
        },
      },
    },
    orderBy: { date: "desc" },
    select: { date: true },
  });

  if (!lastDay) return 0;

  const lastDate = new Date(lastDay.date);
  lastDate.setHours(0, 0, 0, 0);

  // 2️⃣ Debe ser día SIGUIENTE exacto
  const expectedNext = new Date(lastDate);
  expectedNext.setDate(expectedNext.getDate() + 1);

  if (expectedNext.getTime() !== normalizedStart.getTime()) {
    return 0;
  }

  // 3️⃣ ¿Trabajó el día previo?
  const attendance = await tx.employeeAttendance.findFirst({
    where: {
      employee_id: employeeId,
      active: true,
      NOT: {
        employee_attendance_incident: {
          some: {
            employee_incident: {
              incident: {
                name: IncidentTypes.INCAPACIDAD,
              },
            },
          },
        },
      },
      OR: [
        {
          check_in: { gte: lastDate, lt: normalizedStart },
        },
        {
          check_out: { gte: lastDate, lt: normalizedStart },
        },
      ],
    },
  });

  // 3️⃣ ¿Existe alguna incidencia que rompa continuidad?
  const breakingIncident = await tx.employeeIncidentDays.findFirst({
    where: {
      date: {
        gt: lastDate,
        lt: normalizedStart,
      },
      employee_incident: {
        employee_id: employeeId,
        incident: {
          name: { not: IncidentTypes.INCAPACIDAD },
        },
        incident_status_id: {
          in: [INCIDENT_STATUS_ID.CREADA, INCIDENT_STATUS_ID.VALIDADA, INCIDENT_STATUS_ID.APROBADA],
        },
      },
    },
  });

  if (breakingIncident) return 0;

  // 4️⃣ Contar días acumulados reales de incapacidad
  let count = 0;
  let cursor = new Date(lastDate);

  while (true) {
    const exists = await tx.employeeIncidentDays.findFirst({
      where: {
        date: cursor,
        employee_incident: {
          employee_id: employeeId,
          incident: { name: IncidentTypes.INCAPACIDAD },
          incident_status_id: {
            in: [INCIDENT_STATUS_ID.CREADA, INCIDENT_STATUS_ID.VALIDADA, INCIDENT_STATUS_ID.APROBADA],
          },
        },
      },
    });

    if (!exists) break;

    count++;

    // retrocede 1 día
    cursor.setDate(cursor.getDate() - 1);
  }

  return count;
}
