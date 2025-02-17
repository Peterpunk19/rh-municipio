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

export const getPaginationData = (total: number, limit: number, page: number) => {
  return {
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
};
