'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { useTheme } from '@mui/material/styles';
import { Grid2 as Grid, Stack, Typography, Avatar, Box } from '@mui/material';
import { IconChecklist } from '@tabler/icons-react';

import DashboardCard from '../../shared/DashboardCard';
import SkeletonYearlyBreakupCard from "../skeleton/YearlyBreakupCard";

interface IncidentStatusItem {
  id: number;
  name: string;
  label: string;
  value: number;
  color: string;
}

interface Props {
  date: string;           // 👈 YYYY-MM-DD
  isLoading?: boolean;
  title?: string;
}

const IncidentsStatusChart = ({ date, isLoading, title }: Props) => {
  const theme = useTheme();
  const [data, setData] = useState<IncidentStatusItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date) return;

    setLoading(true);
    fetch(`/api/dashboard/incidents/status?createdAt=${date}`)
      .then(res => res.json())
      .then(res => setData(res.responseObject || []))
      .finally(() => setLoading(false));
  }, [date]);

  const total = useMemo(
    () => data.reduce((acc, cur) => acc + cur.value, 0),
    [data]
  );

  const series = data.map(d => d.value);
  const labels = data.map(d => d.label);

  const colors = data.map(d =>
    theme.palette?.[d.color]?.main || theme.palette.primary.main
  );

  const options: any = {
    chart: {
      type: 'donut',
      height: 155,
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      toolbar: { show: false },
    },
    labels,
    colors,
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
        },
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} incidencias`,
      },
    },
  };

  if (isLoading || loading) {
    return <SkeletonYearlyBreakupCard />;
  }

  return (
    <DashboardCard title={title ?? 'Estatus de Incidencias'}>
      <Grid container spacing={3}>
        {/* Texto */}
        <Grid size={{ xs: 7 }}>
          <Stack spacing={1}>
            <Typography variant="h3" fontWeight={700}>
              {total}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Total de incidencias
            </Typography>
          </Stack>

          <Stack spacing={2} mt={4}>
            {data.map(item => (
              <Stack
                key={item.id}
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <Avatar
                  sx={{
                    width: 9,
                    height: 9,
                    bgcolor:
                      theme.palette?.[item.color]?.main
                      || theme.palette.primary.main,
                  }}
                />
                <Typography variant="subtitle2">
                  {item.label}: <strong>{item.value}</strong>
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>

        {/* Donut */}
        <Grid size={{ xs: 5 }}>
          <Chart
            options={options}
            series={series}
            type="donut"
            height={150}
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default IncidentsStatusChart;
