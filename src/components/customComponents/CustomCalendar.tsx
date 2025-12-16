"use client";

import React, { useState } from "react";
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

  const [showSchedule, setShowSchedule] = useState(false);

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
              scheduleData={schedule}
              onScheduleClick={onScheduleClick}
            />
          );
        })}
      </Grid>

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
