"use client";

import React from "react";
import { Paper, Typography, Divider, Grid2 as Grid, Box } from "@mui/material";
import { IEmployeeIncidentDetails } from "@/components/types/IEmployeeIncident";
import { formatDate } from "@/utils/formatter";
import { calculateDaysBetweenDates } from "@/common/utils";

type Props = {
  data: IEmployeeIncidentDetails & {
    created_by?: any;
    validated_by?: any;
  };
};

const IncidentSummaryCard: React.FC<Props> = ({ data }) => {
  const employee = data.employee;

  const fullName = `${employee.name} ${employee.paternal_last_name} ${employee.maternal_last_name}`;

  const publicOrg =
    employee.employee_hiring?.[0]?.direccion?.secretaria?.display_name ?? "—";

  const adminOrg =
    employee.employee_hiring?.[0]?.direccion?.display_name ?? "—";

  const category =
    employee.employee_hiring?.[0]?.category?.display_name ?? "—";

  const createdBy = data.created_by
    ? `${data.created_by.name} ${data.created_by.paternal_last_name} ${data.created_by.maternal_last_name}`
    : "—";

  const approvedBy = data.validated_by
    ? `${data.validated_by.name} ${data.validated_by.paternal_last_name} ${data.validated_by.maternal_last_name}`
    : "—";

  const totalDays =
    data.start_date && data.end_date
      ? calculateDaysBetweenDates(data.start_date, data.end_date)
      : "-";

  return (
    <Paper variant="outlined">
      <Box p={3}>
        {/* HEADER EMPLEADO */}
        <Box mb={2}>
          <Typography variant="h6" fontWeight={600}>
            {fullName}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {publicOrg} · {adminOrg}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {category}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* DETALLES */}
        <Grid container spacing={2}>
          <Grid size={{ lg: 6, xs: 12 }}>
            <Item label="Tipo de incidencia" value={data.incident.display_name} />
          </Grid>

          <Grid size={{ lg: 6, xs: 12 }}>
            <Item
              label="Periodo"
              value={`${formatDate(data.start_date)} → ${formatDate(data.end_date)}`}
            />
          </Grid>

          <Grid size={{ lg: 6, xs: 12 }}>
            <Item label="Días totales" value={totalDays} />
          </Grid>

          <Grid size={{ lg: 6, xs: 12 }}>
            <Item label="Solicitado por" value={createdBy} />
          </Grid>

          <Grid size={{ lg: 6, xs: 12 }}>
            <Item label="Aprobado por" value={approvedBy} />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

const Item = ({ label, value }: { label: string; value: any }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={600}>
      {value || "-"}
    </Typography>
  </Box>
);

export default IncidentSummaryCard;