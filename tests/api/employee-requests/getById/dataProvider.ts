import { EmployeeRequestsGetByIdTestCase } from "./EmployeeRequestsGetByIdTestCase";

const employeeRequestsGetByIdTestCase = new EmployeeRequestsGetByIdTestCase();

export const dataProvider = {
  idNotNumber: employeeRequestsGetByIdTestCase.create("idNotNumber"),
  idZero: employeeRequestsGetByIdTestCase.create("idZero"),
  idNegative: employeeRequestsGetByIdTestCase.create("idNegative"),
  idLong: employeeRequestsGetByIdTestCase.create("idNegative"),
  validData: employeeRequestsGetByIdTestCase.create("validData", 200),
};
