import { PUT } from "@/app/api/employees/[id]/route";
import { EmployeeService } from "@/app/api/services/employee.service";
import { testCases } from "./testCases";
import { EmployeeTypeService } from "@/app/api/services/employeeType.service";

jest.mock("@/app/api/services/employee.service", () => ({
  EmployeeService: {
    getEmployeeById: jest.fn(),
    getEmployeeByRfcCurp: jest.fn(),
    updateEmployee: jest.fn(),
  },
}));

jest.mock("@/app/api/services/employeeType.service", () => ({
  EmployeeTypeService: {
    getEmployeeTypeByName: jest.fn(),
  },
}));

describe("API: /employees/update", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`PUT /employees/update ${description}`, async () => {
      if (description === "should return error for existing employee by RFC or CURP") {
        (EmployeeService.getEmployeeByRfcCurp as jest.Mock).mockResolvedValueOnce({});
      }

      if (description === "should successfully update employee with valid data") {
        (EmployeeService.getEmployeeById as jest.Mock).mockResolvedValueOnce({
          id: 1,
          active: true,
          number_employee: "107991",
        });
        (EmployeeTypeService.getEmployeeTypeByName as jest.Mock).mockResolvedValueOnce({ id: 1 });
        (EmployeeService.updateEmployee as jest.Mock).mockResolvedValueOnce([{ id: 1 }, {}]);
      }

      const requestObj = {
        json: async () => requestData,
      } as any;

      const params = Promise.resolve({ id: "1" });

      const response = await PUT(requestObj, { params });
      const body = await response.json();

      expect(response.status).toBe(expectedStatus);
      expect(body).toEqual(expectedResponse);
    });
  });
});
