import { prisma } from "@/lib/prisma";
import { IncidentRulesService } from "@/app/api/services/incident-rules.service";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    incidentRules: {
      findMany: jest.fn(),
    },
    employeeIncidentDays: {
      findMany: jest.fn(),
    },
  },
}));

describe("IncidentRulesService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getApplicableRule", () => {
    it("should return the most applicable rule", async () => {
      (prisma.incidentRules.findMany as jest.Mock).mockImplementation(({ where }) => {
        if (
          where.incident_id === 1 &&
          where.employee_type_id === 2 &&
          where.active === true &&
          where.min_years.lte === 4 &&
          where.OR.some((or: any) => or.max_years === null) &&
          where.OR.some((or: any) => or.max_years?.gte === 4)
        ) {
          return Promise.resolve([
            { id: 2, min_years: 3, start_date: null, end_date: null },
            { id: 1, min_years: 1, start_date: null, end_date: null },
          ]);
        }
        return Promise.resolve([]);
      });

      const rule = await IncidentRulesService.getApplicableRule(1, 2, 4, 7);
      expect(prisma.incidentRules.findMany).toHaveBeenCalled();
      expect(rule).toEqual({
        id: 2,
        min_years: 3,
        start_date: null,
        end_date: null,
      });
    });

    it("should return null if no rules found", async () => {
      (prisma.incidentRules.findMany as jest.Mock).mockResolvedValue([]);
      const rule = await IncidentRulesService.getApplicableRule(1, 2, 4, 7);
      expect(rule).toBeNull();
    });
  });

  describe("getUsedIncidentDays", () => {
    it("should sum values from employeeIncidentDays", async () => {
      (prisma.employeeIncidentDays.findMany as jest.Mock).mockResolvedValue([
        { value: 1 },
        { value: 2 },
        { value: null },
      ]);
      const used = await IncidentRulesService.getUsedIncidentDays(1, 2, new Date("2024-01-01"), new Date("2024-01-31"));
      expect(prisma.employeeIncidentDays.findMany).toHaveBeenCalled();
      expect(used).toBe(4);
    });
    it("should return 0 if no days found", async () => {
      (prisma.employeeIncidentDays.findMany as jest.Mock).mockResolvedValue([]);
      const used = await IncidentRulesService.getUsedIncidentDays(1, 2);
      expect(used).toBe(0);
    });
  });
});
