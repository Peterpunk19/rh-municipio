import React from "react";
import { Grid2 as Grid, Typography, Stack } from "@mui/material";

export interface RequestAdscriptionDetailsProps {
  newDireccion?: {
    display_name?: string;
    secretaria: {
      display_name: string;
    }
  };
  start_date?: string;
  request_date?: string;
}

export const RequestAdscriptionDetails = (
  { newDireccion, request_date, start_date }: RequestAdscriptionDetailsProps
) => {

  return (
    <>
      <Grid size={5}>
        <Typography variant="subtitle1" color="text.secondary">
          Nueva adscripción
        </Typography>
      </Grid>
      <Grid size={7}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {newDireccion?.secretaria.display_name} - {newDireccion?.display_name || "-"}
          </Typography>
        </Stack>
      </Grid>
      {request_date && (
        <>
          <Grid size={{ lg: 5, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Fecha de solicitud
            </Typography>
          </Grid>
          <Grid size={{ lg: 7, xs: 12 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                {new Date(request_date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Stack>
          </Grid>
        </>
      )}
      {start_date && (
        <>
          <Grid size={{ lg: 5, xs: 12 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Fecha de inicio
            </Typography>
          </Grid>
          <Grid size={{ lg: 7, xs: 12 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                {new Date(start_date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Stack>
          </Grid>
        </>
      )}
    </>
  );
};

export default RequestAdscriptionDetails;
