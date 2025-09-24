"use client";

import * as React from "react";
import { Grid2 as Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import Tab from "@/components/shared/tabs/Tab";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { formatDate } from "@/utils/formatter";

const AddressTab = ({ employeeData }: EmployeePageProps) => {
  const displayData = {
    addressLine1: employeeData?.employee_address[0]?.address_line_1,
    addressLine2: employeeData?.employee_address[0]?.address_line_2,
    addressLine3: employeeData?.employee_address[0]?.address_line_3,
    addressLine4: employeeData?.employee_address[0]?.address_line_4,
    postalCode: employeeData?.employee_address[0]?.postal_code,
    municipalityDisplayName: employeeData?.employee_address[0]?.municipality?.display_name,
    stateDisplayName: employeeData?.employee_address[0]?.municipality?.state?.display_name,
  };

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center">
        <Box>
          <Typography variant="h6" mb={0.5}>
            Datos de domicilio
          </Typography>
        </Box>
      </Box>
      <Divider />
      <Grid container>
        <Grid
          mt={4}
          size={{
            lg: 4,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Calle
          </Typography>
          <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
            {displayData.addressLine1}
          </Typography>
        </Grid>
        <Grid
          mt={4}
          size={{
            lg: 2,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Número exterior
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {displayData.addressLine2}
          </Typography>
        </Grid>
        <Grid
          mt={4}
          size={{
            lg: 2,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Número interior
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {displayData.addressLine3}
          </Typography>
        </Grid>
        <Grid
          mt={4}
          size={{
            lg: 4,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Colonia
          </Typography>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {displayData.addressLine4}
          </Typography>
        </Grid>
        <Grid
          mt={2}
          size={{
            lg: 4,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Codigo postal
          </Typography>
          <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
            {displayData.postalCode}
          </Typography>
        </Grid>
        <Grid
          mt={2}
          size={{
            lg: 4,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Estado
          </Typography>
          <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
            {displayData.stateDisplayName}
          </Typography>
        </Grid>
        <Grid
          mt={2}
          size={{
            lg: 4,
            xs: 12,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Municipio
          </Typography>
          <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
            {displayData.municipalityDisplayName}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
export default AddressTab;
