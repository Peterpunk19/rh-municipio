import { EmployeeAttendanceTestCase } from "./EmployeeAttendanceTestCase";

const employeeIncidentsTestCase = new EmployeeAttendanceTestCase();

export const dataProvider = {
  emptyParams: employeeIncidentsTestCase.create("emptyParams"),
  emptyEmployeeId: employeeIncidentsTestCase.create("emptyEmployeeId"),
  emptyCheckIn: employeeIncidentsTestCase.create("emptyCheckIn"),
  emptyCheckOut: employeeIncidentsTestCase.create("emptyCheckOut"),
  invalidDateRange: employeeIncidentsTestCase.create("invalidDateRange"),
  emptyDescription: employeeIncidentsTestCase.create("emptyDescription"),
  longDescription: employeeIncidentsTestCase.create("longDescription"),
  validData: employeeIncidentsTestCase.create("validData", 200),
  invalidEmployeeData: employeeIncidentsTestCase.create("invalidEmployeeData", 400),
};
