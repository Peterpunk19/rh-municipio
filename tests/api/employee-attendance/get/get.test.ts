import { GET } from "@/app/api/employee-attendance/route";
import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import { testCases } from "./testCases";
import { authMiddleware } from "@/middleware/authMiddleware";

jest.mock("@/app/api/services/employee-attendance.service", () => ({
  EmployeeAttendanceService: {
    getEmployeesAttendanceByParams: jest.fn(),
  },
}));

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

describe("API: GET /employee-attendance", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`GET /employee-attendance ${description}`, async () => {
      (authMiddleware as jest.Mock).mockResolvedValue({
        userId: 1,
        roleId: 1,
        employeeId: 1,
      });

      if (description === "should successfully send message with valid data") {
        (EmployeeAttendanceService.getEmployeesAttendanceByParams as jest.Mock).mockResolvedValueOnce({
          total: 100,
          totalPages: 10,
          currentPage: 1,
          attendances: [],
        });
      }

      const queryParams = new URLSearchParams(requestData as unknown as Record<string, string>).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/employee-attendance?${queryParams}`;

      const requestObj = {
        url,
        method: "GET",
      } as any;

      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(expectedStatus);
      expect(body).toEqual(expectedResponse);
    });
  });
});
