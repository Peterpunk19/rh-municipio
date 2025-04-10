import { EmployeesIncidentsUpdateTestCase } from "./EmployeesIncidentsUpdateTestCase";

const employeesIncidentsUpdateTestCase = new EmployeesIncidentsUpdateTestCase();

export const dataProvider = {
  invalidRequest: employeesIncidentsUpdateTestCase.create("emptyParams"),
  emptyId: employeesIncidentsUpdateTestCase.create("emptyId"),
  idNotNumber: employeesIncidentsUpdateTestCase.create("idNotNumber"),
  idZero: employeesIncidentsUpdateTestCase.create("idZero"),
  idNegative: employeesIncidentsUpdateTestCase.create("idNegative"),
  idLong: employeesIncidentsUpdateTestCase.create("idLong"),
  emptyIncidentStatusId: employeesIncidentsUpdateTestCase.create("emptyIncidentStatusId"),
  validData: employeesIncidentsUpdateTestCase.create("validData", 200),
};
