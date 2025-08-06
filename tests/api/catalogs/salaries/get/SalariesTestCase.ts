import { request as salariesRequest } from "./request";
import { response as salariesResponse } from "./response";
import { CreateTestCase } from "../../../../common/CreateTestCase";

export class SalariesTestCase extends CreateTestCase {
  constructor() {
    super(salariesRequest, salariesResponse);
  }
}
