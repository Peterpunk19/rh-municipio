"use client";

import * as React from "react";
import { formatScheduleText } from "@/utils/formatter";
import { Grid2 as Grid, Typography } from "@mui/material";

const LocationScheduleTab = ({ employeeData }: EmployeePageProps) => {
  return (
    <Grid container>
      <Grid size={3}>
        <Typography variant="subtitle1" color="text.secondary">
          Ubicación:
        </Typography>
      </Grid>
      <Grid size={9}>
        <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
          {employeeData?.employee_location[0]?.location?.display_name}
        </Typography>
      </Grid>
      <Grid size={3}>
        <Typography variant="subtitle1" color="text.secondary">
          Tipo de asistencia:
        </Typography>
      </Grid>
      <Grid size={9}>
        {employeeData.employee_attendance_type.length ? (
          <Typography variant="subtitle1" fontWeight={600} mb={0.5} sx={{ whiteSpace: "pre-line" }}>
            {employeeData.employee_attendance_type[0].attendance.display_name}
          </Typography>
        ) : (
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            No tiene asignado
          </Typography>
        )}
      </Grid>
      <Grid size={3}>
        <Typography variant="subtitle1" color="text.secondary">
          Horario:
        </Typography>
      </Grid>
      <Grid size={9}>
        {employeeData.job_schedule_employee.length ? (
          <Typography variant="subtitle1" fontWeight={600} mb={0.5} sx={{ whiteSpace: "pre-line" }}>
            {formatScheduleText(employeeData.job_schedule_employee)}
          </Typography>
        ) : (
          <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
            No tiene asignado
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};
export default LocationScheduleTab;
