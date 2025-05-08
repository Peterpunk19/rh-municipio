import React from "react";
import { Grid2 as Grid, Typography, Stack, Box } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { formatDate } from "@/utils/formatter";
export interface RequestAttendanceDetailsProps {
  currentAttendance?: {
    display_name?: string;
  };
  newAttendance?: {
    display_name?: string;
  };
  attendanceDate?: string | Date | null;
}

export const RequestAttendanceDetails = ({ currentAttendance, newAttendance, attendanceDate }: RequestAttendanceDetailsProps) => {

  return (
    <>
      <Grid size={5}>
        <Typography variant="subtitle1" color="text.secondary">
          Cambio de tipo de checado
        </Typography>
      </Grid>
      <Grid size={7}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {currentAttendance?.display_name || "-"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ArrowForwardIcon sx={{ fontSize: "0.9rem"}} />
          </Box>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
            {newAttendance?.display_name || "-"}
          </Typography>
        </Stack>
      </Grid>
      <Grid size={5}>
        <Typography variant="subtitle1" color="text.secondary">
          Fecha aplicación
        </Typography>
      </Grid>
      <Grid size={7}>
        <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
          {formatDate(attendanceDate)}
        </Typography>
      </Grid>
    </>
  );
};

export default RequestAttendanceDetails;
