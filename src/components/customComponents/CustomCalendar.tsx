"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Divider from "@mui/material/Divider";
import { Grid2 as Grid, Box, Typography, Button, ButtonGroup, DialogActions, IconButton, Tooltip } from "@mui/material";
import { Temporal } from "@js-temporal/polyfill";
import { toUpper } from "lodash";
import { IconClockUp, IconClockDown, IconClockCheck, IconEye, IconEyeOff } from "@tabler/icons-react";
import {getEmployeesAttendances} from "@/services/employees-attendances";
import {calculateDaysBetweenDates} from "@/common/utils";
import {IAttendance, ICalendarDay, ICustomCalendarProps} from "@/components/types";
import {formatDate} from "@/utils/formatter";

const CustomCalendar = ({
  onSave,
  onCancel,
  maxSelections = 20,
  daysSelected = [],
  onMonthVisibleChange,
  clearOnMonthChange = false,
  employeeId,
}: ICustomCalendarProps) => {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const today = Temporal.Now.plainDateISO();

  const [month, setMonth] = useState(Temporal.Now.plainDateISO().month);
  const [year, setYear] = useState(Temporal.Now.plainDateISO().year);
  const [monthCalendar, setMonthCalendar] = useState<ICalendarDay[]>([]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [showAttendanceDetails, setShowAttendanceDetails] = useState(false);
  const [attendanceData, setAttendanceData] = useState<IAttendance[]>([]);
  const selectionsByMonthRef = useRef<Map<string, Set<string>>>(new Map());

  const monthKey = useCallback((y: number, m: number) => `${y}-${String(m).padStart(2, "0")}`, []);

  const attendanceMap = useMemo(() => {
    const map = new Map<string, IAttendance>();
    if (!attendanceData || attendanceData.length === 0) return map;

    for (const record of attendanceData) {
      const dateString = record.check_in?.substring(0, 10) ||
        record.check_out?.substring(0, 10);

      if (!dateString) {
        continue;
      }

      const attendance: IAttendance = {
        id: record.id,
        checkIn: record.check_in || null,
        checkOut: record.check_out || null,
        isIncident: !!record.employee_incident,
        incidentId: record.employee_incident?.id || null,
        incidentType: record.employee_incident?.incident?.display_name || undefined,
        displayTimeOnCalendar: record.employee_incident?.incident?.display_time_on_calendar || undefined,
        bgColorOnCalendar: record.employee_incident?.incident?.bgColorOnCalendar || undefined,
        colorOnCalendar: record.employee_incident?.incident?.colorOnCalendar || "#FFF",
      };

      map.set(dateString, attendance);
    }

    return map;
  }, [attendanceData]);

  const next = useCallback(async () => {
    if (clearOnMonthChange) {
      selectionsByMonthRef.current.set(monthKey(year, month), new Set(selectedDates));
    }
    const { month: nextMonth, year: nextYear } = Temporal.PlainYearMonth.from({
      month,
      year,
    }).add({ months: 1 });
    if (clearOnMonthChange) {
      const restored = selectionsByMonthRef.current.get(monthKey(nextYear, nextMonth)) || new Set<string>();
      setSelectedDates(new Set(restored));
    }
    setMonth(nextMonth);
    setYear(nextYear);
    onMonthVisibleChange?.(nextYear, nextMonth);
  }, [month, year, selectedDates, monthKey, clearOnMonthChange]);

  const previous = useCallback(async () => {
    if (clearOnMonthChange) {
      selectionsByMonthRef.current.set(monthKey(year, month), new Set(selectedDates));
    }
    const { month: prevMonth, year: prevYear } = Temporal.PlainYearMonth.from({
      month,
      year,
    }).subtract({ months: 1 });

    if (clearOnMonthChange) {
      const restored = selectionsByMonthRef.current.get(monthKey(prevYear, prevMonth)) || new Set<string>();
      setSelectedDates(new Set(restored));
    }
    setMonth(prevMonth);
    setYear(prevYear);
    onMonthVisibleChange?.(prevYear, prevMonth);
  }, [month, year, selectedDates, monthKey, clearOnMonthChange]);

  const handleDateClick = useCallback(
    (dateStr: string) => {
      if (selectedDates.has(dateStr)) {
        setSelectedDates((prev) => {
          const next = new Set(prev);
          next.delete(dateStr);
          if (clearOnMonthChange) {
            selectionsByMonthRef.current.set(monthKey(year, month), new Set(next));
          }
          return next;
        });
        return;
      }

      if (selectedDates.size >= maxSelections) {
        alert(`Solo puedes seleccionar máximo ${maxSelections} días`);
        return;
      }

      setSelectedDates((prev) => {
        const next = new Set(prev);
        next.add(dateStr);
        if (clearOnMonthChange) {
          selectionsByMonthRef.current.set(monthKey(year, month), new Set(next));
        }
        return next;
      });
    },
    [maxSelections, selectedDates, month, year, monthKey, clearOnMonthChange],
  );

  const handleSave = useCallback(() => {
    const sortedDates = Array.from(selectedDates).sort();
    onSave?.(sortedDates);
  }, [selectedDates, onSave]);

  const handleCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const toggleAttendanceDetails = useCallback(async () => {
    const newShowAttendanceDetails = !showAttendanceDetails;
    setShowAttendanceDetails(newShowAttendanceDetails);

    if (newShowAttendanceDetails) {
      const startOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
      const firstDay = startOfMonth;
      const lastDay = startOfMonth.add({ days: startOfMonth.daysInMonth - 1 });

      try {
        const data = await getEmployeesAttendances({
          employeeId: employeeId,
          checkIn: firstDay.toString(),
          checkOut: lastDay.toString(),
          limit: calculateDaysBetweenDates(firstDay.toString(), lastDay.toString())
        });
        setAttendanceData(data.responseObject.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    }
  }, [showAttendanceDetails, year, month]);

  useEffect(() => {
    let targetYear = year;
    let targetMonth = month;
    if (daysSelected && daysSelected.length > 0) {
      const first = Temporal.PlainDate.from(daysSelected[0]);
      targetYear = first.year;
      targetMonth = first.month;
    } else {
      const today = Temporal.Now.plainDateISO();
      targetYear = today.year;
      targetMonth = today.month;
    }
    setYear(targetYear);
    setMonth(targetMonth);
    onMonthVisibleChange?.(targetYear, targetMonth);
    if (clearOnMonthChange) {
      selectionsByMonthRef.current.set(monthKey(targetYear, targetMonth), new Set(daysSelected));
    }
  }, [daysSelected]);

  useEffect(() => {
    const fiveWeeks = 5 * 7;
    const sixWeeks = 6 * 7;
    const startOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
    const monthLength = startOfMonth.daysInMonth;
    const dayOfWeekMonthStartedOn = startOfMonth.dayOfWeek % 7;
    const length = dayOfWeekMonthStartedOn + monthLength > fiveWeeks ? sixWeeks : fiveWeeks;

    const calendar = new Array(length).fill({}).map((_, index) => {
      const date = startOfMonth.add({
        days: index - dayOfWeekMonthStartedOn,
      });
      return {
        isInMonth: !(index < dayOfWeekMonthStartedOn || index - dayOfWeekMonthStartedOn >= monthLength),
        date,
      };
    });

    setMonthCalendar(calendar);
  }, [year, month]);

  useEffect(() => {
    setSelectedDates(new Set(daysSelected));
    if (!clearOnMonthChange) return;
    const grouped = new Map<string, Set<string>>();
    for (const ds of daysSelected) {
      const d = Temporal.PlainDate.from(ds);
      const key = monthKey(d.year, d.month);
      const set = grouped.get(key) || new Set<string>();
      set.add(ds);
      grouped.set(key, set);
    }
    const current = selectionsByMonthRef.current;
    grouped.forEach((v, k) => {
      current.set(k, v);
    });
  }, [daysSelected, monthKey, clearOnMonthChange]);

  const monthYearDisplay = useMemo(() => {
    return toUpper(
      Temporal.PlainDate.from({ year, month, day: 1 }).toLocaleString("es", {
        month: "long",
        year: "numeric",
      }),
    );
  }, [year, month]);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={previous}>Anterior</Button>
            <Button onClick={next}>Siguiente</Button>
          </ButtonGroup>
        </Box>

        <Box flexGrow={1} display="flex" justifyContent="center">
          <Typography color="textSecondary" variant="h3" fontWeight="400">
            {monthYearDisplay}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title={showAttendanceDetails ? "Ocultar detalles de asistencia" : "Mostrar detalles de asistencia"}>
            <IconButton onClick={toggleAttendanceDetails} color={showAttendanceDetails ? "primary" : "default"}>
              {showAttendanceDetails ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" color="textSecondary">
            Fechas seleccionadas: {selectedDates.size} / {maxSelections}
          </Typography>
        </Box>
      </Box>

      <Grid container columns={7}>
        {days.map((name, index) => (
          <Grid
            size={{ xs: 1 }}
            key={index}
            border={1}
            borderColor="#f6f6f6"
            borderLeft={1}
            borderRight={1}
            sx={{ borderLeftColor: "#ddd", borderRightColor: "#ddd" }}
          >
            <Typography align="center" fontWeight="bold">
              {name}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Grid container columns={7} flexGrow={1}>
        {monthCalendar.map((day, index) => {
          const dateStr = day.date.toString();
          const isSelected = selectedDates.has(dateStr);
          const isToday = Temporal.PlainDate.compare(day.date, today) === 0;
          const attendance = attendanceMap.get(dateStr);

          // Determine attendance type and styling
          let attendanceType = "";
          let isCompleteAttendance = false;
          let textColor = "#000";
          let backgroundColor = "#fff";
          let color = "#000";
          let bgColor = "#fff";

          if (attendance) {
            if (isSelected) {
              backgroundColor = "#1976d2";
              color = "#fff";
            }
            if (attendance.isIncident) {
              attendanceType = attendance.incidentType || "";
              bgColor = attendance.bgColorOnCalendar || "#f0f0f0";
              textColor = attendance.colorOnCalendar || "#000";
            } else if (attendance.checkIn && attendance.checkOut) {
              attendanceType = "ASISTENCIA";
              bgColor = attendance.bgColorOnCalendar || "success.attendance";
              isCompleteAttendance = true;
              textColor = isSelected ? "#fff" : "#000";
            } else if (attendance.checkIn && !attendance.checkOut) {
              attendanceType = "OMISIÓN DE SALIDA";
              bgColor = attendance.bgColorOnCalendar || "warning.main";
              textColor = isSelected ? "#fff" : "#000";
            } else if (!attendance.checkIn && attendance.checkOut) {
              attendanceType = "OMISIÓN DE ENTRADA";
              bgColor = attendance.bgColorOnCalendar || "warning.main";
              textColor = isSelected ? "#fff" : "#000";
            }
          } else if (!day.isInMonth) {
            backgroundColor = "#f6f6f6";
            color = "#999999";
          } else if (isSelected) {
            backgroundColor = "#1976d2";
            color = "#fff";
          }

          const displayTime = attendance && (attendance.displayTimeOnCalendar || !attendance.isIncident);

          return (
            <Grid
              size={{ xs: 1 }}
              key={index}
              textAlign="right"
              border={0.5}
              borderColor="#eee"
              sx={{
                backgroundColor: backgroundColor,
                color: color,
                pt: 2.4,
                pl: 1,
                position: "relative",
                minHeight: showAttendanceDetails ? 140 : 112,
                cursor: day.isInMonth ? "pointer" : "default",
                "&:hover": day.isInMonth
                  ? {
                      backgroundColor: isSelected ? "#1565c0" : "#e3f2fd",
                    }
                  : {},
              }}
              onClick={() => handleDateClick(dateStr)}
            >
              <Box
                fontWeight="bold"
                sx={{
                  width: 32,
                  height: 32,
                  lineHeight: "32px",
                  borderRadius: "50%",
                  textAlign: "center",
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: isSelected ? "#fff" : backgroundColor,
                  border: "1px solid #eee",
                  borderColor: isSelected ? "#1976d2" : "#f6f6f6",
                  color: "#000",
                }}
              >
                {day.date.day}
                {showAttendanceDetails && (<Divider sx={{marginTop: 0.2, border: 1.5, borderColor: isSelected ? "#1976d2" : bgColor}} />) }
              </Box>

              {showAttendanceDetails && (
                <>
                  <Box sx={{ mt: 3 }}>
                    {attendance ? (
                      <Box sx={{ textAlign: 'left', mb: 2 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconClockCheck size={15}/>
                          <Typography fontWeight={600} variant="body2" sx={{ fontSize: '0.7rem' }}>
                            {attendanceType}
                          </Typography>
                        </Box>
                      </Box>
                      ) : Temporal.PlainDate.compare(day.date, today) < 0 && day.isInMonth ? (
                        <Box sx={{ textAlign: 'left' }}>
                          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            <Typography fontWeight={600} variant="body2" sx={{ wordBreak: 'break-word', fontSize: '0.7rem' }}>
                              SIN REGISTROS
                            </Typography>
                          </Box>
                        </Box>
                      ) : null
                    }
                  </Box>

                  {displayTime && (
                    <Box sx={{ mt: 1 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconClockUp size={15} />
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.8rem' }}>
                          Entrada: {attendance.checkIn ? formatDate(new Date(attendance.checkIn), "HH:mm") : ''}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconClockDown size={15} />
                        <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.8rem' }}>
                          Salida: {attendance.checkOut ? formatDate(new Date(attendance.checkOut), "HH:mm") : ''}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </Grid>
          );
        })}
      </Grid>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Typography variant="body2" color="textSecondary">
          {selectedDates.size > 0
            ? `${selectedDates.size} ${selectedDates.size === 1 ? "día seleccionado" : "días seleccionados"}`
            : "Selecciona las fechas de vacaciones"}
        </Typography>
        <Box>
          <Button onClick={handleCancel} color="error" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={selectedDates.size === 0}>
            Guardar Fechas
          </Button>
        </Box>
      </DialogActions>
    </Box>
  );
};

export default CustomCalendar;
