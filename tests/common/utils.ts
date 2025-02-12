import { request } from "../../tests/api/employees/create/request";
import { response } from "../../tests/api/employees/create/response";

export const createTestCase = (key: keyof typeof request, status: number = 400) => ({
  status,
  request: request[key],
  response: response[key],
});
