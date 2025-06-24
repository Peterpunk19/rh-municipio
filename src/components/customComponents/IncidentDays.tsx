"use client";

import React from "react";
import {Grid2 as Grid, Typography, Divider, Paper, Chip} from "@mui/material";
import Box from "@mui/material/Box";
import {IEmployeeIncidentDetails} from "@/components/types/IEmployeeIncident";
import {formatDate} from "@/utils/formatter";

type Props = {
  data: IEmployeeIncidentDetails;
};

const IncidentDays: React.FC<Props> = ({ data }) => {
  const {
    employee_incident_days,
  } = data;

  return (
    <Paper variant="outlined" sx={{ height: "100%" }}>
      <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
        <Grid container>
          <Grid size={{ lg: 12, xs: 12 }} mb={2}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              FECHAS DE INCIDENCIA
            </Typography>
            <Divider></Divider>
          </Grid>
          <Grid size={{ lg: 12, xs: 12 }}>

            {employee_incident_days.map((item: { date: string }, index) => (
              <Chip
                key={index}
                label={formatDate(item.date, "dd/MM/yyyy")}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ mr: 1}}
              />
            ))}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default IncidentDays;
