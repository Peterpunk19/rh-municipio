import { request as getRequest } from "./request";
import { response as getResponse } from "./response";
import { CreateTestCase } from "../../../common/CreateTestCase";

export class GetTestCase extends CreateTestCase {
  constructor() {
    super(getRequest, getResponse);
  }
}
