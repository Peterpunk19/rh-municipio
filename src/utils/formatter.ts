import { format } from "date-fns";
import { es } from "date-fns/locale";

export const formatDate = (date: string | Date | null | undefined, dateFormat = "dd/MM/yyyy") => {
  if (!date) return "";

  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return "";
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return format(d, dateFormat, { locale: es });
  } catch (e) {
    console.error("Invalid date format", e);
    return "";
  }
};

export const formatDateStringTS = (value: string) => {
  if (typeof value === "string") {
    const dateParts = value.split("T");
    if (dateParts.length === 2 && dateParts[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateParts[0];
    }
  }
  return value;
};

export const formatDateStringFilters = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  } catch (e) {
    console.error("Error formatting date:", e);
    return "";
  }
};

type ScheduleItem = {
  start_day: { display_name: string };
  start_hour: { display_name: string };
  end_day: { display_name: string };
  end_hour: { display_name: string };
};

export const formatScheduleText = (schedule: string) => {
  if (!schedule) return "";
  let formattedText = "";
  if (Array.isArray(schedule)) {
    formattedText = schedule
      .map(
        (item) =>
          `${item.startDay?.name || item.start_day?.display_name} a ${item.endDay?.name || item.end_day?.display_name} de ${item.startHour?.name || item.start_hour?.display_name} a ${item.endHour?.name || item.end_hour?.display_name}`,
      )
      .join("\n");
  } else if (typeof schedule === "object") {
    const entries = Object.entries(schedule);
    entries.sort((a, b) => Number.parseInt(a[0]) - Number.parseInt(b[0]));
    const parts = [];
    for (const [_, value] of entries) {
      const item = value as ScheduleItem;

      if (item.start_day && item.start_hour && item.end_day && item.end_hour) {
        parts.push(
          `${item.start_day.display_name} a ${item.end_day.display_name} de ${item.start_hour.display_name} a ${item.end_hour.display_name}`,
        );
      }
    }
    formattedText = parts.join("\n");
  } else if (typeof schedule === "string") {
    formattedText = schedule;
  }

  return formattedText;
};

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const formatDateTextHelper = (day: string, month: string, year: string, showYearNumber: boolean = false) => {
  const mesIndex = parseInt(month) - 1;
  const mesNombre = MESES[mesIndex];
  if (!mesNombre) throw new Error("Mes inválido en la fecha");

  const capitalizedMonth = mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1);
  const dayFormatted = parseInt(day).toString().padStart(2, "0");
  const currentYear = new Date().getFullYear().toString();

  if (year === currentYear && !showYearNumber) {
    return `${dayFormatted} de ${capitalizedMonth} del presente año`;
  } else {
    return `${dayFormatted} de ${capitalizedMonth} del ${year}`;
  }
};

export const formatDateToText = (date: string | Date | null | undefined, showYearNumber: boolean = false) => {
  if (!date) throw new Error("Fecha requerida");

  const dateStr = typeof date === "string" ? date : date.toString();

  const ddmmyyyyMatch = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (ddmmyyyyMatch) {
    const [, day, month, year] = ddmmyyyyMatch;
    return formatDateTextHelper(day, month, year, showYearNumber);
  }

  const yyyymmddMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (yyyymmddMatch) {
    const [, year, month, day] = yyyymmddMatch;
    return formatDateTextHelper(day, month, year, showYearNumber);
  }

  throw new Error("Formato de fecha inválido");
};

export const getMonthName = (monthNumber: any) => {
  const mesIndex = parseInt(monthNumber) - 1;
  return MESES[mesIndex].toUpperCase();
};
