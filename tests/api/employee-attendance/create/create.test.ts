import { POST } from "@/app/api/employee-attendance/create/route";
import { testCases } from "./testCases";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";

const { getEmployee, validateEmployeeData } = jest.requireMock("@/app/api/common/utils.service");

jest.mock("@/app/api/common/utils.service", () => ({
  getEmployee: jest.fn(),
  validateEmployeeData: jest.fn(),
}));

jest.mock("@/app/api/services/employee-attendance.service", () => ({
  EmployeeAttendanceService: {
    createEmployeeAttendance: jest.fn(),
  },
}));

jest.mock("@/app/api/services/employee.service", () => ({
  EmployeeService: {
    getEmployeeByIdTest: jest.fn(),
  },
}));

describe("API: /employee-attendance", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /employees-attendance ${description}`, async () => {
      if (
        !(description === "should return error for empty employee" || description === "should return invalid request")
      ) {
        const mockEmployee = { id: 1 };
        (EmployeeService.getEmployeeByIdTest as jest.Mock).mockResolvedValue(mockEmployee);
        requestData.employeeId = mockEmployee.id;
      }

      if (description === "should return error message with invalid employee data") {
        getEmployee.mockResolvedValue({
          id: requestData.employeeId,
          employee_hiring: [],
          employee_location: [],
          employee_attendance_type: [],
        });

        validateEmployeeData.mockResolvedValueOnce(HttpResponse.failure(HttpMessages.employeeLocation.notFound, {}));
      }

      if (description === "should successfully send message with valid data") {
        getEmployee.mockResolvedValue({
          id: requestData.employeeId,
          user_id: 1,
          employee_hiring: [{ id: 1 }],
          employee_location: [{ id: 1 }],
          employee_attendance_type: [{ id: 1 }],
          employee_ascriptions: [{ id: 1 }],
        });

        (EmployeeAttendanceService.createEmployeeAttendance as jest.Mock).mockResolvedValueOnce([{}, {}]);

        validateEmployeeData.mockResolvedValueOnce(null);
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
