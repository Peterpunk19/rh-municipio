import { generator } from "./generator";
import { HttpMessages } from "@/common/response/messages";

export class ConfigYearsTestCase {
  private url = "/api/catalogs/config-years";

  create(name: "successGetAll" | "errorGetAll", status = 200) {
    if (name === "successGetAll") {
      return {
        request: { url: this.url },
        status,
        response: generator.response({
          success: true,
          message: HttpMessages.catalog.success,
          responseObject: [generator.configYear()],
          statusCode: 200,
        }),
      } as const;
    }

    return {
      request: { url: this.url },
      status,
      error: generator.error("network error"),
    } as const;
  }
}
