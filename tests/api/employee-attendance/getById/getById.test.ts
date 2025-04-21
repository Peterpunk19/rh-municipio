import { EmployeeAttendanceService } from "@/app/api/services/employee-attendance.service";
import { testCases } from "./testCases";
import { GET } from "@/app/api/employee-attendance/[id]/route";

jest.mock("@/app/api/services/employee-attendance.service", () => ({
  EmployeeAttendanceService: {
    getEmployeeAttendanceById: jest.fn(),
  },
}));

describe("API: GET /employee-attendance/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`GET /employee-attendance/:id ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (EmployeeAttendanceService.getEmployeeAttendanceById as jest.Mock).mockResolvedValueOnce({
          id: 1,
          check_in: "2025-03-26T14:00:00.000Z",
          check_out: "2025-03-26T22:00:00.000Z",
          active: true,
          description: "Asistencia generada automaticamente",
          created_at: "2025-04-10T00:43:49.735Z",
          location: {
            id: 76,
            active: true,
            name: "el_rastro_pavimento",
            display_name: "EL RASTRO PAVIMENTO"
          },
          type_attendance: {
            id: 1,
            display_name: "RELOJ DIGITAL"
          },
          employee: {
            id: 1,
            number_employee: "453453",
            name: "William",
            paternal_last_name: "dsad",
            maternal_last_name: "ads",
            fullName: "William dsad ads",
            rfc: "asda",
            curp: "asdd"
          },
          organism_public: {
            id: 1,
            name: "gobierno",
            display_name: "Secretaría de gobernación"
          },
          organism_administrative: {
            id: 4,
            name: "medios",
            display_name: "Medios"
          },
          created_by: {
            id: 44,
            username: "carloszh"
          }
        });
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/employee-attendance/${requestData.id}`;
      const requestObj = new Request(url, { method: "GET" });

      const response = await GET(requestObj, { params: { id: requestData.id.toString() } });
      const body = await response.json();
      expect(response.status).toBe(expectedStatus);
      expect(body).toEqual(expectedResponse);
    });
  });
});
