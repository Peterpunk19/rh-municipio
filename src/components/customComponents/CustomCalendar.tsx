"use client";

import React, { useEffect, useRef, useState } from "react";
import { Grid2 as Grid, Box, Typography, Button, DialogActions, FormControlLabel } from "@mui/material";

import { ICustomCalendarProps } from "@/components/types";
import { useCustomCalendar } from "@/hooks/calendar/useCustomCalendar";
import CalendarDay from "@/components/customComponents/CalendarDay";
import CalendarHeader from "@/components/customComponents/CalendarHeader";
import CalendarDaysHeader from "@/components/customComponents/CalendarDaysHeader";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";

const CustomCalendar = ({
  onSave,
  onCancel,
  maxSelections = 20,
  daysSelected = [],
  onMonthVisibleChange,
  clearOnMonthChange = false,
  employeeId,
  onDateClick,
  initialMonth,
  initialYear,
  hideActions = false,
  enableAttendanceToggle = true,
  scheduleData,
  onScheduleClick,
}: ICustomCalendarProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragActionRef = useRef<"select" | "deselect" | null>(null);

  const { today, days, monthCalendar, selectedDates, attendanceMap, monthYearDisplay, scheduleMap, actions } =
    useCustomCalendar({
      employeeId,
      maxSelections,
      daysSelected,
      initialMonth,
      initialYear,
      clearOnMonthChange,
      onMonthVisibleChange,
      onDateClick,
    });

  const handleSave = () => {
    onSave?.(Array.from(selectedDates).sort());
  };

  const handleMouseDown = (date: string) => {
    setIsDragging(true);

    dragActionRef.current = selectedDates.has(date) ? "deselect" : "select";

    actions.handleDateClick(date);
  };

  const handleMouseEnter = (date: string) => {
    if (!isDragging || !dragActionRef.current) return;

    const isSelected = selectedDates.has(date);

    if (dragActionRef.current === "select" && !isSelected) {
      actions.handleDateClick(date);
    }

    if (dragActionRef.current === "deselect" && isSelected) {
      actions.handleDateClick(date);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragActionRef.current = null;
  };

  const storageKey = React.useMemo(() => `customCalendar:showSchedule:${employeeId ?? "global"}`, [employeeId]);

  const [showSchedule, setShowSchedule] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey);
    setShowSchedule(saved === "1");
  }, [storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, showSchedule ? "1" : "0");
  }, [showSchedule, storageKey]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      sx={{
        bgcolor: "#F5F7FB",
        borderRadius: 3,
        p: { xs: 1.5, md: 2 },
      }}
    >
      <CalendarHeader
        title={monthYearDisplay}
        onPrevious={actions.previous}
        onNext={actions.next}
        rightSlot={
          <>
            {enableAttendanceToggle && (
              <>
                <FormControlLabel
                  control={
                    <CustomCheckbox checked={showSchedule} onChange={(e) => setShowSchedule(e.target.checked)} />
                  }
                  label="Mostrar horario"
                />
              </>
            )}

            <Typography variant="body2" color="textSecondary">
              Fechas: {selectedDates.size} / {maxSelections}
            </Typography>
          </>
        }
      />

      <CalendarDaysHeader days={days} mb={2} />

      <Box onMouseLeave={handleMouseUp} sx={{ position: "relative", zIndex: 1 }}>
        <Grid container columns={7} flexGrow={1}>
          {monthCalendar.map((day) => {
            const dateStr = day.date.toString();
            const isSelected = selectedDates.has(dateStr);
            const schedule = scheduleData?.get(dateStr);
            return (
              <CalendarDay
                key={dateStr}
                day={day}
                today={today}
                isSelected={isSelected}
                attendance={attendanceMap.get(dateStr)}
                isWorkDay={scheduleMap?.has(dateStr)}
                schedule={scheduleMap?.get(dateStr)}
                showSchedule={showSchedule}
                onClick={actions.handleDateClick}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
                scheduleData={schedule}
                onScheduleClick={onScheduleClick}
                isDragging={isDragging}
              />
            );
          })}
        </Grid>
      </Box>

      {!hideActions && (
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Typography variant="body2" color="textSecondary">
            {selectedDates.size > 0
              ? `${selectedDates.size} ${selectedDates.size === 1 ? "día seleccionado" : "días seleccionados"}`
              : "Selecciona las fechas"}
          </Typography>

          <Box>
            <Button onClick={onCancel} color="error" sx={{ mr: 1 }}>
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="contained" disabled={selectedDates.size === 0}>
              Guardar Fechas
            </Button>
          </Box>
        </DialogActions>
      )}
    </Box>
  );
};

export default CustomCalendar;
