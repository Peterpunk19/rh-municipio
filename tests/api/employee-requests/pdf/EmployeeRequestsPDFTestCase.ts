import { request as employeeRequestPDF } from "./request";
import { response as employeeResponsePDF } from "./response";
import { CreateTestCase } from "../../../common/CreateTestCase";

export class EmployeeRequestsPDFTestCase extends CreateTestCase {
  constructor() {
    super(employeeRequestPDF, employeeResponsePDF);
  }
}
