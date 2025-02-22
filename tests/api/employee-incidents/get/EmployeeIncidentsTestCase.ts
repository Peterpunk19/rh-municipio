import { request as employeeRequest } from "./request";
import { response as employeeResponse } from "./response";
import { CreateTestCase } from "../../../common/CreateTestCase";

export class EmployeeIncidentsTestCase extends CreateTestCase {
  constructor() {
    super(employeeRequest, employeeResponse);
  }
}
