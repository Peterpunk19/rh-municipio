"use client";

import React from "react";
import { Grid2 as Grid, Typography, Divider, Paper, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { IEmployeeIncidentDetails } from "@/components/types/IEmployeeIncident";
import { formatDate } from "@/utils/formatter";

type Props = {
  data: IEmployeeIncidentDetails;
};

const IncidentStatusHistory: React.FC<Props> = ({ data }) => {
  const { employee_incidents_status } = data;

  return (
    <Paper variant="outlined">
      <Box p={3}>
        {/* Header */}
        <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
          HISTORIAL DE ESTATUS
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Timeline */}
        <Box sx={{ position: "relative"}}>
          <Stack spacing={2}>
            {employee_incidents_status.map((row: any, index: number) => {
              const fullName = `${row.created_by.name} ${row.created_by.paternal_last_name} ${row.created_by.maternal_last_name}`;

              return (
                <Box key={row.id} display="flex" alignItems="flex-start" gap={1}>
                  {/* Punto */}
                  <Box
                    sx={{
                      mt: "6px",
                      minWidth: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: (theme) =>
                        theme.palette[row.incident_status.btn_color]?.main ||
                        theme.palette.grey[500],
                      zIndex: 1,
                    }}
                  />

                  {/* Contenido */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {row.incident_status.display_name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {`Incidencia ${row.incident_status.display_name} por ${fullName}`}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {formatDate(row.created_at, "dd/MM/yyyy HH:mm")}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default IncidentStatusHistory;