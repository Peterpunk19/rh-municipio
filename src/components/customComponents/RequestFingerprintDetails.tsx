import React from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface RequestFingerprintDetailsProps {
  location?: {
    display_name?: string;
  };
  requestDate?: Date | string | null;
}

export const RequestFingerprintDetails = ({ location, requestDate }: RequestFingerprintDetailsProps) => {
  const formatDate = (date: Date | string | null | undefined, formatStr = "dd/MM/yyyy") => {
    if (!date) return "-";
    try {
      return format(new Date(date), formatStr, { locale: es });
    } catch {
      return "-";
    }
  };

  return (
    <>
      <Grid size={{ lg: 5, xs: 12 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Ubicación
        </Typography>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
          {location?.display_name?.toUpperCase() || "-"}
        </Typography>
      </Grid>
      <Grid size={{ lg: 5, xs: 12 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Fecha registro de huella
        </Typography>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
          {formatDate(requestDate)}
        </Typography>
      </Grid>
    </>
  );
};

export default RequestFingerprintDetails;
