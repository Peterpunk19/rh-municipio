import { createUserWithRole } from "../helpers/createUserWithRole";
import { GET as getIncidentById } from "@/app/api/employee-incidents/[id]/route";
import { POST as createIncident } from "@/app/api/employee-incidents/create/route";
import { PUT as updateIncident } from "@/app/api/employee-incidents/update/route";
import { createRequest } from "../helpers/createRequest";
import { auth } from "@/auth";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

describe("E2E employee incident creation and validation flow", () => {
  let empleadoId: number;
  let employeeIncidentId: number;
  let empleado: any;
  let enlace: any;
  let admin: any;

  beforeAll(async () => {
    empleado = await createUserWithRole("empleado", "digital_clock");
    enlace = await createUserWithRole("enlace", "digital_clock");
    admin = await createUserWithRole("admin", "digital_clock");

    empleadoId = empleado.id;
  });

  it("create employee incident by admin", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: admin.userId, role: admin.roleId },
    });

    const req = createRequest("/api/employee-incidents/create", {
      method: "POST",
      body: {
        employeeId: empleadoId,
        incidentId: 11,
        startDate: "2026-02-25",
        endDate: "2026-02-25",
        description: "Carlos Ricardo",
        incidentDates: ["2026-02-25"],
      },
    });

    const res = await createIncident(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    employeeIncidentId = body.responseObject.id;
  });

  it("get details employee incident", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: empleado.userId, role: empleado.roleId, employeeId: empleado.empleadoId },
    });

    const req = createRequest(`/api/employee-incidents/${employeeIncidentId}`, {});

    const res = await getIncidentById(req, {
      params: Promise.resolve({
        id: employeeIncidentId.toString(),
      }),
    });
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.responseObject.incident_status.display_name).toBe("CREADA");
  });

  it("validate employee incident", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: enlace.userId, role: enlace.roleId, employeeId: empleado.empleadoId },
    });

    const req = createRequest("/api/employee-incidents/update", {
      method: "POST",
      body: {
        id: employeeIncidentId,
        incidentStatusId: 2,
      },
    });

    const res = await updateIncident(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.responseObject.incident_status_id).toBe(2);
  });

  it("4️⃣ admin la aprueba", async () => {
    (auth as jest.Mock).mockResolvedValue({
      user: { id: admin.userId, role: admin.roleId, employeeId: empleado.empleadoId },
    });

    const req = createRequest("/api/employee-incidents/update", {
      method: "POST",
      body: {
        id: employeeIncidentId,
        incidentStatusId: 3,
      },
    });

    const res = await updateIncident(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.responseObject.incident_status_id).toBe(3);
  });
});
