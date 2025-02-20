import { prisma } from "@/lib/prisma";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import type { IEmployeeIncident } from "@/app/api/employee-incidents/types";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    employeeIncidents: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    employeeIncidentsStatus: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe("EmployeeIncidentsService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getFolio", () => {
    it("should return '000001' if no records exist", async () => {
      (prisma.employeeIncidents.findFirst as jest.Mock).mockResolvedValue(null);

      const folio = await EmployeeIncidentsService.getFolio();
      expect(folio).toBe("000001");
    });

    it("should return incremented folio if records exist", async () => {
      (prisma.employeeIncidents.findFirst as jest.Mock).mockResolvedValue({
        folio: "000123",
      });

      const folio = await EmployeeIncidentsService.getFolio();
      expect(folio).toBe("000124");
    });
  });

  describe("validateEmployeeIncident", () => {
    it("should call Prisma with correct parameters", async () => {
      const mockIncident: IEmployeeIncident = {
        employeeId: "1",
        startDate: "2024-02-19",
        endDate: "2024-02-20",
        incidentStatusId: 2,
        incidentId: "3",
        folio: "000124",
        oficio: "",
        description: "Test",
      };

      (prisma.employeeIncidents.findFirst as jest.Mock).mockResolvedValue(null);

      await EmployeeIncidentsService.validateEmployeeIncident(mockIncident);

      expect(prisma.employeeIncidents.findFirst).toHaveBeenCalledWith({
        where: {
          employee_id: 1,
          start_date: "2024-02-19",
          end_date: "2024-02-20",
          incident_status_id: 2,
          incident_id: 3,
        },
      });
    });
  });

  describe("createEmployeeIncidents", () => {
    it("should create an employee incident and status", async () => {
      const mockIncident: IEmployeeIncident = {
        employeeId: "1",
        startDate: "2024-02-19",
        endDate: "2024-02-20",
        incidentStatusId: 2,
        incidentId: "3",
        folio: "000124",
        oficio: "12345",
        description: "Test",
      };

      const mockCreatedIncident = { id: 1, ...mockIncident };
      const mockCreatedStatus = { id: 2, employee_incident_id: 1 };

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) =>
        callback({
          employeeIncidents: {
            create: jest.fn().mockResolvedValue(mockCreatedIncident),
          },
          employeeIncidentsStatus: {
            create: jest.fn().mockResolvedValue(mockCreatedStatus),
          },
        }),
      );

      const result = await EmployeeIncidentsService.createEmployeeIncidents(mockIncident);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual([mockCreatedIncident, mockCreatedStatus]);
    });
  });
});
