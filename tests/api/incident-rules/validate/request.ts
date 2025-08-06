import { generator } from "./generator";

export const request = {
  missingEmployeeId: generator.request({ employeeId: undefined }),
  invalidIncidentId: generator.request({ incidentId: "abc" }),
  invalidDateFormat: generator.request({ startDate: "2025-07-32" }),
  valid: generator.request({}),
};
