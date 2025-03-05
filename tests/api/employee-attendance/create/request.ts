import { generator } from "./generator";

export const request = {
  emptyParams: {},
  emptyEmployeeId: generator.request({ employeeId: "0" }),
  emptyCheckIn: generator.request({ checkIn: "" }),
  emptyCheckOut: generator.request({ checkOut: "" }),
  invalidDateRange: generator.request({ checkIn: "2025-01-26", checkOut: "2025-01-25" }),
  emptyDescription: generator.request({ description: "" }),
  longDescription: generator.request({ description: "a".repeat(256) }),
  validData: generator.request({}),
  invalidEmployeeData: generator.request({}),
};
