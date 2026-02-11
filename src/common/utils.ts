import bcryptjs from "bcryptjs";
import type React from "react";
import { formatDateStringTS } from "@/utils/formatter";
import { prisma } from "@/lib/prisma";
import { HttpMessages } from "@/common/response/messages";
import { HttpResponse } from "@/common/response/model";

import type { WhereKey } from "@/interfaces/WhereConfig";
import { handleHttpResponse } from "@/common/response/handler";
import { ROLES, ROLES_ID, RoleValue } from "@/common/constants/Roles";
import { ROLES_ID_VALUES } from "@/common/constants/Roles";

export const encryptPassword = async (password: string): Promise<string> => {
  return await bcryptjs.hash(password, 10);
};

export const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

export const formatToUpperAlphaNum = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.target.value = e.target.value
    .toUpperCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .slice(0, 18);
  return e;
};

export const formatToNumbersOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 18);
  return e;
};

export const startOfDay = (date: Date | string) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfDay = (date: Date | string) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getPaginationData = async (total: number, limit: number, page: number) => {
  return {
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};

export const buildWhereClause = async (
  filterMappings: Record<string, WhereKey>,
  filters: Record<string, any>,
  searchMappings?: { path: string[]; operators?: string[] }[],
) => {
  const whereClause: Record<string, any> = {};
  Object.entries(filterMappings).forEach(([filterKey, whereKey]) => {
    if (filters[filterKey] !== undefined && filters[filterKey] !== null) {
      if (typeof whereKey === "object" && "path" in whereKey) {
        const pathParts = whereKey.path.split(".");
        let current = whereClause;

        const value = whereKey.transform ? whereKey.transform(filters[filterKey]) : filters[filterKey];

        pathParts.forEach((part: string, index: number) => {
          if (index === pathParts.length - 1) {
            current[whereKey.field || part] = value;
          } else {
            current[part] = current[part] || {};
            current = current[part];
          }
        });
      } else if (typeof whereKey === "string") {
        whereClause[whereKey] = filters[filterKey];
      }
    }
  });

  if (filters.search && searchMappings && searchMappings.length > 0) {
    whereClause.OR = searchMappings.map(({ path, operators = ["contains"] }) => {
      return path.reduceRight((acc, key, index) => {
        const currentOperator = operators[index] || operators[operators.length - 1];
        if (index === path.length - 1) {
          return { [key]: { [currentOperator]: filters.search } };
        }
        return { [key]: { [currentOperator]: acc } };
      }, {});
    });
  }

  return whereClause;
};

export const getParamsFromUrl = async (request: any, requestParams: any) => {
  const { searchParams } = new URL(request.url);
  const updatedParams = { ...requestParams };

  Object.keys(updatedParams).forEach((key) => {
    if (searchParams.has(key) && searchParams.get(key) !== "") {
      const value = searchParams.get(key);
      updatedParams[key] = value === null ? null : Number.isNaN(Number(value)) ? value : Number(value);
    }
  });

  return updatedParams;
};

export const getRandomNumber = (min: any, max: any) => {
  return parseInt(Math.random() * (max - min) + min, 10);
};

export const getRandomDate = (start: any, end: any) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

export const getRandomElement = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const formatFolio = (folio: number) => {
  return String(folio).padStart(6, "0");
};

export const snakeToCamel = (str: string) => {
  return str.replace(/_([a-zA-Z0-9])/g, (_, match) => match.toUpperCase());
};

export const flattenObject = (
  obj: any,
  result: Record<string, any> = {},
  parentKeys: string[] = [],
): Record<string, any> => {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const value = obj[key];
    const camelKey = snakeToCamel(key);
    const currentPath = [...parentKeys, camelKey];
    let uniqueKey = camelKey;
    let i = currentPath.length - 1;
    while (Object.prototype.hasOwnProperty.call(result, uniqueKey) && i >= 0) {
      uniqueKey = currentPath
        .slice(i)
        .map((k, idx) => (idx === 0 ? k : k.charAt(0).toUpperCase() + k.slice(1)))
        .join("");
      i--;
    }

    const finalKey = uniqueKey;

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === "object") {
          flattenObject(value[0], result, parentKeys);
        }
      } else {
        flattenObject(value, result, currentPath);
      }
    } else {
      result[finalKey] = formatDateStringTS(value);
    }
  }
  return result;
};

export const getNestedValue = (obj: any, key: string): any => {
  const keys = key.split(".");
  let result = obj;

  for (const k of keys) {
    if (k.includes("[") && k.includes("]")) {
      const arrayKey = k.split("[")[0];
      const index = Number.parseInt(k.split("[")[1].split("]")[0], 10);
      result = result[arrayKey]?.[index];
    } else {
      result = result?.[k];
    }

    if (result === undefined) {
      return undefined;
    }
  }
  return result;
};

export const a11yProps = (tab: string, index: any) => {
  return {
    id: `${tab}-tab-${index}`,
    "aria-controls": `${tab}-tabpanel-${index}`,
  };
};

export const a11yPropsProfile = (index: string) => {
  return {
    id: index,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

export const failureResponse = (message: string, data: object = {}, statusCode?: number) =>
  handleHttpResponse(HttpResponse.failure(message, data, statusCode));

export const successResponse = (message: string, data: object, statusCode?: number) =>
  handleHttpResponse(HttpResponse.success(message, data, statusCode));

export const getRoleValueById = (id: number): RoleValue | undefined => {
  const key = ROLES_ID[id as keyof typeof ROLES_ID];
  return key ? ROLES[key] : undefined;
};

export const applyRoleFilters = async (
  role: RoleValue | undefined,
  userId: number,
  validRequestData: any,
  UserService: any,
  fieldName: string = "direccion_id",
): Promise<void> => {
  if (role === ROLES.ENLACE || role === ROLES.SUBENLACE) {
    const direcciones = await UserService.getActiveUserDirecciones(userId);
    const direccionIds = direcciones.map((d: any) => d.direccion.id);
    if (direccionIds.length > 0) {
      validRequestData[fieldName] = direccionIds;
    }
  }
};

export const calculateDaysBetweenDates = (startDate: string | Date, endDate: string | Date): number => {
  let start: Date;
  let end: Date;

  const parseDate = (date: string | Date): Date => {
    if (date instanceof Date) return date;

    if (date.includes("/")) {
      const [day, month, year] = date.split("/");
      const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
      if (!isNaN(parsedDate.getTime())) return parsedDate;
    }

    return new Date(date);
  };

  start = parseDate(startDate);
  end = parseDate(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1;
};

export const validateDireccionAccess = async (
  role: RoleValue | undefined,
  userId: number,
  employeeId: number,
  EmployeeService: any,
): Promise<{ allowed: boolean; errorMessage?: string }> => {
  if (role !== ROLES.ENLACE && role !== ROLES.SUBENLACE) {
    return { allowed: true };
  }

  const enlaceRoleIds = [ROLES_ID_VALUES[ROLES.ENLACE], ROLES_ID_VALUES[ROLES.SUBENLACE]];

  try {
    const result = await EmployeeService.validateDireccionAccessService(userId, employeeId, enlaceRoleIds);
    return { allowed: result.allowed, errorMessage: result.errorMessage };
  } catch (error) {
    return {
      allowed: false,
      errorMessage: "Error al validar acceso de dirección.",
    };
  }
};

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
};

export const withTime = (base: Date, hours: number, minutes = 0) => {
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d;
};

export const hiringDateForAntiguedad = (baseDate: Date, years: number, months = 0) => {
  const d = new Date(baseDate);
  d.setFullYear(d.getFullYear() - years);
  d.setMonth(d.getMonth() - months);
  return d;
};

export const startOfCurrentMonth = (): Date => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

export const getFirstDayMonthString = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01`;
};

export const validateIncidentDatesRange = (incidentDates: string[], startDate: string, endDate: string): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return incidentDates.filter((dateStr) => {
    const d = new Date(dateStr);
    return d < start || d > end;
  });
};

export function calculateAntiguedad(antiguedadStartDate: Date, referenceDate: Date = new Date()) {
  const start = new Date(antiguedadStartDate);
  const end = new Date(referenceDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (end < start) {
    return {
      antiguedadStartDate: start,
      antiguedadYears: 0,
      antiguedadMonths: 0,
      antiguedadDaysTotal: 0,
      antiguedadDaysResidual: 0,
      antiguedadMonthsTotal: 0,
    };
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const daysTotal = Math.floor((end.getTime() - start.getTime()) / 86400000);
  const monthsTotal = years * 12 + months;

  return {
    antiguedadStartDate: start,
    antiguedadYears: years,
    antiguedadMonths: months,
    antiguedadDaysTotal: daysTotal,
    antiguedadDaysResidual: days,
    antiguedadMonthsTotal: monthsTotal,
  };
}

export const generateIncidentDates = (startDate: string | Date, endDate: string | Date): string[] => {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const validateIncidentDateConflicts = async (
  employeeId: number,
  incidentDates: string[],
  incidentId: number,
  transaction?: any,
): Promise<{ hasConflicts: boolean; conflicts?: any; error?: any }> => {
  if (incidentDates.length === 0) {
    return { hasConflicts: false };
  }

  const dateObjects = incidentDates.map((date) => new Date(date));

  const conflicts = transaction
    ? await transaction.employeeIncidentDays.findMany({
        where: {
          date: { in: dateObjects },
          employee_incident: {
            employee_id: employeeId,
            incident_id: { not: incidentId },
            active: true,
          },
        },
        select: { date: true },
      })
    : await prisma.employeeIncidentDays.findMany({
        where: {
          date: { in: dateObjects },
          employee_incident: {
            employee_id: employeeId,
            incident_id: { not: incidentId },
            active: true,
          },
        },
        select: { date: true },
      });

  if (conflicts.length > 0) {
    return {
      hasConflicts: true,
      conflicts,
      error: HttpResponse.failure(HttpMessages.incidentRules.notSameDay, {
        dates: conflicts.map((d: any) => d.date.toISOString().slice(0, 10)),
      }),
    };
  }

  return { hasConflicts: false };
};
