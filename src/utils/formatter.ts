import { format } from "date-fns";

export const formatDate = (date: string | Date | null | undefined, dateFormat = "dd/MM/yyyy") => {
  if (!date) return "";

  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return "";
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    return format(d, dateFormat);
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
  } else if (typeof schedule === 'string') {
    formattedText = schedule;
  }

  return formattedText;
};
