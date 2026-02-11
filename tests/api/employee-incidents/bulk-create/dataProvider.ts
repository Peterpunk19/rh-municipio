import { EmployeeIncidentsBulkCreateTestCase } from "./EmployeeIncidentsBulkCreateTestCase";

const employeeIncidentsBulkCreateTestCase = new EmployeeIncidentsBulkCreateTestCase();

export const dataProvider = {
  emptyParams: employeeIncidentsBulkCreateTestCase.create("emptyParams"),
  emptyEmployeeIds: employeeIncidentsBulkCreateTestCase.create("emptyEmployeeIds"),
  emptyIncidentId: employeeIncidentsBulkCreateTestCase.create("emptyIncidentId"),
  emptyStartDate: employeeIncidentsBulkCreateTestCase.create("emptyStartDate"),
  emptyEndDate: employeeIncidentsBulkCreateTestCase.create("emptyEndDate"),
  invalidDateRange: employeeIncidentsBulkCreateTestCase.create("invalidDateRange"),
  emptyDescription: employeeIncidentsBulkCreateTestCase.create("emptyDescription"),
  longDescription: employeeIncidentsBulkCreateTestCase.create("longDescription"),
  longOficio: employeeIncidentsBulkCreateTestCase.create("longOficio"),
  emptyIncidentDates: employeeIncidentsBulkCreateTestCase.create("emptyIncidentDates"),
  incidentNotAllowBulk: employeeIncidentsBulkCreateTestCase.create("incidentNotAllowBulk"),
  permissionDenied: employeeIncidentsBulkCreateTestCase.create("permissionDenied"),
  validData: employeeIncidentsBulkCreateTestCase.create("validData", 200),
};
