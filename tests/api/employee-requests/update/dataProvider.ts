import { EmployeeRequestsUpdateTestCase } from "./EmployeeRequestsUpdateTestCase";

const employeeRequestsUpdateTestCase = new EmployeeRequestsUpdateTestCase();

export const dataProvider = {
  invalidRequest: employeeRequestsUpdateTestCase.create("emptyParams"),
  emptyId: employeeRequestsUpdateTestCase.create("emptyId"),
  idNotNumber: employeeRequestsUpdateTestCase.create("idNotNumber"),
  idZero: employeeRequestsUpdateTestCase.create("idZero"),
  idNegative: employeeRequestsUpdateTestCase.create("idNegative"),
  idLong: employeeRequestsUpdateTestCase.create("idLong"),
  emptyStatus: employeeRequestsUpdateTestCase.create("emptyStatus"),
  invalidStatus: employeeRequestsUpdateTestCase.create("invalidStatus"),
  validData: employeeRequestsUpdateTestCase.create("validData", 200),
};
