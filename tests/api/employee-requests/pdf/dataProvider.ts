import { EmployeeRequestsPDFTestCase } from "./EmployeeRequestsPDFTestCase";

const employeeRequestsPDFTestCase = new EmployeeRequestsPDFTestCase();

export const dataProvider = {
  idNotNumber: employeeRequestsPDFTestCase.create("idNotNumber"),
  idZero: employeeRequestsPDFTestCase.create("idZero", 404),
  idNegative: employeeRequestsPDFTestCase.create("idNegative", 404),
  idLong: employeeRequestsPDFTestCase.create("idLong", 404),
  validData: employeeRequestsPDFTestCase.create("validData", 200),
  withoutPDFFlag: employeeRequestsPDFTestCase.create("withoutPDFFlag", 200),
  withoutRequestDate: employeeRequestsPDFTestCase.create("withoutRequestDate", 200),
  incompleteData: employeeRequestsPDFTestCase.create("incompleteData", 404),
};
