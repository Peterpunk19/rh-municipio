import { request as employeeAttendanceRequest } from "./request";
import { response as employeeAttendanceResponse } from "./response";
import { CreateTestCase } from "../../../common/CreateTestCase";

export class EmployeeAttendanceTestCase extends CreateTestCase {
  constructor() {
    super(employeeAttendanceRequest, employeeAttendanceResponse);
  }
}
