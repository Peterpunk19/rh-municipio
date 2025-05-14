import { request as leadersRequest } from "./request";
import { response as leadersResponse } from "./response";
import { CreateTestCase } from "../../../common/CreateTestCase";

export class LeadersTestCase extends CreateTestCase {
  constructor() {
    super(leadersRequest, leadersResponse);
  }
}
