"use client";

import React from "react";
import { Grid2 as Grid, Typography, Divider, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { IEmployeeIncidentDetails } from "@/components/types/IEmployeeIncident";
import { formatDate } from "@/utils/formatter";
import { calculateDaysBetweenDates } from "@/common/utils";

type Props = {
  data: IEmployeeIncidentDetails & {
    created_by?: {
      name: string;
      paternal_last_name: string;
      maternal_last_name: string;
    };
    validated_by?: {
      name: string;
      paternal_last_name: string;
      maternal_last_name: string;
    };
  };
};

const IncidentDetails: React.FC<Props> = ({ data }) => {
  const { start_date, end_date } = data;

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
          {start_date && end_date && (
            <>
              <Grid size={{ lg: 3, xs: 12 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Días Totales
                </Typography>
              </Grid>
              <Grid size={{ lg: 9, xs: 12 }}>
                <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                  {calculateDaysBetweenDates(start_date, end_date)}
                </Typography>
              </Grid>
            </>
          )}
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Solicitado por
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {data.created_by && Object.keys(data.created_by).length > 0
                ? data.created_by.name +
                  " " +
                  data.created_by.paternal_last_name +
                  " " +
                  data.created_by.maternal_last_name
                : "-"}
            </Typography>
          </Grid>
          <Grid size={{ lg: 3, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Aprobado por
            </Typography>
          </Grid>
          <Grid size={{ lg: 9, xs: 12 }}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              {data.validated_by && Object.keys(data.validated_by).length > 0
                ? data.validated_by.name +
                  " " +
                  data.validated_by.paternal_last_name +
                  " " +
                  data.validated_by.maternal_last_name
                : "-"}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default IncidentDetails;
