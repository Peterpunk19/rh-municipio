import { format } from "date-fns";

export const formatDate = (date: string, dateFormat: string = "dd/MM/yyyy") => {
  try {
    const d = new Date(date);
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
