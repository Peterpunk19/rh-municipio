import { GET } from "@/app/api/employee-incidents/[id]/route";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { testCases } from "./testCases";

jest.mock("@/app/api/services/employee-incidents.service", () => ({
  EmployeeIncidentsService: {
    getEmployeeIncidentById: jest.fn(),
  },
}));

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

const { authMiddleware } = jest.requireMock("@/middleware/authMiddleware");

describe("API: GET /employee-incidents/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`GET /employee-incidents/:id ${description}`, async () => {
      authMiddleware.mockResolvedValue({ userId: 1, roleId: 1 });

      if (description === "should successfully send message with valid data") {
        (EmployeeIncidentsService.getEmployeeIncidentById as jest.Mock).mockResolvedValueOnce({
          id: 511,
          folio: "000238",
          oficio: "",
          start_date: "2021-05-25T07:49:16.597Z",
          end_date: "2007-09-28T22:45:40.634Z",
          description: "TEST IMPORT",
          incident_id: 5,
          incident_status_id: 3,
          employee_id: 1,
          employee_attendance_id: null,
          created_at: "2025-02-25T20:54:07.868Z",
          validated_at: "2025-02-25T20:54:07.868Z",
          active: true,
          employee: {
            id: 1,
            number_employee: "12609",
            name: "MA. DE JESUS",
            paternal_last_name: "AGUEDA",
            maternal_last_name: "LOPEZ",
            birthday: "1967-02-18T00:00:00.000Z",
            rfc: "AULJ-670218",
            curp: "AULJ-670218",
            active: true,
            created_at: "2025-02-19T21:23:53.575Z",
            updated_at: "2025-02-19T21:23:53.948Z",
            user_id: 12,
            status_employee_id: 2,
            gender_id: 2,
            employee_hiring_id: 5,
            director_id: null,
            sustitute_id: null,
            marital_status_id: null,
            schooling_id: null,
            profession_id: null,
            occupation_id: null,
            identification_type_id: null,
            trade_union_id: null,
          },
        });
      }
      const id = requestData.id;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/employee-incidents/${id}`;

      const requestObj = {
        url,
        method: "GET",
      } as any;

      const response = await GET(requestObj, { params: { id: id.toString() } } as any);
      const body = await response.json();
      expect(response.status).toBe(expectedStatus);
      expect(body).toEqual(expectedResponse);
    });
  });
});
