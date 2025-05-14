import { prisma } from "@/lib/prisma";
import { AdministrativeOrganizationLeadersService } from "@/app/api/services/administrative-organization-leaders.service";
import type { ICreateLeader } from "@/app/api/administrative-organizations/types";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    administrativeOrganizationLeaders: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(prisma)),
  },
}));

describe("AdministrativeOrganizationLeadersService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createLeader", () => {
    it("should create or update an leader", async () => {
      const mockLeader: ICreateLeader = {
        direccionId: 5,
        employeeId: 40,
        roleId: 12,
        startDate: "2025-05-05",
        endDate: "2026-05-05",
        createdById: 1,
      };

      const mockResult = {
        id: 1,
        direccion_id: 5,
        employee_id: 40,
        role_id: 12,
        active: true,
        start_date: "2025-05-05",
        end_date: "2026-05-05",
      };

      (prisma.administrativeOrganizationLeaders.findFirst as jest.Mock).mockResolvedValue(null);

      (prisma.administrativeOrganizationLeaders.create as jest.Mock).mockResolvedValue(mockResult);

      const result = await AdministrativeOrganizationLeadersService.createLeader(mockLeader);
      expect(result).toEqual(mockResult);
    });
  });
});
