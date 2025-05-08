import React from "react";
import { Grid2 as Grid, Typography, Stack, Box } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { formatDate } from "@/utils/formatter";
export interface RequestLocationDetailsProps {
  currentLocation?: {
    display_name?: string;
  };
  newLocation?: {
    display_name?: string;
  };
  startAt?: string | Date | null;
  endAt?: string | Date | null;
  requestAt?: string | Date | null;
}

export const RequestLocationDetails = ({ currentLocation, newLocation, startAt, endAt, requestAt }: RequestLocationDetailsProps) => {
  return (
    <>
      <Grid size={{ lg: 5, xs: 12 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Cambio de ubicación
        </Typography>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
          {currentLocation?.display_name?.toUpperCase() || "-"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ArrowForwardIcon sx={{ fontSize: "0.9rem"}} />
          </Box>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
          {newLocation?.display_name?.toUpperCase() || "-"}
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ lg: 5, xs: 12 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Fecha de solicitud
        </Typography>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
          {requestAt ? formatDate(requestAt, "dd/MM/yyyy") : "-"}
        </Typography>
      </Grid>
      <Grid size={{ lg: 5, xs: 12 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Fecha de inicio
        </Typography>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
          {startAt ? formatDate(startAt, "dd/MM/yyyy") : "-"}
        </Typography>
      </Grid>
      <Grid size={{ lg: 5, xs: 12 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Fecha de fin
        </Typography>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
          {endAt ? formatDate(endAt, "dd/MM/yyyy") : "-"}
        </Typography>
      </Grid>
    </>
  );
};

export default RequestLocationDetails;
