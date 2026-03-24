import { prisma } from "@/lib/prisma";
import {
  getYearsOfService,
  getActiveDaysFromSchedules,
  exceedsConsecutiveLimit,
  getVacationDayValue,
} from "@/app/api/common/utils.service";
import { HttpMessages } from "@/common/response/messages";
import { HttpResponse } from "@/common/response/model";
import { EmployeeService } from "@/app/api/services/employee.service";
import { validateTotalEmployeeIncidentDays } from "@/app/api/common/utils.service";
import { logger } from "@/lib/logger";
import { INCIDENT_TYPES_ID } from "@/common/constants/IncidentTypes";
import { INCIDENT_STATUS_ID } from "@/common/constants/IncidentStatus";
import { HolidayService } from "@/app/api/services/holiday.service";

interface IncidentRulesValidationResult {
  incident_id: number;
  employee_id: number;
  allowed_days: number;
  used_days: number;
  remaining_days: number;
  rule?: any;
  hasRules?: boolean;
}

export const IncidentRulesService = {
  async getUsedIncidentDays(employeeId: number, incidentId: number, startDate?: Date, endDate?: Date) {
    const where: any = {
      employee_incident: {
        employee_id: employeeId,
        incident_id: incidentId,
        active: true,
        incident_status_id: { lte: INCIDENT_STATUS_ID.APROBADA },
      },
    };
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    } else if (startDate) {
      where.date = { gte: startDate };
    } else if (endDate) {
      where.date = { lte: endDate };
    }
    const days = await prisma.employeeIncidentDays.findMany({
      where,
      select: { value: true },
    });
    return days.reduce((acc: number, d: { value: number | null }) => acc + (d.value || 1), 0);
  },

  async getApplicableRule(incidentId: number, employeeTypeId: number, yearsOfService: number, month: number) {
    const allRules = await prisma.incidentRules.findMany({
      where: {
        incident_id: incidentId,
        employee_type_id: employeeTypeId,
        active: true,
        min_years: { lte: yearsOfService },
        OR: [{ max_years: null }, { max_years: { gte: yearsOfService } }],
      },
      orderBy: [{ min_years: "desc" }],
    });

    const matchingRule = allRules.filter((rule) => {
      const { start_date, end_date } = rule as any;
      if (start_date === null && end_date === null) return true;
      if (start_date !== null && end_date !== null) {
        if (start_date <= end_date) return month >= start_date && month <= end_date;
        return month >= start_date || month <= end_date;
      }
      if (start_date !== null && end_date === null) return month >= start_date;
      if (start_date === null && end_date !== null) return month <= end_date;
      return false;
    });

    if (matchingRule.length === 0) return null;

    const monthBounded = matchingRule.find((r: any) => r.start_date !== null && r.end_date !== null);
    if (monthBounded) return monthBounded;

    const singleBound = matchingRule.find((r: any) => r.start_date !== null || r.end_date !== null);
    if (singleBound) return singleBound;

    return matchingRule.find((r: any) => r.start_date === null && r.end_date === null) || null;
  },

  async getEmployeeIncidentDates(employeeId: number, incidentTypeId: number): Promise<Date[]> {
    const incidents = await prisma.employeeIncidentDays.findMany({
      where: {
        employee_incident: {
          employee_id: employeeId,
          incident_id: incidentTypeId,
          active: true,
          incident_status_id: {
            in: [INCIDENT_STATUS_ID.APROBADA, INCIDENT_STATUS_ID.CREADA, INCIDENT_STATUS_ID.VALIDADA],
          },
        },
      },
      select: {
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });
    return incidents.map((i) => i.date);
  },

  async validateIncidentRule({
    employeeId,
    incidentId,
    startDate,
    endDate,
  }: {
    employeeId: number;
    incidentId: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const employee = await EmployeeService.getEmployeeById(employeeId);
    if (!employee || !employee.employee_hiring?.length) {
      return HttpResponse.failure(HttpMessages.employee.idNotFound, {});
    }

    const yearsOfService = getYearsOfService(employee.employee_hiring[0].start_job_date);
    const employeeTypeId = employee.employee_hiring[0].employee_type_id;

    if (employeeTypeId === null) {
      throw new Error("El empleado no tiene definido un tipo.");
    }

    const month = (startDate || new Date()).getMonth() + 1;
    const rule = await this.getApplicableRule(incidentId, employeeTypeId, yearsOfService, month);

    if (!rule) {
      return HttpResponse.failure(HttpMessages.incidentRules.notAllowedForEmployeeType, {});
    }

    /* if (!rule) {
      const hasRules = INCIDENT_TYPES_ID.VACACIONES === incidentId && yearsOfService === 0 ? true : false;
      return HttpResponse.success(
        hasRules ? HttpMessages.incidentRules.notMinYears : HttpMessages.incidentRules.notFound,
        {
          incident_id: incidentId,
          employee_id: employeeId,
          allowed_days: 0,
          used_days: 0,
          remaining_days: 0,
          hasRules: hasRules,
        },
      );
    } */

    let periodStart: Date | undefined;
    let periodEnd: Date | undefined;
    const baseYear = (startDate || new Date()).getFullYear();
    const setPeriodFromRuleWindow = (startMonth: number, endMonth: number) => {
      periodStart = new Date(baseYear, startMonth - 1, 1);
      periodEnd = new Date(baseYear, endMonth, 0);
    };
    let allowed_days = rule.max_days;

    if (incidentId === INCIDENT_TYPES_ID.PERMISO_ECONOMICO) {
      const annualRule = await prisma.incidentRules.findFirst({
        where: {
          incident_id: incidentId,
          employee_type_id: employeeTypeId,
          active: true,
          min_years: { lte: yearsOfService },
          OR: [{ max_years: null }, { max_years: { gte: yearsOfService } }],
          start_date: null,
          end_date: null,
        },
        orderBy: [{ min_years: "desc" }],
      });
      if (annualRule && (annualRule.max_days ?? 0) > (allowed_days ?? 0)) {
        allowed_days = annualRule.max_days;
        periodStart = undefined;
        periodEnd = undefined;
      } else if (rule.start_date && rule.end_date) {
        setPeriodFromRuleWindow(rule.start_date, rule.end_date);
      }
    } else if (incidentId === INCIDENT_TYPES_ID.LACTANCIA) {
      const lastIncidentDay = await prisma.employeeIncidentDays.findFirst({
        where: {
          employee_incident: {
            employee_id: employeeId,
            incident_id: INCIDENT_TYPES_ID.LACTANCIA,
            active: true,
            incident_status_id: { lte: INCIDENT_STATUS_ID.APROBADA },
            end_date: { lt: startDate },
          },
        },
        orderBy: {
          date: "desc",
        },
        select: {
          date: true,
        },
      });
      if (lastIncidentDay) {
        periodStart = startDate;
      }
    } else {
      if (rule.start_date && rule.end_date) {
        setPeriodFromRuleWindow(rule.start_date, rule.end_date);
      }
    }

    if (incidentId === INCIDENT_TYPES_ID.PATERNIDAD) {
      if (employee?.gender?.name !== "male") {
        return HttpResponse.success(HttpMessages.incidentRules.getSuccess, {
          incident_id: incidentId,
          employee_id: employeeId,
          allowed_days: 0,
          used_days: 0,
          remaining_days: 0,
          hasRules: true,
          rule,
        });
      }
    }

    if (incidentId === INCIDENT_TYPES_ID.LACTANCIA && employee?.gender?.name !== "female") {
      return HttpResponse.success(HttpMessages.incidentRules.getSuccess, {
        incident_id: incidentId,
        employee_id: employeeId,
        allowed_days: 0,
        used_days: 0,
        remaining_days: 0,
        hasRules: true,
        rule,
      });
    }

    const used_days = await this.getUsedIncidentDays(employeeId, incidentId, periodStart, periodEnd);
    const remaining_days = Math.max(0, allowed_days - used_days);

    return HttpResponse.success(HttpMessages.incidentRules.getSuccess, {
      incident_id: incidentId,
      employee_id: employeeId,
      allowed_days,
      used_days,
      remaining_days,
      hasRules: true,
      rule,
    });
  },

  async validateIncidentRules(body: any) {
    try {
      const employee = await EmployeeService.getEmployeeById(Number(body.employeeId));
      const ruleValidation = await this.validateIncidentRule({
        employeeId: Number(body.employeeId),
        incidentId: Number(body.incidentId),
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      });

      if (!ruleValidation.success) {
        return ruleValidation;
      }

      const responseObject = ruleValidation.responseObject as IncidentRulesValidationResult;

      if (responseObject.hasRules === false) {
        return null;
      }

      if (responseObject.remaining_days < 1) {
        return HttpResponse.failure(HttpMessages.incidentRules.notAvailableDays, {});
      }

      if (!body.incidentDates?.length) {
        return null;
      }

      const requestedDays = body.incidentDates.length;

      if (requestedDays < (responseObject.rule?.min_days ?? 1)) {
        return HttpResponse.failure("Debe solicitar al menos los días mínimos permitidos", {
          requestedDays,
          minDays: responseObject.rule?.min_days ?? 1,
        });
      }

      if (requestedDays > responseObject.allowed_days) {
        return HttpResponse.failure(HttpMessages.incidentRules.notAvailableDays, {
          requestedDays,
          allowedDays: responseObject.allowed_days,
        });
      }

      const jobSchedules = await EmployeeService.getCurrentJobSchedule(Number(body.employeeId));
      const hasAvailableDays = await validateTotalEmployeeIncidentDays(
        body.incidentDates,
        jobSchedules,
        responseObject.used_days,
        responseObject.allowed_days,
        Number(body.incidentId),
      );

      if (!hasAvailableDays) {
        return HttpResponse.failure(HttpMessages.incidentRules.notAvailableDays, {});
      }

      if (Number(body.incidentId) === INCIDENT_TYPES_ID.LICENCIA_MEDICA) {
        return HttpResponse.success(HttpMessages.incidentRules.getSuccess, responseObject);
      }

      if (Number(body.incidentId) === INCIDENT_TYPES_ID.PERMISO_ECONOMICO) {
        if (!employee || !employee.employee_hiring?.length) {
          return HttpResponse.failure(HttpMessages.employee.idNotFound, {});
        }
        const hiring = employee.employee_hiring[0];
        const yearsOfService = getYearsOfService(hiring.start_job_date);
        const employeeTypeId = hiring.employee_type_id;

        if (employeeTypeId === null) {
          throw new Error("El empleado no tiene definido un tipo.");
        }

        const existingDates = await this.getEmployeeIncidentDates(Number(body.employeeId), Number(body.incidentId));
        if (exceedsConsecutiveLimit(existingDates, body.incidentDates, 3)) {
          return HttpResponse.failure(HttpMessages.incidentRules.notConsecutiveDays, {});
        }

        const dates = body.incidentDates
          .map((d: string) => new Date(d))
          .sort((a: Date, b: Date) => a.getTime() - b.getTime());
        const daysActive = getActiveDaysFromSchedules(jobSchedules);
        const monthGroups = new Map<string, Date[]>();

        for (const d of dates) {
          const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
          const arr = monthGroups.get(key) || [];
          arr.push(d);
          monthGroups.set(key, arr);
        }

        for (const [key, groupDates] of Array.from(monthGroups.entries())) {
          const [yearStr, monthStr] = key.split("-");
          const year = Number(yearStr);
          const month = Number(monthStr);
          const periodStart = new Date(year, month - 1, 1);
          const periodEnd = new Date(year, month, 0);
          const usedInMonth = await this.getUsedIncidentDays(
            Number(body.employeeId),
            INCIDENT_TYPES_ID.PERMISO_ECONOMICO,
            periodStart,
            periodEnd,
          );
          let toInsert = 0;
          for (const d of groupDates) {
            const isHoliday = await HolidayService.isHoliday(d);
            const dayVal = daysActive.has(d.getDay()) ? getVacationDayValue(d, isHoliday) : 1;
            toInsert += dayVal;
          }

          let monthlyCap = 3;
          const monthlyRule = await this.getApplicableRule(
            INCIDENT_TYPES_ID.PERMISO_ECONOMICO,
            employeeTypeId,
            yearsOfService,
            month,
          );
          if (
            monthlyRule &&
            monthlyRule.start_date !== null &&
            monthlyRule.end_date !== null &&
            monthlyRule.start_date === month &&
            monthlyRule.end_date === month
          ) {
            monthlyCap = monthlyRule.max_days;
          }

          if ((usedInMonth ?? 0) + toInsert > monthlyCap) {
            return HttpResponse.failure(HttpMessages.incidentRules.notAvailableDays, {});
          }
        }

        for (const d of dates) {
          const prev = new Date(d);
          prev.setDate(prev.getDate() - 1);
          const next = new Date(d);
          next.setDate(next.getDate() + 1);
          if ((await HolidayService.isHoliday(prev)) || (await HolidayService.isHoliday(next))) {
            return HttpResponse.failure(HttpMessages.incidentRules.notAdjacentHolidayDays, {});
          }
        }

        const minDate = new Date(dates[0]);
        minDate.setDate(minDate.getDate() - 1);
        const maxDate = new Date(dates[dates.length - 1]);
        maxDate.setDate(maxDate.getDate() + 1);
        const vacationDays = await prisma.employeeIncidentDays.findMany({
          where: {
            date: { gte: minDate, lte: maxDate },
            employee_incident: {
              employee_id: Number(body.employeeId),
              incident_id: INCIDENT_TYPES_ID.VACACIONES,
              active: true,
              incident_status_id: { lte: INCIDENT_STATUS_ID.APROBADA },
            },
          },
          select: { date: true },
        });
        const vacDates = new Set(vacationDays.map((v) => new Date(v.date).toDateString()));
        for (const d of dates) {
          const prev = new Date(d);
          prev.setDate(prev.getDate() - 1);
          const next = new Date(d);
          next.setDate(next.getDate() + 1);
          if (vacDates.has(prev.toDateString()) || vacDates.has(next.toDateString())) {
            return HttpResponse.failure(HttpMessages.incidentRules.notAdjacentVacationDays, {});
          }
        }
      }

      if (body.incidentId === INCIDENT_TYPES_ID.PATERNIDAD) {
        if (employee?.gender?.name !== "male") {
          return HttpResponse.failure(HttpMessages.incidentRules.notMaleEmployee, {});
        }
      }

      if (body.incidentId === INCIDENT_TYPES_ID.LACTANCIA) {
        if (employee?.gender?.name !== "female") {
          return HttpResponse.failure(HttpMessages.incidentRules.notFemaleEmployee, {});
        }
      }

      return null;
    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack });
      return HttpResponse.failure(HttpMessages.error.internalServerError, {});
    }
  },
};
