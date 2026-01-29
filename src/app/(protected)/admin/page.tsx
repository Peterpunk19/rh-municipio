"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";

import PageContainer from "@/app/components/container/PageContainer";

// components
import TopPerformers from "@/app/components/dashboards/modern/TopPerformers";
import IncidentsByTypeChart from "@/app/components/dashboards/modern/IncidentsByTypeChart";
import IncidentsStatusChart from "@/app/components/dashboards/modern/IncidentsStatusChart";
import RequestsByTypeChart from "@/app/components/dashboards/modern/RequestsByTypeChart";
import RequestsStatusChart from "@/app/components/dashboards/modern/RequestsStatusChart";

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);

  // 📅 Fecha única del dashboard
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <PageContainer title="Dashboard" description="Dashboard de Incidencias">
      <Box mt={3}>
        {/* 🔍 Buscador de empleados */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TopPerformers />
          </Grid>

          {/* 📅 Selector de fecha (global) */}
          <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end">
            <TextField
              type="date"
              size="small"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              inputProps={{ max: today }}
            />
          </Grid>

          {/* 📊 Incidencias por tipo */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <IncidentsByTypeChart date={date} isLoading={isLoading} title="Incidencias por tipo" />
          </Grid>

          {/* 🍩 Estatus de incidencias */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <IncidentsStatusChart date={date} title="Estatus de Incidencias" />
          </Grid>

          <Grid size={{ xs: 12, lg: 8 }}>
            <RequestsByTypeChart date={date} isLoading={isLoading} title="Solicitudes por tipo" />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <RequestsStatusChart date={date} title="Estatus de Solicitudes" />
          </Grid>

          {/* 🔜 Aquí después replicas el patrón para Solicitudes */}
        </Grid>
      </Box>
    </PageContainer>
  );
}
