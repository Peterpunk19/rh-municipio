import { generator } from "./generator";

export const request = {
  validData: generator.request({ requestId: 1 }),
  emptyParams: {},
  emptyDescription: generator.request({ requestId: 1, description: "" }),
  emptyRequestId: generator.request({ requestId: 0 }),
  emptyEmployeeId: generator.request({ requestId: 1, employeeId: 0 }),
};
