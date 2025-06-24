"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Divider from '@mui/material/Divider';
import { Grid2 as Grid, Box, Typography, Button, ButtonGroup, DialogActions } from "@mui/material";
import { Temporal } from "@js-temporal/polyfill";
import {toUpper} from "lodash";

type CalendarDay = {
  date: Temporal.PlainDate;
  isInMonth: boolean;
};

interface CustomCalendarProps {
  onSave?: (selectedDates: string[]) => void;
  onCancel?: () => void;
  maxSelections?: number;
  daysSelected?: string[];
}

const CustomCalendar = ({ onSave, onCancel, maxSelections = 20, daysSelected = [] }: CustomCalendarProps) => {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const today = Temporal.Now.plainDateISO();

  const [month, setMonth] = useState(Temporal.Now.plainDateISO().month);
  const [year, setYear] = useState(Temporal.Now.plainDateISO().year);
  const [monthCalendar, setMonthCalendar] = useState<CalendarDay[]>([]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  const next = useCallback(() => {
    const { month: nextMonth, year: nextYear } = Temporal.PlainYearMonth.from({
      month,
      year,
    }).add({ months: 1 });

    setMonth(nextMonth);
    setYear(nextYear);
  }, [month, year]);

  const previous = useCallback(() => {
    const { month: prevMonth, year: prevYear } = Temporal.PlainYearMonth.from({
      month,
      year,
    }).subtract({ months: 1 });
    setMonth(prevMonth);
    setYear(prevYear);
  }, [month, year]);

  const handleDateClick = useCallback((dateStr: string) => {
    setSelectedDates(prev => {
      const newSelectedDates = new Set(prev);
      
      if (newSelectedDates.has(dateStr)) {
        newSelectedDates.delete(dateStr);
      } else {
        if (newSelectedDates.size >= maxSelections) {
          alert(`Solo puedes seleccionar máximo ${maxSelections} días`);
          return prev;
        }
        newSelectedDates.add(dateStr);
      }
      
      return newSelectedDates;
    });
  }, [maxSelections]);

  const handleSave = useCallback(() => {
    const sortedDates = Array.from(selectedDates).sort();
    onSave?.(sortedDates);
  }, [selectedDates, onSave]);

  const handleCancel = useCallback(() => {
    setSelectedDates(new Set());
    onCancel?.();
  }, [onCancel]);

  useEffect(() => {
    const fiveWeeks = 5 * 7;
    const sixWeeks = 6 * 7;
    const startOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
    const monthLength = startOfMonth.daysInMonth;
    const dayOfWeekMonthStartedOn = startOfMonth.dayOfWeek % 7;
    const length =
      dayOfWeekMonthStartedOn + monthLength > fiveWeeks ? sixWeeks : fiveWeeks;

    const calendar = new Array(length)
      .fill({})
      .map((_, index) => {
        const date = startOfMonth.add({
          days: index - dayOfWeekMonthStartedOn,
        });
        return {
          isInMonth: !(
            index < dayOfWeekMonthStartedOn ||
            index - dayOfWeekMonthStartedOn >= monthLength
          ),
          date,
        };
      });

    setMonthCalendar(calendar); 
    setSelectedDates(new Set(daysSelected));
  }, [year, month, daysSelected]);

  const monthYearDisplay = useMemo(() => {
    return toUpper(Temporal.PlainDate.from({ year, month, day: 1 }).toLocaleString("es", {
      month: "long",
      year: "numeric",
    }));
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
          <Typography
            color="textSecondary"
            variant="h3"
            fontWeight="400"
          >
            {monthYearDisplay}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="textSecondary">
            Fechas seleccionadas: {selectedDates.size} / {maxSelections}
          </Typography>
        </Box>
      </Box>

      <Grid container columns={7}>
        {days.map((name, index) => (
          <Grid size={{xs: 1}} key={index} border={1} borderColor="#f6f6f6" borderLeft={1} borderRight={1} sx={{ borderLeftColor: "#ddd", borderRightColor: "#ddd" }} >
            <Typography align="center" fontWeight="bold">{name}</Typography>
          </Grid>
        ))}
      </Grid>
      <Grid container columns={7} flexGrow={1}>
        {monthCalendar.map((day, index) => {
          const dateStr = day.date.toString();
          const isSelected = selectedDates.has(dateStr);
          const isToday = Temporal.PlainDate.compare(day.date, today) === 0;

          let backgroundColor = '#fff';
          let color = '#000';
          
          if (!day.isInMonth) {
            backgroundColor = '#f6f6f6';
            color = '#999999';
          } else if (isSelected) {
            backgroundColor = '#1976d2';
            color = '#fff';
          }

          return (
              <Grid
                size={{xs: 1}}
                key={index}
                textAlign="right"
                border={0.5}
                borderColor="#eee"
                sx={{
                  backgroundColor: backgroundColor,
                  color: color,
                  p: 2,
                  position: 'relative',
                  minHeight: 112,
                  cursor: day.isInMonth ? 'pointer' : 'default',
                  '&:hover': day.isInMonth ? {
                    backgroundColor: isSelected ? '#1565c0' : '#e3f2fd',
                  } : {}
                }}
                onClick={() => handleDateClick(dateStr)}
              >
                <Box
                  fontWeight="bold"
                  sx={{
                    width: 32,
                    height: 32,
                    lineHeight: '32px',
                    borderRadius: '50%',
                    textAlign: 'center',
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: isSelected ? '#fff' : backgroundColor,
                    border: "1px solid #eee",
                    borderColor: isSelected ? '#1976d2' : '#eee',
                    color: isSelected ? '#1976d2' : color
                  }}
                >
                  {day.date.day}
                  {isToday ?
                    <Divider sx={{marginTop: 0.5, border: 1.5, borderColor: 'orangered'}} />
                    : null
                  }
                </Box>
              </Grid>
          )
        })}
      </Grid>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Typography variant="body2" color="textSecondary">
          {selectedDates.size > 0
            ? `${selectedDates.size} ${selectedDates.size === 1 ? 'día seleccionado' : 'días seleccionados'}`
            : 'Selecciona las fechas de vacaciones'
          }
        </Typography>
        <Box>
          <Button onClick={handleCancel} color="error" sx={{ mr: 1 }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={selectedDates.size === 0}
          >
            Guardar Fechas
          </Button>
        </Box>
      </DialogActions>
    </Box>
  );
}

export default CustomCalendar;
