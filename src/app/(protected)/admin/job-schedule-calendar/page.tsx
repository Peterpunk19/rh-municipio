"use client";

import { useState, useCallback } from "react";
import { Box, Typography, Button, MenuItem, Grid2, Paper, List, ListItem, ListItemText, Divider } from "@mui/material";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { Temporal } from "@js-temporal/polyfill";
import { IconCopy, IconCalendar, IconUsers } from "@tabler/icons-react";
import CustomCalendar from "@/components/customComponents/CustomCalendar";

type ShiftType = "weekdays" | "weekends" | "holidays";

const ShiftSchedulePage = () => {
  const today = Temporal.Now.plainDateISO();
  const [currentMonth, setCurrentMonth] = useState(today.month);
  const [currentYear, setCurrentYear] = useState(today.year);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [shiftType, setShiftType] = useState<ShiftType | "">("");
  const MAX_SELECTIONS = 365;

  const handleMonthChange = useCallback(
    (newYear: number, newMonth: number) => {
      if (newYear !== currentYear || newMonth !== currentMonth) {
        setCurrentYear(newYear);
        setCurrentMonth(newMonth);
        setShiftType("");
      }
    },
    [currentYear, currentMonth],
  );

  const getDatesInMonth = (filterFn: (dayOfWeek: number) => boolean): Set<string> => {
    const dates = new Set<string>();
    const yearMonth = Temporal.PlainYearMonth.from({ year: currentYear, month: currentMonth });

    for (let day = 1; day <= yearMonth.daysInMonth; day++) {
      const date = yearMonth.toPlainDate({ day });
      if (filterFn(date.dayOfWeek)) {
        dates.add(date.toString());
      }
    }
    return dates;
  };

  const handleShiftTypeChange = (event: any) => {
    const newShiftType = event.target.value as ShiftType;
    setShiftType(newShiftType);

    if (newShiftType === "holidays") {
      selectHolidays();
      return;
    }

    setSelectedDates((prevSelectedDates) => {
      const newDates = new Set(prevSelectedDates);
      let filterFn: (dayOfWeek: number) => boolean;

      if (newShiftType === "weekdays") {
        filterFn = (dayOfWeek) => dayOfWeek >= 1 && dayOfWeek <= 5;
      } else if (newShiftType === "weekends") {
        filterFn = (dayOfWeek) => dayOfWeek === 6 || dayOfWeek === 7;
      } else {
        return prevSelectedDates;
      }

      const datesToAdd = getDatesInMonth(filterFn);
      datesToAdd.forEach((date) => newDates.add(date));

      return newDates;
    });
  };

  const selectHolidays = async () => {
    const updatedDates = new Set(selectedDates);
    try {
      const response = await fetch(`/api/catalogs/holiday?year=${currentYear}`);

      if (!response.ok) {
        throw new Error("Error al obtener los días festivos");
      }

      const data = await response.json();

      if (!data.success || !data.responseObject) {
        throw new Error("Formato de respuesta inválido");
      }

      const holidayDates = new Set<string>();
      const currentMonthStr = String(currentMonth).padStart(2, "0");

      data.responseObject
        .filter((holiday: any) => holiday.active)
        .forEach((holiday: any) => {
          const date = new Date(holiday.validation_date);
          const dateStr = date.toISOString().split("T")[0];
          const [year, month] = dateStr.split("-");

          if (year === String(currentYear) && month === currentMonthStr) {
            holidayDates.add(dateStr);
          }
        });

      holidayDates.forEach((date) => updatedDates.add(date));
      setSelectedDates(updatedDates);
    } catch (error) {
      console.error("Error al obtener días festivos:", error);
    }
  };

  const handleDateClick = useCallback(
    (date: string) => {
      setSelectedDates((prevSelectedDates) => {
        const newSelectedDates = new Set(prevSelectedDates);

        if (newSelectedDates.has(date)) {
          newSelectedDates.delete(date);
        } else {
          if (newSelectedDates.size >= MAX_SELECTIONS) {
            return prevSelectedDates;
          }
          newSelectedDates.add(date);
        }

        return newSelectedDates;
      });
    },
    [MAX_SELECTIONS],
  );

  const formatDate = (dateStr: string) => {
    const date = Temporal.PlainDate.from(dateStr);
    return date.toLocaleString("es-MX", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCopyPreviousWeek = () => {};

  const handleDuplicatePattern = () => {};

  const handleApplyToEmployees = () => {};

  const handleClearCalendar = () => {
    setSelectedDates(new Set());
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Horarios Intercalados
      </Typography>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 9 }}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <CustomCalendar
              key={`${currentYear}-${currentMonth}-${Array.from(selectedDates).sort().join(",")}`}
              onSave={() => {}}
              onCancel={() => {}}
              daysSelected={Array.from(selectedDates)}
              onDateClick={handleDateClick}
              maxSelections={MAX_SELECTIONS}
              initialMonth={currentMonth}
              initialYear={currentYear}
              onMonthVisibleChange={handleMonthChange}
            />
          </Paper>
        </Grid2>

        <Grid2 size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Configuración opcional
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tipo de jornada
              </Typography>
              <CustomSelect fullWidth value={shiftType} onChange={handleShiftTypeChange} displayEmpty size="small">
                <MenuItem value="">Seleccione una opción</MenuItem>
                <MenuItem value="weekdays">Lunes a Viernes</MenuItem>
                <MenuItem value="weekends">Fines de semana</MenuItem>
                <MenuItem value="holidays">Días festivos</MenuItem>
              </CustomSelect>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2">Fechas seleccionadas</Typography>
                <Box
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  {selectedDates.size}
                </Box>
              </Box>

              <Paper variant="outlined" sx={{ p: 1, maxHeight: 200, overflow: "auto" }}>
                {selectedDates.size > 0 ? (
                  <List dense>
                    {Array.from(selectedDates).map((date) => (
                      <ListItem key={date} dense disablePadding>
                        <ListItemText primary={formatDate(date)} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ p: 1, textAlign: "center" }}>
                    No hay fechas seleccionadas
                  </Typography>
                )}
              </Paper>

              <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => {}}>
                Aplicar a horarios
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="h6" gutterBottom>
                Acciones rápidas
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<IconCopy size={18} />}
                onClick={handleCopyPreviousWeek}
                sx={{ mb: 1, justifyContent: "flex-start" }}
              >
                Copiar semana anterior
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<IconCalendar size={18} />}
                onClick={handleDuplicatePattern}
                sx={{ mb: 1, justifyContent: "flex-start" }}
              >
                Duplicar patrón
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<IconUsers size={18} />}
                onClick={handleApplyToEmployees}
                sx={{ mb: 1, justifyContent: "flex-start" }}
              >
                Aplicar a empleados
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleClearCalendar}
                sx={{ justifyContent: "flex-start" }}
              >
                Limpiar calendario
              </Button>
            </Box>
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ShiftSchedulePage;
