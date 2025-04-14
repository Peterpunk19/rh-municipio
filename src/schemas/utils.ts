export const validateDate = (val: any) => {
  if (typeof val === "string" || val instanceof String) {
    const parsedDate = new Date(val as string);
    return Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }

  return val;
};
