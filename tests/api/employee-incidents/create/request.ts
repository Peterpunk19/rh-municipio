import { generator } from "./generator";

export const request = {
  emptyParams: {},
  emptyEmployeeId: generator.request({ employeeId: "0" }),
  emptyIncidentId: generator.request({ incidentId: "0" }),
  emptyStartDate: generator.request({ startDate: "" }),
  emptyEndDate: generator.request({ endDate: "" }),
  invalidDateRange: generator.request({ startDate: "2025-01-26", endDate: "2025-01-25" }),
  emptyDescription: generator.request({ description: "" }),
  longDescription: generator.request({ description: "a".repeat(256) }),
  validData: generator.request({}),
};
