"use client";

import * as React from "react";
import { formatDate } from "@/utils/formatter";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Grid2 as Grid } from "@mui/material";
import Divider from "@mui/material/Divider";

type PersonalField = {
  label: string;
  value: string | undefined;
  size?: { lg: number; xs: number };
  mt?: number;
};

const InfoItem = ({ label, value, size = { lg: 4, xs: 12 }, mt = 2 }: PersonalField) => (
  <Grid mt={mt} size={size}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
      {value || "-"}
    </Typography>
  </Grid>
);

const PersonalTab = ({ employeeData }: EmployeePageProps) => {
  const fields: PersonalField[] = [
    {
      label: "CURP",
      value: employeeData.curp,
      mt: 4,
    },
    {
      label: "RFC",
      value: employeeData.rfc,
      mt: 4,
    },
    {
      label: "Fecha de nacimiento",
      value: formatDate(employeeData.birthday),
    },
    {
      label: "Género",
      value: employeeData?.gender?.display_name,
    },
    {
      label: "Estado Civil",
      value: employeeData?.marital_status?.display_name,
    },
    {
      label: "Escolaridad",
      value: employeeData?.schooling?.display_name,
    },
    {
      label: "Ocupación",
      value: employeeData?.schooling?.display_name,
    },
    {
      label: "Profesión",
      value: employeeData?.profession?.display_name,
    },
    {
      label: "Tipo de identificacion",
      value: employeeData?.identification_type?.display_name,
    },
    {
      label: "Folio de identificación",
      value: employeeData?.identification_folio,
    },
  ];

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" mb={0.5}>
          Datos personales
        </Typography>
      </Box>
      <Divider />
      <Grid container>
        {fields.map((field, idx) => (
          <InfoItem key={idx} {...field} />
        ))}
      </Grid>
    </Box>
  );
};
export default PersonalTab;
