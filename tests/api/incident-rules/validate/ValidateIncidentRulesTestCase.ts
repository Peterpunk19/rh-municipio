import { request } from "./request";
import { response } from "./response";
import { CreateTestCase } from "../../../common/CreateTestCase";

export class ValidateIncidentRulesTestCase extends CreateTestCase {
  constructor() {
    super(request, response);
  }
}
