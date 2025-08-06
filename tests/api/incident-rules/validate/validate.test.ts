import { GET } from "@/app/api/incident-rules/validate/route";
import { testCases } from "./testCases";
import { IncidentRulesService } from "@/app/api/services/incident-rules.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import { HttpMessages } from "@/common/response/messages";

jest.mock("@/app/api/services/incident-rules.service", () => ({
  IncidentRulesService: {
    validateIncidentRule: jest.fn(),
  },
}));

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

describe("API: GET /incident-rules/validate", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  jest.mock("@/app/api/services/incident-rules.service", () => ({
    IncidentRulesService: {
      validateIncidentRule: jest.fn(),
    },
  }));

  jest.mock("@/middleware/authMiddleware", () => ({
    authMiddleware: jest.fn(),
  }));

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`GET /incident-rules/validate ${description}`, async () => {
      (authMiddleware as jest.Mock).mockResolvedValue({
        userId: 1,
        roleId: 1,
      });

      if (description === "should successfully validate with valid data") {
        (IncidentRulesService.validateIncidentRule as jest.Mock).mockResolvedValueOnce({
          success: true,
          message: HttpMessages.incidentRules.getSuccess,
          responseObject: {
            isValid: true,
            details: {},
            hasRules: true,
          },
          statusCode: 200,
        });
      }

      const queryParams = new URLSearchParams(requestData as unknown as Record<string, string>).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/incident-rules/validate?${queryParams}`;

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
