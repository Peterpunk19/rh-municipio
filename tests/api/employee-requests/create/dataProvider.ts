import { EmployeeRequestsTestCase } from "./EmployeeRequestsTestCase";

const employeeRequestsTestCase = new EmployeeRequestsTestCase();

export const dataProvider = {
  validData: employeeRequestsTestCase.create("validData", 200),
  emptyParams: employeeRequestsTestCase.create("emptyParams"),
  emptyDescription: employeeRequestsTestCase.create("emptyDescription"),
  emptyRequestId: employeeRequestsTestCase.create("emptyRequestId"),
  emptyEmployeeId: employeeRequestsTestCase.create("emptyEmployeeId"),
};
