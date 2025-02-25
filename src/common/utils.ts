import bcryptjs from "bcryptjs";
import React from "react";

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
  filterMappings: any,
  filters: any,
  searchMappings?: { path: string[]; operators?: string[] }[],
) => {
  const whereClause: any = {};
  Object.entries(filterMappings).forEach(([filterKey, whereKey]) => {
    if (filters[filterKey] !== undefined && filters[filterKey] !== null) {
      // @ts-ignore
      whereClause[whereKey] = filters[filterKey];
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
      updatedParams[key] = value === null ? null : isNaN(Number(value)) ? value : Number(value);
    }
  });

  return updatedParams;
};
