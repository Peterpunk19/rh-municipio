import { GET } from "@/app/api/employee-requests/[id]/pdf/route";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { testCases } from "./testCases";

jest.mock("@/app/api/services/employee-request.service", () => ({
  EmployeeRequestService: {
    getEmployeeRequestForPDF: jest.fn(),
  },
}));

describe("API: GET /employee-requests/:id/pdf", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (EmployeeRequestService.getEmployeeRequestForPDF as jest.Mock).mockImplementation(async (id) => {
      if (isNaN(id)) {
        return null;
      }
      return {
        folio: "000001",
        oficio: "000001",
        request_date: "2025-07-09T00:00:00.000Z",
        created_at: "2025-07-09T00:00:00.000Z",
        employee: {
          name: "JUAN",
          paternal_last_name: "PEREZ",
          maternal_last_name: "GARCIA",
          number_employee: "123456",
          rfc: "PEGJ850101ABC",
          curp: "PEGJ850101HCCRNN01",
          employee_hiring: [
            {
              direccion: {
                display_name: "DIRECCIÓN DE RECURSOS HUMANOS",
                secretaria: {
                  display_name: "OFICIALÍA MAYOR",
                },
              },
            },
          ],
          employee_attendance_type: [
            {
              attendance: {
                display_name: "RELOJ DIGITAL",
              },
            },
          ],
          job_schedule_employee: [],
        },
        request: {
          display_name: "Cambio de Adscripción",
        },
        description: "Solicitud de cambio de adscripción por necesidades del servicio",
        rhDirector: {
          id: 1,
          name: "CRISTOBAL",
          paternal_last_name: "FLORES",
          maternal_last_name: "LÓPEZ",
        },
        destinationDirector: {
          id: 2,
          name: "MARIA",
          paternal_last_name: "GONZALEZ",
          maternal_last_name: "MARTINEZ",
        },
        changeDate: "2025-07-15T00:00:00.000Z",
        leaveDate: null,
        requestDetail: {
          id: 1,
          start_date: "2025-07-15T00:00:00.000Z",
          end_date: null,
          new_direccion: {
            id: 5,
            name: "DIRECCION_PARTICIPACION_CIUDADANA",
            display_name: "DIRECCIÓN DE PARTICIPACIÓN CIUDADANA",
            secretaria: {
              id: 2,
              name: "SECRETARIA_GENERAL",
              display_name: "SECRETARÍA GENERAL",
            },
          },
        },
      };
    });
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`GET /employee-requests/:id/pdf ${description}`, async () => {
      // Customize mocks for specific cases
      if (description.includes("incomplete data")) {
        (EmployeeRequestService.getEmployeeRequestForPDF as jest.Mock).mockResolvedValueOnce({
          folio: "000001",
          oficio: "000001",
          request_date: "2025-07-09T00:00:00.000Z",
          created_at: "2025-07-09T00:00:00.000Z",
          employee: {
            name: "JUAN",
            paternal_last_name: "PEREZ",
            maternal_last_name: "GARCIA",
            number_employee: "123456",
            rfc: "PEGJ850101ABC",
            curp: "PEGJ850101HCCRNN01",
            employee_hiring: [
              {
                direccion: {
                  display_name: "DIRECCIÓN DE RECURSOS HUMANOS",
                  secretaria: {
                    display_name: "OFICIALÍA MAYOR",
                  },
                },
              },
            ],
            employee_attendance_type: [
              {
                attendance: {
                  display_name: "RELOJ DIGITAL",
                },
              },
            ],
            job_schedule_employee: [],
          },
          request: {
            display_name: "Cambio de Adscripción",
          },
          description: "Solicitud de cambio de adscripción por necesidades del servicio",
        });
      } else if (
        description.includes("id too long") ||
        description.includes("id zero") ||
        description.includes("id negative")
      ) {
        (EmployeeRequestService.getEmployeeRequestForPDF as jest.Mock).mockResolvedValueOnce(null);
      }

      const { id, isPDF, requestDate } = requestData;
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/employee-requests/${id}/pdf`);

      if (isPDF !== undefined) {
        url.searchParams.append("isPDF", isPDF.toString());
      }
      if (requestDate) {
        url.searchParams.append("requestDate", requestDate);
      }

      const requestObj = {
        url: url.toString(),
        method: "GET",
      } as any;

      const response = await GET(requestObj, { params: { id: id.toString() } } as any);
      const body = await response.json();

      expect(response.status).toBe(expectedStatus);
      expect(body).toEqual(expectedResponse);
    });
  });
});
