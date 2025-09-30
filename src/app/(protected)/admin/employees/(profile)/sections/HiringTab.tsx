"use client";

import * as React from "react";
import { formatDate } from "@/utils/formatter";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid2 as Grid } from "@mui/material";

const HiringTab = ({ employeeData }: EmployeePageProps) => {
  const displayData = {
    statusEmployeeDisplayName: employeeData?.status_employee?.display_name,
    startJobDate: formatDate(employeeData?.employee_hiring[0]?.start_job_date),
    endJobDate: formatDate(employeeData?.employee_hiring[0]?.end_job_date),
    categoryDisplayName: employeeData?.employee_hiring[0]?.category?.display_name,
    employeeTypeDisplayName: employeeData?.employee_hiring[0]?.employee_type?.display_name,
    tradeUnionDisplayName: employeeData?.employee_trade_union[0]?.trade_union?.display_name,
  };

  return (
    <Box p={3}>
      <Grid container>
        <Grid
          mt={4}
          size={{
            lg: 3,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Categoria
          </Typography>
          <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
            {displayData.categoryDisplayName}
          </Typography>
        </Grid>
        <Grid
          mt={4}
          size={{
            lg: 3,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Tipo de empleado
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {displayData.employeeTypeDisplayName}
          </Typography>
        </Grid>
        <Grid
          mt={4}
          size={{
            lg: 3,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Fecha de alta
          </Typography>
          <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
            {displayData.startJobDate}
          </Typography>
        </Grid>
        <Grid
          mt={4}
          size={{
            lg: 3,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Fecha de baja
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {displayData.endJobDate}
          </Typography>
        </Grid>
        <Grid
          mt={4}
          size={{
            lg: 3,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Estatus de empleado
          </Typography>
          <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
            {displayData.statusEmployeeDisplayName}
          </Typography>
        </Grid>
        <Grid
          mt={4}
          size={{
            lg: 3,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            SINDICATO
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {displayData.tradeUnionDisplayName}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
export default HiringTab;
