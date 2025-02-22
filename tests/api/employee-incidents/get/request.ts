import { generator } from "./generator";

export const request = {
  pageNotNumber: generator.request({ page: "a" }),
  pageZero: generator.request({ page: 0 }),
  pageNegative: generator.request({ page: -1 }),
  limitNotNumber: generator.request({ limit: "a" }),
  limitZero: generator.request({ limit: 0 }),
  limitNegative: generator.request({ limit: -1 }),
  longSearch: generator.request({ search: "a".repeat(256) }),
  invalidIncidentId: generator.request({ incident_id: "aaaa" }),
  invalidIncidentStatusId: generator.request({ incident_status_id: "aaaa" }),
  invalidStartDate: generator.request({ start_date: "aaaa" }),
  invalidEndDate: generator.request({ end_date: "aaaa" }),
  validData: generator.request({}),
};
