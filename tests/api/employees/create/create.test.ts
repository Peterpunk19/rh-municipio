import { POST } from "@/app/api/employees/create/route";
import { dataProvider } from "./dataProvider";
import { EmployeeService } from "@/app/api/services/employee.service";
import type { IEmployee } from "@/app/api/employees/interface";

jest.mock("@/app/api/services/employee.service", () => ({
  EmployeeService: {
    getEmployeeByRfcCurp: jest.fn(),
    createEmployee: jest.fn(),
  },
}));

describe("API: /employees", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      description: "should return invalid request",
      requestData: {} as IEmployee,
      expectedStatus: dataProvider.invalidRequest.status,
      expectedResponse: dataProvider.invalidRequest.response,
    },
    {
      description: "should return error for empty number employee",
      requestData: dataProvider.emptyNumberEmployee.request as IEmployee,
      expectedStatus: dataProvider.emptyNumberEmployee.status,
      expectedResponse: dataProvider.emptyNumberEmployee.response,
    },
    {
      description: "should return error for empty name",
      requestData: dataProvider.emptyName.request as IEmployee,
      expectedStatus: dataProvider.emptyName.status,
      expectedResponse: dataProvider.emptyName.response,
    },
    {
      description: "should return error for empty paternal last name",
      requestData: dataProvider.emptyPaternalLastName.request,
      expectedStatus: dataProvider.emptyPaternalLastName.status,
      expectedResponse: dataProvider.emptyPaternalLastName.response,
    },
    {
      description: "should return error for empty maternal last name",
      requestData: dataProvider.emptyMaternalLastName.request,
      expectedStatus: dataProvider.emptyMaternalLastName.status,
      expectedResponse: dataProvider.emptyMaternalLastName.response,
    },
    {
      description: "should return error for empty birthday",
      requestData: dataProvider.emptyBirthday.request,
      expectedStatus: dataProvider.emptyBirthday.status,
      expectedResponse: dataProvider.emptyBirthday.response,
    },
    {
      description: "should return error for empty gender id",
      requestData: dataProvider.emptyGenderId.request,
      expectedStatus: dataProvider.emptyGenderId.status,
      expectedResponse: dataProvider.emptyGenderId.response,
    },
    {
      description: "should return error for empty rfc",
      requestData: dataProvider.emptyRfc.request as IEmployee,
      expectedStatus: dataProvider.emptyRfc.status,
      expectedResponse: dataProvider.emptyRfc.response,
    },
    {
      description: "should return error for empty curp",
      requestData: dataProvider.emptyCurp.request as IEmployee,
      expectedStatus: dataProvider.emptyCurp.status,
      expectedResponse: dataProvider.emptyCurp.response,
    },
    {
      description: "should return error for long number employee",
      requestData: dataProvider.longNumberEmployee.request as IEmployee,
      expectedStatus: dataProvider.longNumberEmployee.status,
      expectedResponse: dataProvider.longNumberEmployee.response,
    },
    {
      description: "should return error for long name",
      requestData: dataProvider.longName.request as IEmployee,
      expectedStatus: dataProvider.longName.status,
      expectedResponse: dataProvider.longName.response,
    },
    {
      description: "should return error for long paternal last name",
      requestData: dataProvider.longPaternalLastName.request as IEmployee,
      expectedStatus: dataProvider.longPaternalLastName.status,
      expectedResponse: dataProvider.longPaternalLastName.response,
    },
    {
      description: "should return error for long maternal last name",
      requestData: dataProvider.longMaternalLastName.request as IEmployee,
      expectedStatus: dataProvider.longMaternalLastName.status,
      expectedResponse: dataProvider.longMaternalLastName.response,
    },
    {
      description: "should return error for existing employee by RFC or CURP",
      requestData: dataProvider.duplicatedRfcCurp.request as IEmployee,
      expectedStatus: dataProvider.duplicatedRfcCurp.status,
      expectedResponse: dataProvider.duplicatedRfcCurp.response,
    },
    {
      description: "should successfully send message with valid data",
      requestData: dataProvider.validData.request as IEmployee,
      expectedStatus: dataProvider.validData.status,
      expectedResponse: dataProvider.validData.response,
    },
  ];

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
