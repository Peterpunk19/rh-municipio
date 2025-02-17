import { POST } from "@/app/api/employees/create/route";
import { EmployeeService } from "@/app/api/services/employee.service";
import { testCases } from "./testCases";
import { EmployeeTypeService } from "@/app/api/services/employeeType.service";

jest.mock("@/app/api/services/employee.service", () => ({
  EmployeeService: {
    getNumberEmployee: jest.fn(),
    getEmployeeByRfcCurp: jest.fn(),
    createEmployee: jest.fn(),
  },
}));

jest.mock("@/app/api/services/employeeType.service", () => ({
  EmployeeTypeService: {
    getEmployeeTypeByName: jest.fn(),
  },
}));

describe("API: /employees", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /employees ${description}`, async () => {
      if (description === "should return error for existing employee by RFC or CURP") {
        (EmployeeService.getEmployeeByRfcCurp as jest.Mock).mockResolvedValueOnce({
          rfc: requestData.rfc,
          curp: requestData.curp,
        });
      }

      if (description === "should successfully send message with valid data") {
        (EmployeeService.getEmployeeByRfcCurp as jest.Mock).mockResolvedValueOnce(null);
        (EmployeeTypeService.getEmployeeTypeByName as jest.Mock).mockResolvedValueOnce({});
        (EmployeeService.createEmployee as jest.Mock).mockResolvedValueOnce([{}, {}]);
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
