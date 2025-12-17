import { prisma } from "@/lib/prisma";
import type { IJobScheduleCalendar } from "@/app/api/job-schedule-calendar/create/types";
import { IJobScheduleCalendarFilters } from "@/app/api/job-schedule-calendar/types";

function normalizeDate(dateStr: string) {
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // ← elimina zona horaria
}

export const JobScheduleCalendarService = {
  async getJobScheduleCalendar(filters: IJobScheduleCalendarFilters) {
    const { search = null, from = null, to = null, page = 1, limit = 10 } = filters;

    const skip = (page - 1) * limit;

    const employeeWhere: any = {};

    if (search) {
      const terms = search.split(" ").filter(Boolean);

      employeeWhere.AND = terms.map((term: string) => ({
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

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where: employeeWhere,
        skip,
        take: Number(limit),
        orderBy: { id: "desc" },
        select: {
          id: true,
          name: true,
          paternal_last_name: true,
          maternal_last_name: true,
          number_employee: true,
          birthday: true,
          rfc: true,
          curp: true,
          gender_id: true,
          status_employee_id: true,
          active: true,
          created_at: true,
          updated_at: true,
          status_employee: true,
          gender: true,
          employee_ascriptions: {
            select: {
              id: true,
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
          job_schedule_calendar: {
            where: {
              active: true,
              date: {
                ...(from && { gte: normalizeDate(from) }),
                ...(to && { lte: normalizeDate(to) }),
              },
            },
            orderBy: [{ date: "asc" }],
            select: {
              id: true,
              date: true,
              check_in: true,
              check_out: true,
              start_hour_id: true,
              end_hour_id: true,
              start_hour: {
                select: {
                  id: true,
                  display_name: true,
                },
              },
              end_hour: {
                select: {
                  id: true,
                  display_name: true,
                },
              },
            },
          },
        },
      }),

      prisma.employee.count({ where: employeeWhere }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: employees,
      total,
      totalPages,
      currentPage: page,
    };
  },

  async saveJobScheduleCalendar(payload: IJobScheduleCalendar, createdById: number) {
    const { employees, schedules } = payload;

    return prisma.$transaction(async (tx) => {
      const results = [];
      const warnings: string[] = [];

      const hourIds = schedules.flatMap((s) => [Number(s.startHourId), Number(s.endHourId)]);

      const hoursCatalog = await tx.hour.findMany({
        where: { id: { in: hourIds } },
      });

      const getHourFromId = (id: string) => {
        const h = hoursCatalog.find((x) => x.id === Number(id));
        return h?.display_name;
      };

      const payloadDates = schedules.map((s) => new Date(s.date));
      const minDate = new Date(Math.min(...payloadDates));
      const maxDate = new Date(Math.max(...payloadDates));

      const scheduleDates = schedules.map((s) => s.date);
      const datesToKeep = new Set(scheduleDates);

      for (const employeeId of employees) {
        const existing = await tx.jobScheduleCalendar.findMany({
          where: {
            employee_id: employeeId,
            active: true,
            date: {
              gte: minDate,
              lte: maxDate,
            },
          },
        });

        const datesToDisable = existing.filter((e) => {
          const dateStr = e.date.toISOString().split("T")[0];
          return !datesToKeep.has(dateStr);
        });

        for (const old of datesToDisable) {
          const usedInAttendance = await tx.employeeAttendance.findFirst({
            where: {
              job_schedule_calendar_id: old.id,
              active: true,
            },
          });

          if (usedInAttendance) {
            const msg = `No se puede desactivar la fecha ${old.date.toISOString()} (ID ${old.id}) porque ya tiene asistencia registrada`;
            warnings.push(msg);
            continue;
          }

          await tx.jobScheduleCalendar.update({
            where: { id: old.id },
            data: { active: false },
          });
        }

        for (const c of schedules) {
          const { date, startHourId, endHourId } = c;

          const startHour = getHourFromId(startHourId);
          const endHour = getHourFromId(endHourId);

          if (!startHour || !endHour) {
            throw new Error(`HourId inválido: ${startHourId} o ${endHourId}`);
          }

          const baseDate = new Date(date);
          const checkIn = new Date(`${date}T${startHour}`);
          let checkOut = new Date(`${date}T${endHour}`);

          if (endHour < startHour) {
            checkOut.setDate(checkOut.getDate() + 1);
          }

          const prev = existing.find((e) => e.date.toISOString().split("T")[0] === date);

          const isSame =
            prev &&
            prev.check_in.toISOString() === checkIn.toISOString() &&
            prev.check_out.toISOString() === checkOut.toISOString();

          if (isSame) {
            continue;
          }

          if (prev) {
            const usedInAttendance = await tx.employeeAttendance.findFirst({
              where: {
                job_schedule_calendar_id: prev.id,
                active: true,
              },
            });

            if (usedInAttendance) {
              const msg = `No se puede modificar la fecha ${date} porque ya tiene asistencias registradas. Se mantiene la configuración anterior.`;
              warnings.push(msg);
              continue;
            }

            await tx.jobScheduleCalendar.update({
              where: { id: prev.id },
              data: { active: false },
            });
          }

          const insert = await tx.jobScheduleCalendar.create({
            data: {
              employee_id: employeeId,
              date: baseDate,
              check_in: checkIn,
              check_out: checkOut,
              start_hour_id: Number(startHourId),
              end_hour_id: Number(endHourId),
              active: true,
              created_by_id: createdById,
            },
          });

          results.push(insert);
        }
      }

      return { results, warnings };
    });
  },
};
