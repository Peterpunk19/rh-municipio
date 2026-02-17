import { request as employeeIncidentsBulkCreateRequest } from "./request";
import { response as employeeIncidentsBulkCreateResponse } from "./response";
import { CreateTestCase } from "../../../common/CreateTestCase";

export class EmployeeIncidentsBulkCreateTestCase extends CreateTestCase {
  constructor() {
    super(employeeIncidentsBulkCreateRequest, employeeIncidentsBulkCreateResponse);
  }
}
