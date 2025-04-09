import { prisma } from "@/lib/prisma";
import { RequestService } from "@/app/api/services/request.service";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import type { IEmployeeRequest } from "@/app/api/employee-requests/types";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    employeeRequest: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    employeeRequestStatus: {
      create: jest.fn(),
    },
    employeeRequestDetail: {
      create: jest.fn(),
    },
    request: {
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe("EmployeeRequestService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getFolio", () => {
    it("should return '000001' if no records exist", async () => {
      (prisma.employeeRequest.findFirst as jest.Mock).mockResolvedValue(null);

      const folio = await EmployeeRequestService.getFolio();
      expect(folio).toBe("000001");
    });

    it("should return incremented folio if records exist", async () => {
      (prisma.employeeRequest.findFirst as jest.Mock).mockResolvedValue({
        folio: "000005",
      });

      const folio = await EmployeeRequestService.getFolio();
      expect(folio).toBe("000006");
    });
  });

  describe("getRequestById", () => {
    it("should call Prisma with correct parameters", async () => {
      const mockRequest = {
        id: 2,
        name: "location_change_request",
        display_name: "UBICACION",
        description: "Solicitiud de cambio de ubicación",
        active: 1,
      };

      (prisma.request.findFirst as jest.Mock).mockResolvedValue(mockRequest);

      const result = await RequestService.getRequestById(mockRequest.id);

      expect(prisma.request.findFirst).toHaveBeenCalledWith({
        where: {
          id: 2,
        },
      });
      expect(result).toEqual(mockRequest);
    });
  });

  describe("validateEmployeeRequest", () => {
    it("should call Prisma with correct parameters", async () => {
      const mockIncident: IEmployeeRequest = {
        folio: "000006",
        oficio: "OFICIO-123",
        description:
          "Lorem ipsum dolor sit amet consectetur adipiscing elit, porttitor eros quisque enim mattis facilisi, pulvinar dignissim proin ante nibh tempor.",
        requestId: 1,
        employeeId: 1,
        startDate: "2025-04-11",
        endDate: "2025-04-11",
        requestStatusId: 1,
        requestDate: "2025-04-07",
        requestedById: 1,
        schedule: [
          {
            startDayId: 1,
            startHourId: 17,
            endDayId: 5,
            endHourId: 33,
          },
          {
            startDayId: 6,
            startHourId: 17,
            endDayId: 7,
            endHourId: 29,
          },
        ],
      };

      (prisma.employeeRequest.findFirst as jest.Mock).mockResolvedValue(null);

      await EmployeeRequestService.validateEmployeeRequest(mockIncident);

      expect(prisma.employeeRequest.findFirst).toHaveBeenCalledWith({
        where: {
          employee_id: 1,
          request_id: 1,
          request_status_id: 1,
          request_date: "2025-04-07",
        },
      });
    });
  });

  describe("createEmployeeRequest", () => {
    it("should create an employee request and status", async () => {
      const mockRequest: IEmployeeRequest = {
        folio: "000006",
        oficio: "OFICIO-123",
        description:
          "Lorem ipsum dolor sit amet consectetur adipiscing elit, porttitor eros quisque enim mattis facilisi, pulvinar dignissim proin ante nibh tempor.",
        requestId: 1,
        employeeId: 1,
        startDate: "2025-04-11",
        endDate: "2025-04-11",
        requestStatusId: 1,
        requestDate: "2025-04-07",
        requestedById: 1,
        schedule: [
          {
            startDayId: 1,
            startHourId: 17,
            endDayId: 5,
            endHourId: 33,
          },
          {
            startDayId: 6,
            startHourId: 17,
            endDayId: 7,
            endHourId: 29,
          },
        ],
      };

      const mockTx = {
        employeeRequest: {
          create: jest.fn().mockResolvedValue({ id: 1 }),
        },
        employeeRequestStatus: {
          create: jest.fn(),
        },
        employeeRequestDetail: {
          create: jest.fn(),
        },
      };

      (prisma.$transaction as jest.Mock).mockImplementationOnce((fn) => fn(mockTx));

      await EmployeeRequestService.createEmployeeRequest(mockRequest);

      expect(mockTx.employeeRequest.create).toHaveBeenCalled();
      expect(mockTx.employeeRequestStatus.create).toHaveBeenCalled();
      expect(mockTx.employeeRequestDetail.create).toHaveBeenCalled();
    });
  });
});
