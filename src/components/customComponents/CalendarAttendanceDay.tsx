"use client";

import React from "react";
import { Grid2 as Grid, Box, Typography } from "@mui/material";
import { Temporal } from "@js-temporal/polyfill";
import {IconClockUp, IconClockDown, IconClockCheck, IconMoon, IconSun} from "@tabler/icons-react";
import { formatDate } from "@/utils/formatter";
import { ICalendarDay, IAttendanceCalendar } from "@/components/types";

interface Props {
  day: ICalendarDay;
  today: Temporal.PlainDate;
  attendance?: IAttendanceCalendar;
  isWorkDay: boolean;
  schedule?: { startHour: string; endHour: string };
  showSchedule: boolean;
  onIncidentClick: (id: number) => void;
}

const isNightSchedule = (start: string, end: string) => {
  const startHour = Number(start.split(":")[0]);
  const endHour = Number(end.split(":")[0]);

  if (endHour < startHour) return true;

  return startHour >= 18 || endHour <= 6;
};

const CalendarAttendanceDay = React.memo(
  ({ day, today, attendance, isWorkDay, schedule, showSchedule, onIncidentClick }: Props) => {
    const isToday = Temporal.PlainDate.compare(day.date, today) === 0;
    const isPast = Temporal.PlainDate.compare(day.date, today) < 0;

    const isNight = schedule ? isNightSchedule(schedule.startHour, schedule.endHour) : false;

    const checkIn = attendance?.checkIn;
    const checkOut = attendance?.checkOut;

    return (
      <Grid
        size={{ xs: 1 }}
        sx={{
          p: 1,
          border: "1px solid #eee",
          minHeight: 140,
          backgroundColor: day.isInMonth ? "#fff" : "#f6f6f6",
          position: "relative",
          transition: "all .25s ease",
          "&:hover": day.isInMonth && {
            backgroundColor: "#F1F5F9",
          },
        }}
      >
        {/* Día */}
        <Box
          sx={{
            width: 28,
            height: 28,
            lineHeight: "28px",
            borderRadius: "50%",
            textAlign: "center",
            position: "absolute",
            top: 0,
            right: 4,
            fontWeight: 700,
            border: isToday ? "1px solid #000" : "1px solid transparent",
          }}
        >
          {day.date.day}
        </Box>

        {/* Horario */}
        <Box
          sx={{
            height: 2,
            position: "relative",
          }}
        >
          {isWorkDay && showSchedule && schedule && (
            <Box display="flex" alignItems="center" gap={0.5}>
              {isNight ? <IconMoon size={14} color="#FACC15" /> : <IconSun size={14} color="#FDE047" />}

              <Typography
                sx={{
                  fontSize: "0.7rem",
                  opacity: 0.6,
                  lineHeight: 1,
                  color: "#64748B",
                }}
              >
                {schedule.startHour} → {schedule.endHour}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Contenido */}
        {/* No se valida showSchedule porque aqui siempre se deben mostrar las incidencias */}

        <Box mt={3.5}>
          {attendance ? (
            <Box textAlign="left">
              {/* Incidencias */}
              {attendance.hasIncidents ? (
                attendance.incidents.map((inc) => (
                  <Box
                    key={inc.id}
                    onClick={() => onIncidentClick(inc.id)}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{
                      mb: 0.4,
                      px: 1,
                      py: 0.3,
                      cursor: "pointer",
                      borderRadius: 1,
                      backgroundColor: inc.bgColorOnCalendar,
                    }}
                  >
                    <Box display="flex" flexDirection="column" lineHeight={1}>
                      <Typography fontWeight={600} sx={{ fontSize: "0.75rem" }}>
                        {inc.type}
                      </Typography>

                      {inc.type === 'INCAPACIDADES' && (
                        <Typography
                          sx={{
                            fontSize: "0.65rem",
                            color: 'text.secondary',
                            fontWeight: 500,
                          }}
                        >
                          {attendance.percentageSalary} % salario
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))
              ) : (
                <>
                  {/* ASISTENCIA / OMISIONES */}
                  {(() => {
                    let label = "";
                    let bg = "";
                    let color = "#fff";

                    if (checkIn && checkOut) {
                      label = "ASISTENCIA";
                      bg = "success.attendance";
                    } else if (checkIn && !checkOut) {
                      label = "OMISIÓN DE SALIDA";
                      bg = "warning.main";
                    } else if (!checkIn && checkOut) {
                      label = "OMISIÓN DE ENTRADA";
                      bg = "warning.main";
                    }

                    if (!label) return null;

                    return (
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{
                          mb: 0.4,
                          backgroundColor: bg,
                          borderRadius: 1,
                          px: 1,
                          py: 0.3,
                        }}
                      >
                        <IconClockCheck size={14} color={color} />
                        <Typography sx={{ fontSize: "0.75rem", color }} fontWeight={600}>
                          {label}
                        </Typography>
                      </Box>
                    );
                  })()}

                  {/* Entrada */}
                  {checkIn && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{
                        mb: 0.3,
                        backgroundColor: "#eee",
                        borderRadius: 1,
                        px: 1,
                        py: 0.3,
                      }}
                    >
                      <IconClockUp size={14} />
                      <Typography fontWeight={600} sx={{ fontSize: "0.75rem" }}>
                        Entrada: {formatDate(checkIn, "HH:mm")}
                      </Typography>
                    </Box>
                  )}

                  {/* Salida */}
                  {checkOut && (
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                      sx={{
                        mb: 0.3,
                        backgroundColor: "#eee",
                        borderRadius: 1,
                        px: 1,
                        py: 0.3,
                      }}
                    >
                      <IconClockDown size={14} />
                      <Typography fontWeight={600} sx={{ fontSize: "0.75rem" }}>
                        Salida: {formatDate(checkOut, "HH:mm")}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          ) : (
            isPast &&
            isWorkDay && (
              <Typography textAlign="center" fontWeight={600}>
                SIN REGISTROS
              </Typography>
            )
          )}
        </Box>
      </Grid>
    );
  },
);

CalendarAttendanceDay.displayName = "CalendarAttendanceDay";

export default CalendarAttendanceDay;
