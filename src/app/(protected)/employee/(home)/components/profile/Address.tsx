"use client";
import React from "react";
import Box from "@mui/material/Box";
import { Divider, Grid2 as Grid, Typography } from "@mui/material";

const AddressCard = ({ employeeData }: { employeeData: any }) => {
  const address = employeeData?.employee_address?.[0];
  const municipality = address?.municipality;
  const state = municipality?.state;

  if (!address) {
    return (
      <Box p={3}>
        <Typography variant="subtitle1" color="error">
          Información de domicilio no disponible.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
      <Grid container>
        <Grid size={{ lg: 12, xs: 12 }} mb={2}>
          <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
            Domicilio
          </Typography>
          <Divider />
        </Grid>

        <Grid size={{ lg: 5, xs: 12 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Calle y Número
          </Typography>
        </Grid>
        <Grid size={{ lg: 7, xs: 12 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {address.address_line_1 || "-"} {address.address_line_2 || ""}
          </Typography>
        </Grid>

        <Grid size={{ lg: 5, xs: 12 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Colonia
          </Typography>
        </Grid>
        <Grid size={{ lg: 7, xs: 12 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {address.address_line_4 || "-"}
          </Typography>
        </Grid>

        <Grid size={{ lg: 5, xs: 12 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Código postal
          </Typography>
        </Grid>
        <Grid size={{ lg: 7, xs: 12 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {address.postal_code || "-"}
          </Typography>
        </Grid>

        <Grid size={{ lg: 5, xs: 12 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Estado
          </Typography>
        </Grid>
        <Grid size={{ lg: 7, xs: 12 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {state?.display_name || "-"}
          </Typography>
        </Grid>

        <Grid size={{ lg: 5, xs: 12 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Municipio
          </Typography>
        </Grid>
        <Grid size={{ lg: 7, xs: 12 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {municipality?.display_name || "-"}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressCard;
