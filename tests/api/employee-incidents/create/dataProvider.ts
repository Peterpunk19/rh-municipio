import { EmployeeIncidentsTestCase } from "./EmployeeIncidentsTestCase";

const employeeIncidentsTestCase = new EmployeeIncidentsTestCase();

export const dataProvider = {
  emptyParams: employeeIncidentsTestCase.create("emptyParams"),
  emptyEmployeeId: employeeIncidentsTestCase.create("emptyEmployeeId"),
  emptyIncidentId: employeeIncidentsTestCase.create("emptyIncidentId"),
  emptyStartDate: employeeIncidentsTestCase.create("emptyStartDate"),
  emptyEndDate: employeeIncidentsTestCase.create("emptyEndDate"),
  invalidDateRange: employeeIncidentsTestCase.create("invalidDateRange"),
  emptyDescription: employeeIncidentsTestCase.create("emptyDescription"),
  longDescription: employeeIncidentsTestCase.create("longDescription"),
  validData: employeeIncidentsTestCase.create("validData", 200),
};
