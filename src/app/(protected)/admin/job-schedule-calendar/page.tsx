"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Grid2,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { Temporal } from "@js-temporal/polyfill";
import { IconCopy, IconCalendar, IconUsers, IconX } from "@tabler/icons-react";
import CustomCalendar from "@/components/customComponents/CustomCalendar";
import EmployeeFinder from "@/components/shared/EmployeeFinder";
import { FormErrors, ShiftType, SelectedEmployee } from "./_config";
import { saveJobScheduleCalendar, getJobScheduleCalendar } from "@/services/job-schedule-calendar";

const ShiftSchedulePage = () => {
  const today = Temporal.Now.plainDateISO();
  const [currentMonth, setCurrentMonth] = useState(today.month);
  const [currentYear, setCurrentYear] = useState(today.year);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [shiftType, setShiftType] = useState<ShiftType | "">("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployee[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "success" | "warning";
  }>({ open: false, message: "", severity: "warning" });
  const [isDuplicateMode, setIsDuplicateMode] = useState(false);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);

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

  const handleDuplicatePattern = () => {
    setIsDuplicateMode(true);
    setOpenDialog(true);
  };

  const handleApplyToEmployees = () => {
    if (selectedDates.size === 0) {
      setSnackbar({
        open: true,
        message: "Debe seleccionar al menos una fecha antes de aplicar a empleados",
        severity: "warning",
      });
      return;
    }
    setOpenDialog(true);
  };

  const handleClearCalendar = () => {
    setSelectedDates(new Set());
  };

  const handlePreventClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setIsDuplicateMode(false);
    setSelectedEmployees([]);
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  const handleConfirmApplyToEmployees = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (selectedEmployees.length === 0) {
      setErrors({ employeeId: "Debe seleccionar al menos un empleado" });
      return;
    }

    if (selectedDates.size === 0) {
      setSubmitError("Debe seleccionar al menos una fecha");
      return;
    }

    setIsSubmitting(true);

    try {
      const schedules = Array.from(selectedDates).map((date) => ({
        date,
        startHourId: "09",
        endHourId: "17",
      }));

      const payload = {
        employees: selectedEmployees.map((emp) => emp.id),
        schedules,
      };

      const response = await saveJobScheduleCalendar(payload);

      if (!response.success) {
        throw new Error(response.message || "Error al guardar los horarios");
      }

      setSubmitSuccess("Horarios guardados correctamente");
      setSelectedEmployees([]);
      setSelectedDates(new Set());
      setTimeout(() => {
        setOpenDialog(false);
        setSubmitSuccess(null);
      }, 1500);
    } catch (error: any) {
      setSubmitError(error.message || "Error al guardar los horarios");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmployeeSelected = async (employee: any) => {
    if (!employee) return;

    const alreadySelected = selectedEmployees.some((emp) => emp.id === employee.id);
    if (alreadySelected) {
      setErrors({ employeeId: "Este empleado ya está en la lista" });
      return;
    }

    if (isDuplicateMode) {
      setIsLoadingCalendar(true);
      try {
        const response = await getJobScheduleCalendar(`search=${employee.number_employee}`);

        if (response.success && response.responseObject?.data?.length > 0) {
          const employeeData = response.responseObject.data[0];
          const calendarDates = employeeData.job_schedule_calendar || [];

          if (calendarDates.length > 0) {
            const newDates = new Set<string>();
            calendarDates.forEach((item: any) => {
              const dateStr = new Date(item.date).toISOString().split("T")[0];
              newDates.add(dateStr);
            });
            setSelectedDates(newDates);
            setSnackbar({
              open: true,
              message: `Se cargaron ${calendarDates.length} fechas del calendario de ${employee.label}`,
              severity: "success",
            });
          } else {
            setSnackbar({
              open: true,
              message: "El empleado no tiene fechas en su calendario",
              severity: "warning",
            });
          }
        } else {
          setSnackbar({
            open: true,
            message: "No se encontró información del calendario del empleado",
            severity: "warning",
          });
        }
      } catch (error) {
        console.error("Error al cargar calendario:", error);
        setSnackbar({
          open: true,
          message: "Error al cargar el calendario del empleado",
          severity: "error",
        });
      } finally {
        setIsLoadingCalendar(false);
        setOpenDialog(false);
        setIsDuplicateMode(false);
      }
      return;
    }

    setSelectedEmployees((prev) => [...prev, { id: employee.id, label: employee.label }]);
    setErrors({});
  };

  const handleRemoveEmployee = (employeeId: number) => {
    setSelectedEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
              daysSelected={Array.from(selectedDates)}
              onDateClick={handleDateClick}
              maxSelections={MAX_SELECTIONS}
              initialMonth={currentMonth}
              initialYear={currentYear}
              onMonthVisibleChange={handleMonthChange}
              hideActions
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
      <Dialog open={openDialog} onClose={handlePreventClose} maxWidth="md" fullWidth disableEscapeKeyDown>
        <DialogTitle variant="h5">{isDuplicateMode ? "Duplicar patrón de empleado" : "Aplicar fechas"}</DialogTitle>
        <DialogContent dividers>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              {isLoadingCalendar ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                  <CircularProgress size={40} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Cargando calendario del empleado...
                  </Typography>
                </Box>
              ) : (
                <>
                  <EmployeeFinder
                    onEmployeeSelect={handleEmployeeSelected}
                    error={errors.employeeId || ""}
                    showDetails={false}
                    attendanceType="intercalated"
                  />
                </>
              )}
            </Grid2>

            {!isDuplicateMode && selectedEmployees.length > 0 && (
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Empleados seleccionados ({selectedEmployees.length})
                </Typography>
                <Paper variant="outlined" sx={{ p: 1, maxHeight: 200, overflow: "auto" }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedEmployees.map((emp) => (
                      <Chip
                        key={emp.id}
                        label={emp.label}
                        onDelete={() => handleRemoveEmployee(emp.id)}
                        deleteIcon={<IconX size={16} />}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid2>
            )}

            {submitError && (
              <Grid2 size={{ xs: 12 }}>
                <Alert severity="error">{submitError}</Alert>
              </Grid2>
            )}

            {submitSuccess && (
              <Grid2 size={{ xs: 12 }}>
                <Alert severity="success">{submitSuccess}</Alert>
              </Grid2>
            )}
          </Grid2>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="error" variant="contained" disabled={isSubmitting}>
            Cancelar
          </Button>
          {!isDuplicateMode && (
            <Button
              onClick={handleConfirmApplyToEmployees}
              color="primary"
              variant="contained"
              autoFocus
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Continuar"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShiftSchedulePage;
