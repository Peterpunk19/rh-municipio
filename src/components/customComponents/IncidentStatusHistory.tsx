"use client";

import React from "react";
import {Grid2 as Grid, Typography, Divider, Paper} from "@mui/material";
import Box from "@mui/material/Box";
import {IEmployeeIncidentDetails} from "@/components/types/IEmployeeIncident";
import {formatDate} from "@/utils/formatter";
import {generateUniqueKey} from "@/utils";

type Props = {
  data: IEmployeeIncidentDetails;
};

const IncidentStatusHistory: React.FC<Props> = ({ data }) => {
  const {
    employee_incidents_status,
  } = data;

  return (
    <Paper variant="outlined" sx={{ height: "100%" }}>
      <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
        <Grid container>
          <Grid size={{ lg: 12, xs: 12 }} mb={2}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              HISTORIAL DE ESTATUS
            </Typography>
            <Divider></Divider>
          </Grid>
          <Grid mt={2} size={{ lg: 12, xs: 12 }}>
            {employee_incidents_status.map((row: any) => {
                return (
                  <Box key={generateUniqueKey()} display="flex" alignItems="center">
                    <Box
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette[row.incident_status.btn_color]?.main || theme.palette.grey[500],
                        borderRadius: "100%",
                        height: "10px",
                        width: "10px",
                      }}
                    />
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(row.created_at, "dd/MM/yyyy HH:mm")}
                      </Typography>
                      <Typography variant="subtitle2" fontWeight={600} mb={2} component="div">
                        {`INCIDENCIA ${row.incident_status.display_name} POR ${row.created_by.name} ${row.created_by.paternal_last_name} ${row.created_by.paternal_last_name}`}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default IncidentStatusHistory;
