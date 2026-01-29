'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Stack,
  Typography,
  Avatar,
  Box, TextField
} from '@mui/material';

import { IconAlertTriangle } from '@tabler/icons-react';
import DashboardCard from '../../shared/DashboardCard';
import SkeletonRevenueUpdatesTwoCard from '../skeleton/RevenueUpdatesTwoCard';

interface RequestByType {
  id: number;
  name: string;
  label: string;
  value: number;
  color: string;
}

interface Props {
  date: string;
  isLoading?: boolean;
  title?: string;
}

const RequestsByTypeChart = ({ date, isLoading, title }: Props) => {
  const theme = useTheme();
  const today = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState<RequestByType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard/requests?createdAt=${date}`)
      .then(res => res.json())
      .then(res => setData(res.responseObject || []))
      .finally(() => setLoading(false));
  }, [date]);

  const total = useMemo(
    () => data.reduce((acc, cur) => acc + cur.value, 0),
    [data]
  );

  const chartOptions: any = {
    chart: {
      type: 'bar',
      height: 360,
      toolbar: { show: false },
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map(d => d.label),
      labels: {
        style: { fontSize: '12px' },
      },
    },
    yaxis: {
      title: {
        text: 'Total de solicitudes',
      },
    },
    colors: data.map(d =>
      theme.palette?.[d.color?.split('.')[0]]?.main || theme.palette.primary.main
    ),
    tooltip: {
      y: {
        formatter: (val: number) => `${val} solicitudes`,
      },
    },
  };

  const series = [
    {
      name: 'Solicitudes',
      data: data.map(d => d.value),
    },
  ];

  if (isLoading || loading) {
    return <SkeletonRevenueUpdatesTwoCard />;
  }

  return (
    <DashboardCard
      title={title ?? 'Solicitudes por tipo'}
    >
      <Grid container spacing={3}>
        {/* 📊 Gráfica */}
        <Grid item xs={12} md={8}>
          <Chart
            options={chartOptions}
            series={series}
            type="bar"
            height={360}
          />
        </Grid>

        {/* 📌 Panel derecho */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3} mt={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={40}
                height={40}
                bgcolor="primary.light"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <IconAlertTriangle />
              </Box>
              <Box>
                <Typography variant="h3" fontWeight={700}>
                  {total}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Total de solicitudes
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={2}>
              {data.map(item => (
                <Stack key={item.id} direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 9,
                      height: 9,
                      bgcolor:
                        theme.palette?.[item.color?.split('.')[0]]?.main
                        || theme.palette.primary.main,
                    }}
                  />
                  <Typography variant="body2">
                    {item.label}: <strong>{item.value}</strong>
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default RequestsByTypeChart;
