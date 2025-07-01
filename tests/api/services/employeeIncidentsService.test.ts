import { prisma } from "@/lib/prisma";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import type { IEmployeeIncident } from "@/app/api/employee-incidents/types";
import { INCIDENT_STATUS_ID } from "@/common/constants/IncidentStatus";

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
        createdBy: "1",
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
        createdBy: "1",
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

  describe("employeeIncidentsService.updateEmployeeIncidents", () => {
    const mockEmployeeIncident = {
      id: 1,
      incidentStatusId: INCIDENT_STATUS_ID.APROBADA,
      checkIn: new Date(),
      checkOut: new Date(),
      employeeHiringId: 10,
      employeeLocationId: 20,
      createdById: 40,
      employeeId: 40,
      employeeAttendanceTypeId: 1,
      employeeIncidentDays: [
        {
          id: 18,
          date: new Date(),
          created_at: new Date(),
        },
      ],
      validatedById: 40,
    };

    it("should create attendance, update incident, and create incident status when status is APROBADA", async () => {
      const mockTx = {
        employeeAttendance: {
          create: jest.fn().mockResolvedValue({ id: 99 }),
        },
        employeeIncidents: {
          update: jest.fn(),
        },
        employeeIncidentsStatus: {
          create: jest.fn().mockResolvedValue({ id: 100 }),
        },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
        return await fn(mockTx);
      });

      const result = await EmployeeIncidentsService.updateEmployeeIncidents(mockEmployeeIncident);

      expect(mockTx.employeeAttendance.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            check_in: mockEmployeeIncident.checkIn,
            check_out: mockEmployeeIncident.checkOut,
            description: "Asistencia creada por incidencia",
            employee_hiring: { connect: { id: mockEmployeeIncident.employeeHiringId } },
            employee_location: { connect: { id: mockEmployeeIncident.employeeLocationId } },
            employee_attendance_type: { connect: { id: 1 } },
            created_by: { connect: { id: mockEmployeeIncident.createdById } },
            employee_incident: { connect: { id: mockEmployeeIncident.id } },
          }),
        }),
      );

      expect(mockTx.employeeIncidents.update).toHaveBeenCalledWith({
        data: {
          incident_status_id: mockEmployeeIncident.incidentStatusId,
          validated_at: expect.any(Date),
          validated_by_id: mockEmployeeIncident.validatedById,
        },
        where: {
          id: mockEmployeeIncident.id,
        },
      });

      expect(mockTx.employeeIncidentsStatus.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            employee_incident: { connect: { id: mockEmployeeIncident.id } },
            incident_status: { connect: { id: mockEmployeeIncident.incidentStatusId } },
            created_by: { connect: { id: mockEmployeeIncident.employeeId } },
          }),
        }),
      );

      expect(result).toEqual([{ id: 100 }]);
    });
  });
});
