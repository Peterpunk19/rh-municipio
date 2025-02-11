import bcryptjs from "bcryptjs";

export const encryptPassword = async (password: string): Promise<string> => {
  return await bcryptjs.hash(password, 10);
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
