import { SalaryTestCase } from "./SalaryTestCase";

const GetTest = new SalaryTestCase();

export const dataProvider = {
  validData: GetTest.create("validData", 200),
  categoryIdNotNumber: GetTest.create("categoryIdNotNumber", 400),
  employeeTypeIdNotNumber: GetTest.create("employeeTypeIdNotNumber", 400),
  categoryIdZero: GetTest.create("categoryIdZero", 400),
  employeeTypeIdZero: GetTest.create("employeeTypeIdZero", 400),
  categoryIdNegative: GetTest.create("categoryIdNegative", 400),
  employeeTypeIdNegative: GetTest.create("employeeTypeIdNegative", 400),
};
