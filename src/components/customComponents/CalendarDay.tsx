"use client";

import React from "react";
import { Box, Typography, Grid2 as Grid, Chip } from "@mui/material";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { Temporal } from "@js-temporal/polyfill";
import { IconClockCheck, IconClockDown, IconClockUp } from "@tabler/icons-react";
import { ICalendarDay, IAttendanceCalendar, IScheduleData } from "@/components/types";
import { formatDate } from "@/utils/formatter";

interface Props {
  day: ICalendarDay;
  today: Temporal.PlainDate;
  isSelected: boolean;
  attendance?: IAttendanceCalendar;
  onClick: (date: string) => void;
  isWorkDay?: boolean;
  schedule?: { startHour: string; endHour: string };
  showSchedule?: boolean;
  scheduleData?: IScheduleData;
  onScheduleClick?: (date: string, schedule: IScheduleData) => void;
  onMouseDown?: (date: string) => void;
  onMouseEnter?: (date: string) => void;
  onMouseUp?: () => void;
  isDragging?: boolean;
}

const isNightSchedule = (start: string, end: string) => {
  const startHour = Number(start.split(":")[0]);
  const endHour = Number(end.split(":")[0]);

  if (endHour < startHour) return true;

  return startHour >= 18 || endHour <= 6;
};

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
    scheduleData,
    onScheduleClick,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    isDragging,
  }: Props) => {
    const isNight = schedule ? isNightSchedule(schedule.startHour, schedule.endHour) : false;

    const dateStr = day.date.toString();
    const isToday = Temporal.PlainDate.compare(day.date, today) === 0;
    const isPast = Temporal.PlainDate.compare(day.date, today) < 0;

    const bg = !day.isInMonth
      ? isSelected
        ? "rgba(28, 61, 90, 0.78)"
        : "#f6f6f6"
      : isSelected
        ? "rgba(28, 61, 90, 0.88)"
        : "#FFF";
    const color = isSelected ? "rgba(255,255,255,0.75)" : "#64748B";

    return (
      <Grid
        size={{ xs: 1 }}
        onMouseDown={() => onMouseDown?.(dateStr)}
        onMouseEnter={() => onMouseEnter?.(dateStr)}
        onMouseUp={onMouseUp}
        sx={{
          p: 1,
          minHeight: 140,
          border: "1px solid #eee",
          backgroundColor: bg,
          position: "relative",
          transition: "all .25s ease",
          userSelect: "none",
          cursor: isDragging ? "grabbing" : "pointer",
          "&:hover": {
            backgroundColor: isSelected ? "rgba(28, 61, 90)" : "#E3F2FD",
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
                  color: isSelected ? "#fff" : "#64748B",
                }}
              >
                {schedule.startHour} → {schedule.endHour}
              </Typography>
            </Box>
          )}
        </Box>

        {scheduleData && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={0.5}
            onClick={(e) => {
              e.stopPropagation();
              onScheduleClick?.(dateStr, scheduleData);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              right: 8,
              backgroundColor: "#2A4F6A",
              borderRadius: "6px",
              px: 1,
              py: 0.5,
              cursor: "pointer",
              pointerEvents: "auto",
              "&:hover": {
                backgroundColor: "#244A66",
              },
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#FFF",
                fontSize: "0.7rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              {scheduleData.startDisplay} – {scheduleData.endDisplay}
            </Typography>
          </Box>
        )}

        {/* Contenido */}
        {showSchedule && (
          <Box sx={{ mt: 3.5 }}>
            {attendance ? (
              <>
                {attendance.hasIncidents
                  ? attendance.incidents.map((inc) => (
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

                        {inc.type === "INCAPACIDADES" && (
                          <Chip
                            size="small"
                            label={`${attendance.percentageSalary}% salario`}
                            sx={{
                              mt: 0.25,
                              height: 18,
                              fontSize: "0.65rem",
                              bgcolor: "rgba(255,255,255,0.25)",
                            }}
                          />
                        )}
                      </Box>
                    ))
                  : (() => {
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
                          <Typography fontSize="0.75rem" fontWeight={600} sx={{ color }}>
                            {label}
                          </Typography>
                        </Box>
                      );
                    })()}

                {!attendance.hasIncidents && (
                  <>
                    {attendance.checkIn && (
                      <Box
                        key={`checkin-${attendance.checkIn}`}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{
                          mb: 0.3,
                          backgroundColor: "#F1F5F9",
                          borderRadius: "6px",
                          px: 1,
                          py: 0.3,
                        }}
                      >
                        <IconClockUp size={14} color="#64748B" />
                        <Typography fontWeight={500} variant="body2" sx={{ fontSize: "0.75rem", color: "#64748B" }}>
                          Entrada: {attendance.checkIn ? formatDate(new Date(attendance.checkIn), "HH:mm") : ""}
                        </Typography>
                      </Box>
                    )}
                    {attendance.checkOut && (
                      <Box
                        key={`checkout-${attendance.checkOut}`}
                        display="flex"
                        alignItems="center"
                        gap={1}
                        sx={{
                          mb: 0.3,
                          backgroundColor: "#F1F5F9",
                          borderRadius: "6px",
                          px: 1,
                          py: 0.3,
                        }}
                      >
                        <IconClockDown size={14} color="#64748B" />
                        <Typography fontWeight={500} variant="body2" sx={{ fontSize: "0.75rem", color: "#64748B" }}>
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
                <Typography textAlign="center" fontWeight={500} color={color}>
                  SIN REGISTROS
                </Typography>
              )
            )}
          </Box>
        )}
      </Grid>
    );
  },
);

CalendarDay.displayName = "CalendarDay";

export default CalendarDay;
