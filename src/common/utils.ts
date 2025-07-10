import bcryptjs from "bcryptjs";
import type React from "react";
import { formatDateStringTS } from "@/utils/formatter";

import type { WhereKey } from "@/interfaces/WhereConfig";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { ROLES, ROLES_ID, RoleValue } from "@/common/constants/Roles";

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

        pathParts.forEach((part: string, index: number) => {
          if (index === pathParts.length - 1) {
            current[whereKey.field || part] = filters[filterKey];
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
  const key = ROLES_ID[id as keyof typeof ROLES_ID]; // asegura que el índice es una clave válida
  return key ? ROLES[key] : undefined;
};

export const applyRoleFilters = async (
  role: RoleValue | undefined,
  employeeId: number,
  validRequestData: any,
  EmployeeService: any,
  fieldName: string = "direccion_id",
): Promise<void> => {
  if (role === ROLES.ENLACE || role === ROLES.SUBENLACE) {
    const employee = await EmployeeService.getEmployeeById(employeeId);
    const direccionId = employee?.employee_hiring?.[0]?.direccion?.id;
    if (typeof direccionId === "number" && !isNaN(direccionId)) {
      validRequestData[fieldName] = direccionId;
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
