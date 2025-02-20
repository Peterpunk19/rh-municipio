import { request as employeeRequest } from "./request";
import { response as employeeResponse } from "./response";
import { CreateTestCase } from "../../../common/CreateTestCase";

export class EmployeesTestCase extends CreateTestCase {
  constructor() {
    super(employeeRequest, employeeResponse);
  }
}
