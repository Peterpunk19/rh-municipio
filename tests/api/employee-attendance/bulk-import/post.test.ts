import { NextResponse } from "next/server";

import { POST } from "@/app/api/employee-attendance/bulk-import/route";
import { testCases } from "./testCases";
import { EmployeeService } from "@/app/api/services/employee.service";
import { AttendanceValidator } from "@/app/api/common/attendance-validator.service";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";

jest.mock("@/app/api/services/employee.service", () => ({
  EmployeeService: {
    getEmployeesForBulkAttendance: jest.fn(),
  },
}));

jest.mock("@/app/api/common/attendance-validator.service", () => ({
  AttendanceValidator: {
    shouldSaveAttendance: jest.fn(),
    validateAttendance: jest.fn(),
  },
}));

jest.mock("@/app/api/services/employee-attendance.service", () => ({
  EmployeeAttendanceService: {
    findMatchingRecordForCheckIn: jest.fn(),
    findMatchingRecordForCheckOut: jest.fn(),
    createSingleAttendance: jest.fn(),
    updateAttendanceCheckIn: jest.fn(),
    updateAttendanceCheckOut: jest.fn(),
  },
}));

jest.mock("@/common/response/handler", () => ({
  handleHttpResponse: jest.fn((resp) => NextResponse.json(resp, { status: resp.statusCode ?? 200 })),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

beforeEach(() => {
  (AttendanceValidator.shouldSaveAttendance as jest.Mock).mockResolvedValue(true);
  (AttendanceValidator.validateAttendance as jest.Mock).mockResolvedValue(0);

  (EmployeeAttendanceService.findMatchingRecordForCheckIn as jest.Mock).mockResolvedValue(null);
  (EmployeeAttendanceService.findMatchingRecordForCheckOut as jest.Mock).mockResolvedValue(null);
  (EmployeeAttendanceService.createSingleAttendance as jest.Mock).mockResolvedValue({ id: 999 });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("API: /employee-attendance", () => {
  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /employees-attendance/bulk-import ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (EmployeeService.getEmployeesForBulkAttendance as jest.Mock).mockResolvedValue([
          {
            id: 1,
            number_employee: "107991",
            employee_ascriptions: [{ id: 10 }],
            employee_location: [{ id: 11 }],
            employee_attendance_type: [{ id: 12, attendance: { name: "intercalated" } }],
          },
        ]);

        (AttendanceValidator.shouldSaveAttendance as jest.Mock).mockResolvedValue(true);
        (AttendanceValidator.validateAttendance as jest.Mock).mockResolvedValue(0);

        (EmployeeAttendanceService.findMatchingRecordForCheckIn as jest.Mock).mockResolvedValue(null);
        (EmployeeAttendanceService.createSingleAttendance as jest.Mock).mockResolvedValue({ id: 99 });
      }

      const requestObj = {
        json: async () => requestData,
      } as any;

      const response = await POST(requestObj);
      const body = await response.json();

      expect(response.status).toBe(expectedStatus);
      expect(body).toEqual(expectedResponse);
    });
  });
});
