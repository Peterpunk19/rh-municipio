"use client";

import * as React from "react";
import { formatDate } from "@/utils/formatter";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid2 as Grid } from "@mui/material";
import Divider from "@mui/material/Divider";

const PersonalTab = ({ employeeData }: EmployeePageProps) => {
  return (
    <Box p={3}>
      <Box display="flex" alignItems="center">
        <Box>
          <Typography variant="h6" mb={0.5}>
            Datos personales
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Grid container>
        <Grid
          mt={4}
          size={{
            lg: 6,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            CURP
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {employeeData.curp}
          </Typography>
        </Grid>
        <Grid
          mt={4}
          size={{
            lg: 6,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            RFC
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {employeeData.rfc}
          </Typography>
        </Grid>
        <Grid
          mt={2}
          size={{
            lg: 6,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Fecha de nacimiento
          </Typography>
          <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
            {formatDate(employeeData.birthday)}
          </Typography>
        </Grid>
        <Grid
          mt={2}
          size={{
            lg: 6,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Genéro
          </Typography>
          <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
            {employeeData?.gender?.display_name}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
export default PersonalTab;
