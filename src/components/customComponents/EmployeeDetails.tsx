"use client";

import React from "react";
import {Grid2 as Grid, Typography, Divider, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import {IEmployeeIncidentDetails} from "@/components/types/IEmployeeIncident";

type Props = {
  data: IEmployeeIncidentDetails;
};

const EmployeeDetails: React.FC<Props> = ({ data }) => {
  const {
    name,
    paternal_last_name,
    maternal_last_name,
    employee_hiring = [],
  } = data.employee;

  const hiring = employee_hiring[0];

  return (
    <Paper variant="outlined" sx={{ height: "100%" }}>
      <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
        <Grid container>
          <Grid size={{ lg: 12, xs: 12 }} mb={2}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              DATOS DEL EMPLEADO
            </Typography>
            <Divider></Divider>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Nombre
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography
              variant="subtitle1"
              mb={0.5}
              fontWeight={600}
            >
              {`${name} ${paternal_last_name} ${maternal_last_name}`}
            </Typography>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Organismo público
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {hiring?.direccion?.secretaria?.display_name ?? "—"}
            </Typography>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Organismo administrativo
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {hiring?.direccion?.display_name ?? "—"}
            </Typography>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Categoría
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {hiring?.category?.display_name ?? "—"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default EmployeeDetails;
