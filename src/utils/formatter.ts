import { format } from "date-fns";

export const formatDate = (date: string, dateFormat = "dd/MM/yyyy") => {
  try {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return format(d, dateFormat);
  } catch (e) {
    console.error("Invalid date format", e);
    return date;
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
