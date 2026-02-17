import { generator } from "./generator";

export const request = {
  emptyParams: {},
  emptyEmployeeIds: {
    employeeIds: [],
    incidentId: 2,
    startDate: new Date("2025-08-25"),
    endDate: new Date("2025-08-29"),
    description: "Incidencias masivas",
  },
  emptyIncidentId: {
    employeeIds: [1, 2, 3],
    incidentId: null,
    startDate: new Date("2025-08-25"),
    endDate: new Date("2025-08-29"),
    description: "Incidencias masivas",
  },
  emptyStartDate: {
    employeeIds: [1, 2, 3],
    incidentId: 2,
    startDate: new Date(""),
    endDate: new Date("2025-08-29"),
    description: "Incidencias masivas",
  },
  emptyEndDate: {
    employeeIds: [1, 2, 3],
    incidentId: 2,
    startDate: new Date("2025-08-25"),
    endDate: new Date(""),
    description: "Incidencias masivas",
  },
  invalidDateRange: generator.request({
    startDate: new Date("2025-01-26"),
    endDate: new Date("2025-01-25"),
  }),
  emptyDescription: {
    employeeIds: [1, 2, 3],
    incidentId: 2,
    startDate: new Date("2025-08-25"),
    endDate: new Date("2025-08-29"),
    description: "",
  },
  longDescription: generator.request({ description: "a".repeat(256) }),
  longOficio: generator.request({ oficio: "a".repeat(31) }),
  emptyIncidentDates: generator.request({ incidentDates: [] }),
  incidentNotAllowBulk: generator.request({ incidentId: 2 }),
  permissionDenied: generator.request({ incidentId: 3 }),
  validData: generator.request({}),
};
