import { prisma } from "@/lib/prisma";
import { getYearsOfService } from "@/app/api/common/utils.service";
import { HttpMessages } from "@/common/response/messages";
import { HttpResponse } from "@/common/response/model";
import { EmployeeService } from "@/app/api/services/employee.service";
import { validateTotalEmployeeIncidentDays } from "@/app/api/common/utils.service";
import { logger } from "@/lib/logger";
import { INCIDENT_TYPES_ID } from "@/common/constants/IncidentTypes";
import { INCIDENT_STATUS_ID } from "@/common/constants/IncidentStatus";

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

    const matchingRule = allRules.find((rule) => {
      const { start_date, end_date } = rule;

      if (start_date === null && end_date === null) {
        return true;
      }

      if (start_date !== null && end_date !== null) {
        if (start_date <= end_date) {
          return month >= start_date && month <= end_date;
        } else {
          return month >= start_date || month <= end_date;
        }
      }

      if (start_date !== null && end_date === null) {
        return month >= start_date;
      }

      if (start_date === null && end_date !== null) {
        return month <= end_date;
      }

      return false;
    });

    return matchingRule || null;
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
    const month = (startDate || new Date()).getMonth() + 1;
    const rule = await this.getApplicableRule(incidentId, employeeTypeId, yearsOfService, month);

    if (!rule) {
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
    }

    let periodStart: Date | undefined;
    let periodEnd: Date | undefined;
    if (rule.start_date && rule.end_date) {
      const year = (startDate || new Date()).getFullYear();
      periodStart = new Date(year, rule.start_date - 1, 1);
      periodEnd = new Date(year, rule.end_date, 0);
    }
    const used_days = await this.getUsedIncidentDays(employeeId, incidentId, periodStart, periodEnd);
    const allowed_days = rule.days;
    const remaining_days = allowed_days - used_days;
    return HttpResponse.success(HttpMessages.incidentRules.getSuccess, {
      incident_id: incidentId,
      employee_id: employeeId,
      allowed_days,
      used_days,
      remaining_days,
      hasRules: true,
    });
  },

  async validateIncidentRules(body: any) {
    try {
      const ruleValidation = await this.validateIncidentRule({
        employeeId: Number(body.employeeId),
        incidentId: Number(body.incidentId),
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      });

      if (!ruleValidation?.success) {
        return null;
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

      const jobSchedules = await EmployeeService.getCurrentJobSchedule(Number(body.employeeId));
      const hasAvailableDays = await validateTotalEmployeeIncidentDays(
        body.incidentDates,
        jobSchedules,
        responseObject.used_days,
        responseObject.allowed_days,
      );

      if (!hasAvailableDays) {
        return HttpResponse.failure(HttpMessages.incidentRules.notAvailableDays, {});
      }

      return null;
    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack });
      return HttpResponse.failure(HttpMessages.error.internalServerError, {});
    }
  },
};
