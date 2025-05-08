"use client";

import React from "react";
import {Grid2 as Grid, Typography, Divider, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import {IEmployeeIncidentDetails} from "@/components/types/IEmployeeIncident";

type EmployeeRequestData = {
  name: string;
  employeeNumber?: string;
  rfc?: string;
  curp?: string;
  publicOrganization?: string;
  administrativeOrganization?: string;
  category?: string;
};

type Props = {
  data: IEmployeeIncidentDetails | EmployeeRequestData;
};

const EmployeeDetails: React.FC<Props> = ({ data }) => {
  const isIncidentData = 'employee' in data;
  
  const employeeName = isIncidentData 
    ? `${data.employee.name} ${data.employee.paternal_last_name} ${data.employee.maternal_last_name}`
    : data.name;

  const publicOrganization = isIncidentData
    ? data.employee.employee_hiring?.[0]?.direccion?.secretaria?.display_name ?? "—"
    : data.publicOrganization ?? "—";

  const administrativeOrganization = isIncidentData
    ? data.employee.employee_hiring?.[0]?.direccion?.display_name ?? "—"
    : data.administrativeOrganization ?? "—";

  const category = isIncidentData
    ? data.employee.employee_hiring?.[0]?.category?.display_name ?? "—"
    : data.category ?? "—";

  return (
    <Paper variant="outlined" sx={{ height: "100%" }}>
      <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
        <Grid container>
          <Grid size={{ lg: 12, xs: 12 }} mb={2}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              DATOS DEL EMPLEADO
            </Typography>
            <Divider />
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Nombre
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {employeeName}
            </Typography>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Organismo público
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {publicOrganization}
            </Typography>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Organismo administrativo
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {administrativeOrganization}
            </Typography>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Categoría
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {category}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EmployeeDetails;
