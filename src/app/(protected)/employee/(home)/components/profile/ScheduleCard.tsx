"use client";
import React from "react";
import Box from "@mui/material/Box";
import { Divider, Grid2 as Grid, Typography } from "@mui/material";
import LocationScheduleTab from "@/app/(protected)/admin/employees/(profile)/sections/LocationScheduleTab";

const ScheduleCard = ({ employeeData }: { employeeData: any }) => {
  const address = employeeData?.employee_address?.[0];
  const municipality = address?.municipality;
  const state = municipality?.state;

  if (!address) {
    return (
      <Box p={3}>
        <Typography variant="subtitle1" color="error">
          Información de jornada y ubicación.
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
      <LocationScheduleTab employeeData={employeeData} />
    </Box>
  );
};

export default ScheduleCard;
