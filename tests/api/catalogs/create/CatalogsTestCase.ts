import { request as catalogRequest } from "./request";
import { response as catalogResponse } from "./response";
import { CreateTestCase } from "../../../common/CreateTestCase";

export class CatalogsTestCase extends CreateTestCase {
  constructor() {
    super(catalogRequest, catalogResponse);
  }
}
