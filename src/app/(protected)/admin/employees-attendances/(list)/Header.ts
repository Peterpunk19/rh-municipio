import type { HeadCell } from "@/interfaces/HeadCell";

export const header: readonly HeadCell[] = [
  {
    id: "employee.name",
    concatValues: ["employee.paternal_last_name", "employee.maternal_last_name"],
    numeric: false,
    disablePadding: false,
    label: "Empleado",
    children: [
      {
        id: "employee.number_employee",
        numeric: false,
        disablePadding: false,
        label: "CURP",
      },
    ],
  },
  {
    id: "check_in",
    numeric: false,
    disablePadding: false,
    label: "Fecha de entrada",
  },
  {
    id: "check_out",
    numeric: false,
    disablePadding: false,
    label: "Fecha de salida",
  },
  {
    id: "job_schedule_employee.start_hour.display_name",
    numeric: false,
    disablePadding: false,
    label: "Schedule",
    children: [
      {
        id: "job_schedule_employee.end_hour.display_name",
        numeric: false,
        disablePadding: false,
        label: "End Hour",
      },
    ],
  },
  {
    id: "job_schedule_calendar.start_hour.display_name",
    numeric: false,
    disablePadding: false,
    label: "Calendar",
    children: [
      {
        id: "job_schedule_calendar.end_hour.display_name",
        numeric: false,
        disablePadding: false,
        label: "End Hour",
      },
    ],
  },
  {
    id: "employee_attendace_incident",
    numeric: false,
    disablePadding: false,
    label: "Incidencias",
    children: [
      {
        id: "employee_attendance_incident[0].employee_incident.incident.display_name",
        numeric: false,
        disablePadding: false,
        label: "Incidencias",
      },
      {
        id: "employee_attendance_incident[1].employee_incident.incident.display_name",
        numeric: false,
        disablePadding: false,
        label: "Incidencias",
      },
      {
        id: "employee_attendance_incident[2].employee_incident.incident.display_name",
        numeric: false,
        disablePadding: false,
        label: "Incidencias",
      },
      {
        id: "employee_attendance_incident[3].employee_incident.incident.display_name",
        numeric: false,
        disablePadding: false,
        label: "Incidencias",
      },
    ],
  },
  {
    id: "type_attendance.display_name",
    numeric: false,
    disablePadding: false,
    label: "Asistencia",
  },
  {
    id: "location.display_name",
    numeric: false,
    disablePadding: false,
    label: "Ubicación",
  },
  {
    id: "created_at",
    numeric: false,
    disablePadding: false,
    label: "Fecha de creación",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Acciones",
  },
];
