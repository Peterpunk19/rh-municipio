import { EmployeeAttendanceTestCase } from "./EmployeeAttendanceTestCase";

const testCase = new EmployeeAttendanceTestCase();

export const dataProvider = {
  emptyParams: testCase.create("emptyParams"),
  emptyId: testCase.create("emptyId"),
  emptyNumberEmployee: testCase.create("emptyNumberEmployee"),
  emptyIsEntry: testCase.create("emptyIsEntry"),
  emptyDateTime: testCase.create("emptyDateTime"),
  emptyValues: testCase.create("emptyValues"),
  validData: testCase.create("validData", 200),
};
