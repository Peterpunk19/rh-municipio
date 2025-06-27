import React from "react";
import { Grid2 as Grid, Typography, Stack } from "@mui/material";

export interface RequestAdscriptionDetailsProps {
  newDireccion?: {
    display_name?: string;
    secretaria: {
      display_name: string;
    }
  };
  currentLocation?: {
    display_name?: string;
  };
  newLocation?: {
    display_name?: string;
  };
  attendance?: {
    display_name?: string;
  };
}

export const RequestAdscriptionDetails = (
  { newDireccion, newLocation, attendance }: RequestAdscriptionDetailsProps
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
      <Grid size={{ lg: 5, xs: 12 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Ubicación
        </Typography>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {newLocation?.display_name?.toUpperCase() || "-"}
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ lg: 5, xs: 12 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Tipo de checado
        </Typography>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {attendance?.display_name?.toUpperCase() || "-"}
          </Typography>
        </Stack>
      </Grid>
    </>
  );
};

export default RequestAdscriptionDetails;
