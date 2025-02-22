import { EmployeeIncidentsTestCase } from "./EmployeeIncidentsTestCase";

const employeeIncidentsTestCase = new EmployeeIncidentsTestCase();

export const dataProvider = {
  pageNotNumber: employeeIncidentsTestCase.create("pageNotNumber"),
  pageZero: employeeIncidentsTestCase.create("pageZero"),
  pageNegative: employeeIncidentsTestCase.create("pageNegative"),
  limitNotNumber: employeeIncidentsTestCase.create("limitNotNumber"),
  limitZero: employeeIncidentsTestCase.create("limitZero"),
  limitNegative: employeeIncidentsTestCase.create("limitNegative"),
  invalidIncidentId: employeeIncidentsTestCase.create("invalidIncidentId"),
  invalidIncidentStatusId: employeeIncidentsTestCase.create("invalidIncidentStatusId"),
  invalidStartDate: employeeIncidentsTestCase.create("invalidStartDate"),
  invalidEndDate: employeeIncidentsTestCase.create("invalidEndDate"),
  longSearch: employeeIncidentsTestCase.create("longSearch"),
  validData: employeeIncidentsTestCase.create("validData", 200),
};
