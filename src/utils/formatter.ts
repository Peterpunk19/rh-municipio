import { format } from "date-fns";

export const formatDate = (date: string) => {
  try {
    const d = new Date(date);
    return format(d, "dd/MM/yyyy");
  } catch (e) {
    console.error("Invalid date format", e);
    return date;
  }
};
