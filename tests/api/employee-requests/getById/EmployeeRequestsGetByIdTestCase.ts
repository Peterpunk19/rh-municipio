import { request as employeeRequestById } from "./request";
import { response as employeeResponseById } from "./response";
import { CreateTestCase } from "../../../common/CreateTestCase";

export class EmployeeRequestsGetByIdTestCase extends CreateTestCase {
  constructor() {
    super(employeeRequestById, employeeResponseById);
  }
}
