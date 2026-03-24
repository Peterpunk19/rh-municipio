"use client";

import React from "react";
import { Grid2 as Grid, Typography, Divider, Paper, Chip } from "@mui/material";
import Box from "@mui/material/Box";
import { IEmployeeIncidentDetails } from "@/components/types/IEmployeeIncident";
import { formatDate } from "@/utils/formatter";
import { INCIDENT_TYPES_ID } from "@/common/constants/IncidentTypes";
import {MiniMonthCalendar} from "@/components/customComponents/MiniMonthCalendar";
import {getMonthsBetween} from "@/common/utils";

type Props = {
  data: IEmployeeIncidentDetails;
};

const IncidentDays: React.FC<Props> = ({ data }) => {
  const { employee_incident_days, incident_id, start_date, end_date } = data;

  const selectedDates = employee_incident_days.map((d) =>
    new Date(d.date).toISOString().split("T")[0]
  );
  const startDate = new Date(start_date).toISOString().split("T")[0];
  const endDate = new Date(end_date).toISOString().split("T")[0];

const groupDaysByPercentage = () => {
    const groups: { [key: number]: any[] } = {};

    employee_incident_days.forEach((item: any) => {
      const percentage = item.percentage_salary || 0;
      if (!groups[percentage]) {
        groups[percentage] = [];
      }
      groups[percentage].push(item);
    });

    return Object.keys(groups)
      .map(Number)
      .sort((a, b) => b - a)
      .map((percentage) => ({
        percentage,
        days: groups[percentage],
      }));
  };

  const getColorByPercentage = (percentage: number) => {
    if (percentage === 100) return "success";
    if (percentage >= 50) return "info";
    return "warning";
  };

  const getLabelByPercentage = (percentage: number) => {
    if (percentage === 100) return "CON GOCE DE SUELDO COMPLETO";
    return `CON ${percentage}% DE GOCE DE SUELDO`;
  };

  const percentageGroups = groupDaysByPercentage();

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
            {incident_id === INCIDENT_TYPES_ID.LICENCIA_MEDICA ? (
              <>
                {percentageGroups.map((group, groupIndex) => (
                  <Box key={`group-${group.percentage}`} mb={2}>
                    <Typography
                      variant="subtitle2"
                      mb={1}
                      fontWeight={600}
                      color={`${getColorByPercentage(group.percentage)}.main`}
                    >
                      {getLabelByPercentage(group.percentage)} ({group.days.length} días)
                    </Typography>
                    {group.days.map((item: { date: string }, index: number) => (
                      <Chip
                        key={`${group.percentage}-${index}`}
                        label={formatDate(item.date, "dd/MM/yyyy")}
                        color={getColorByPercentage(group.percentage) as any}
                        variant="filled"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                ))}
              </>
            ) : (
              <Box
                sx={{
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 1,
                  p: 2,
                  minHeight: 56,
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 1,
                  backgroundColor: "primary.light",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                    },
                    gap: 2,
                  }}
                >
                  {getMonthsBetween(startDate, endDate).map(({ year, month }) => (
                    <MiniMonthCalendar
                      key={`${year}-${month}`}
                      year={year}
                      month={month}
                      selectedDates={selectedDates}
                      onToggleDate={undefined}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default IncidentDays;
