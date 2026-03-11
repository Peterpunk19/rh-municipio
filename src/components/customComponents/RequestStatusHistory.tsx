"use client";

import React from "react";
import { Grid2 as Grid, Typography, Divider, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import { formatDate } from "@/utils/formatter";
import { generateUniqueKey } from "@/utils";

type Props = {
  data: {
    employee_request_status: Array<{
      request_status: {
        id: number;
        display_name: string;
        btn_color: string;
      };
      created_by: {
        name: string;
        paternal_last_name: string;
        maternal_last_name: string;
      };
      created_at?: string;
    }>;
  };
};

const RequestStatusHistory: React.FC<Props> = ({ data }) => {
  return (
    <Paper variant="outlined" sx={{ height: "100%" }}>
      <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
        <Grid container>
          <Grid size={{ lg: 12, xs: 12 }} mb={2}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              HISTORIAL DE ESTATUS
            </Typography>
            <Divider />
          </Grid>
          <Grid mt={2} size={{ lg: 12, xs: 12 }}>
            {data.employee_request_status?.map((row) => {
                return (
              <Box key={generateUniqueKey()} display="flex" alignItems="center">
                <Box
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette[row.request_status?.btn_color]?.main || theme.palette.grey[500],
                    borderRadius: "100%",
                    height: "10px",
                    width: "10px",
                  }}
                />
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(row.created_at, "dd/MM/yyyy HH:mm")}
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={600} component="div">
                    {`SOLICITUD ${row.request_status.display_name} POR ${row.created_by.name} ${row.created_by.paternal_last_name} ${row.created_by.maternal_last_name}`}
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

export default RequestStatusHistory;
