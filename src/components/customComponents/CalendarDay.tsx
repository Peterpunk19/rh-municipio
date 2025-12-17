"use client";

import React from "react";
import { Box, Typography, Grid2 as Grid, } from "@mui/material";
import { Temporal } from "@js-temporal/polyfill";
import {IconClockCheck, IconClockDown, IconClockUp} from "@tabler/icons-react";
import { ICalendarDay, IAttendanceCalendar } from "@/components/types";
import { formatDate } from "@/utils/formatter";
import {generateUniqueKey} from "@/utils";

interface Props {
  day: ICalendarDay;
  today: Temporal.PlainDate;
  isSelected: boolean;
  attendance?: IAttendanceCalendar;
  onClick: (date: string) => void;
  isWorkDay?: boolean;
  schedule?: { startHour: string; endHour: string };
  showSchedule?: boolean;
}

const CalendarDay = React.memo(
  ({
     day,
     today,
     isSelected,
     attendance,
     onClick,
     isWorkDay,
     schedule,
     showSchedule,
  }: Props) => {
    const dateStr = day.date.toString();
    const isToday = Temporal.PlainDate.compare(day.date, today) === 0;
    const isPast = Temporal.PlainDate.compare(day.date, today) < 0;

    const bg = !day.isInMonth
      ? isSelected
        ? "#2F6FED"
        : "#f6f6f6"
      : isSelected
        ? "#2F6FED"
        : "#FFF";
    const color = isSelected ? "#FFF" : "#000";

    return (
      <Grid
        size={{ xs: 1 }}
        onClick={() => onClick(dateStr)}
        sx={{
          p: 1,
          minHeight: 140,
          border: "1px solid #eee",
          cursor: "pointer",
          backgroundColor: bg,
          position: "relative",
          transition: "all .25s ease",
          "&:hover": day.isInMonth && {
            backgroundColor: isSelected ? "#2F6FED" : "#E3F2FD",
            transform: "scale(1.02)",
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
            top: 4,
            right: 4,
            fontWeight: 700,
            border: isToday ? "1px solid #000" : "1px solid #fff",
            backgroundColor: isSelected ? "#fff" : "transparent",
          }}
        >
          {day.date.day}
        </Box>

        {/* Horario */}
        {isWorkDay && showSchedule && schedule && (
          <Typography sx={{ fontSize: "0.7rem", opacity: 0.6 }} color={color}>
            {schedule.startHour} → {schedule.endHour}
          </Typography>
        )}

        {/* Contenido */}
        {showSchedule && (
          <Box sx={{ mt: 3.5 }}>
            {attendance ? (
              <>
                {attendance.hasIncidents ?
                  attendance.incidents.map((inc) => (
                    <Box
                      key={inc.id}
                      sx={{
                        mb: 0.5,
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                        backgroundColor: inc.bgColorOnCalendar,
                        color: inc.colorOnCalendar,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {inc.type}
                    </Box>
                  ))
                : (
                  (() => {
                    let label = "";
                    let bg = "";
                    let color = "#fff";

                    if (attendance.checkIn && attendance.checkOut) {
                      label = "ASISTENCIA";
                      bg = "success.attendance";
                    } else if (attendance.checkIn && !attendance.checkOut) {
                      label = "OMISIÓN DE SALIDA";
                      bg = "warning.main";
                    } else if (!attendance.checkIn && attendance.checkOut) {
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
                          mb: 0.5,
                          px: 1,
                          py: 0.3,
                          borderRadius: 1,
                          backgroundColor: bg,
                        }}
                      >
                        <IconClockCheck size={14} color={color} />
                        <Typography
                          fontSize="0.75rem"
                          fontWeight={600}
                          sx={{ color }}
                        >
                          {label}
                        </Typography>
                      </Box>
                    );
                  })()
                )}

                {!attendance.hasIncidents && (
                  <>
                    {attendance.checkIn && (
                      <Box
                        key={generateUniqueKey()}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{
                          mb: 0.3,
                          backgroundColor: "#eee",
                          borderRadius: "6px",
                          px: 1,
                          py: 0.3,
                        }}
                      >
                        <IconClockUp size={14} />
                        <Typography fontWeight={600} variant="body2" sx={{ fontSize: "0.75rem" }}>
                          Entrada: {attendance.checkIn ? formatDate(new Date(attendance.checkIn), "HH:mm") : ""}
                        </Typography>
                      </Box>
                    )}
                    {attendance.checkOut && (
                      <Box
                        key={generateUniqueKey()}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{
                          mb: 0.3,
                          backgroundColor: "#eee",
                          borderRadius: "6px",
                          px: 1,
                          py: 0.3,
                        }}
                      >
                        <IconClockDown size={14} color="#000" />
                        <Typography fontWeight={600} variant="body2" sx={{ fontSize: "0.75rem", color: "#000" }}>
                          Salida: {attendance.checkOut ? formatDate(new Date(attendance.checkOut), "HH:mm") : ""}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </>
            ) : (
              isPast &&
              isWorkDay && (
                <Typography textAlign="center" fontWeight={600} color={color}>
                  SIN REGISTROS
                </Typography>
              )
            )}
          </Box>
        )}
      </Grid>
    );
  }
);

export default CalendarDay;
