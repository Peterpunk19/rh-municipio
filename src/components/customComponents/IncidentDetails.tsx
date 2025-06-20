"use client";

import React from "react";
import {Grid2 as Grid, Typography, Divider, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import {IEmployeeIncidentDetails} from "@/components/types/IEmployeeIncident";
import {formatDate} from "@/utils/formatter";

type Props = {
  data: IEmployeeIncidentDetails;
};

const IncidentDetails: React.FC<Props> = ({ data }) => {
  const {
    start_date,
    end_date,
  } = data;

  return (
    <Paper variant="outlined" sx={{ height: "100%" }}>
      <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
        <Grid container>
          <Grid size={{ lg: 12, xs: 12 }} mb={2}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              DETALLES DE INCIDENCIA
            </Typography>
            <Divider></Divider>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Tipo de incidencia
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {data.incident.display_name}
            </Typography>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Fecha Inicio
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {formatDate(start_date)}
            </Typography>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Fecha Término
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {formatDate(end_date)}
            </Typography>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Solicitud por
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              -
            </Typography>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Aprobado por
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              -
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default IncidentDetails;
