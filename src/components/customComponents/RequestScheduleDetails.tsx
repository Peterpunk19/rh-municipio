import React from "react";
import { Grid2 as Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatScheduleText } from "@/utils/formatter";

interface DayOrHour {
  id: number;
  name: string;
  display_name: string;
  active: boolean;
}

interface ScheduleItem {
  id: number;
  start_day: DayOrHour;
  end_day: DayOrHour;
  start_hour: DayOrHour;
  end_hour: DayOrHour;
}

export interface RequestScheduleDetailsProps {
  schedule?: Record<string, ScheduleItem> | Array<any> | string;
  startAt?: string | Date | null;
  endAt?: string | Date | null;
}

export const RequestScheduleDetails = ({ schedule, startAt, endAt }: RequestScheduleDetailsProps) => {
  const formatDate = (date: Date | string | null | undefined, formatStr = "dd/MM/yyyy") => {
    if (!date) return "-";
    try {
      return format(new Date(date), formatStr, { locale: es });
    } catch {
      return "-";
    }
  };

 

  return (
    <>
      <Grid size={{ lg: 5, xs: 12 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Nuevo horario
        </Typography>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={0.5} sx={{ whiteSpace: 'pre-line' }}>
          {formatScheduleText(schedule)}
        </Typography>
      </Grid>
      
      <Grid size={{ lg: 5, xs: 12 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Fecha inicial
        </Typography>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
          {formatDate(startAt)}
        </Typography>
      </Grid>
      
      <Grid size={{ lg: 5, xs: 12 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Fecha final
        </Typography>
      </Grid>
      <Grid size={{ lg: 7, xs: 12 }}>
        <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
          {formatDate(endAt)}
        </Typography>
      </Grid>
    </>
  );
};

export default RequestScheduleDetails;
