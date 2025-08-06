import { generator } from "./generator";

export const request = {
  validData: generator.request(),
  categoryIdNotNumber: generator.request({ categoryId: "a" }),
  employeeTypeIdNotNumber: generator.request({ employeeTypeId: "a" }),
  categoryIdZero: generator.request({ categoryId: 0 }),
  employeeTypeIdZero: generator.request({ employeeTypeId: 0 }),
  categoryIdNegative: generator.request({ categoryId: -1 }),
  employeeTypeIdNegative: generator.request({ employeeTypeId: -1 }),
};
