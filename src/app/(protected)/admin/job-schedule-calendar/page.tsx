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
  Alert,
  CircularProgress,
} from "@mui/material";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { Temporal } from "@js-temporal/polyfill";
import { IconCalendar, IconUsers } from "@tabler/icons-react";
import CustomCalendar from "@/components/customComponents/CustomCalendar";
import EmployeeFinder from "@/components/shared/EmployeeFinder";
import { FormErrors, ShiftType, SelectedEmployee } from "./_config";
import { saveJobScheduleCalendar, getJobScheduleCalendar } from "@/services/job-schedule-calendar";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";

const BCrumb = [
  {
    to: "/admin/job-schedule-calendar",
    title: "Horarios Intercalados",
  },
];

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
  const [warnings, setWarnings] = useState<string[] | null>(null);
  const [warningSnackbar, setWarningSnackbar] = useState<string | null>(null);

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

      if (!response.ok) throw new Error("Error al obtener los días festivos");

      const data = await response.json();

      if (!data.success || !data.responseObject) throw new Error("Formato de respuesta inválido");

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
      setSelectedDates((prev) => {
        const newDates = new Set(prev);

        if (newDates.has(date)) newDates.delete(date);
        else {
          if (newDates.size >= MAX_SELECTIONS) return prev;
          newDates.add(date);
        }
        return newDates;
      });
    },
    [MAX_SELECTIONS],
  );

  const formatDate = (dateStr: string) => {
    const date = Temporal.PlainDate.from(dateStr);

    const formatted = date.toLocaleString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

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

  const handleClearCalendar = () => setSelectedDates(new Set());

  const handlePreventClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return;
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setIsDuplicateMode(false);
    setSelectedEmployees([]);
    setSubmitError(null);
    setSubmitSuccess(null);
    setWarnings(null);
  };

  const handleConfirmApplyToEmployees = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setWarnings(null);

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
        startHourId: "17",
        endHourId: "33",
      }));

      const payload = {
        employees: selectedEmployees.map((emp) => emp.id),
        schedules,
      };

      const response = await saveJobScheduleCalendar(payload);

      if (!response.success) {
        setSubmitError(response.message);

        if (response.responseObject?.warnings) {
          setWarnings(response.responseObject.warnings);
          setWarningSnackbar(response.responseObject.warnings[0]); // también en snackbar
        }
        return;
      }

      setSubmitSuccess("Horarios guardados correctamente");

      if (response.responseObject?.warnings) {
        setWarnings(response.responseObject.warnings);
        setWarningSnackbar(response.responseObject.warnings[0]);
      }

      setSelectedEmployees([]);
      setSelectedDates(new Set());
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
        const year = currentYear;
        const month = currentMonth;

        const firstDay = Temporal.PlainDate.from({ year, month, day: 1 }).toString();
        const lastDay = Temporal.PlainYearMonth.from({ year, month })
          .toPlainDate({ day: Temporal.PlainYearMonth.from({ year, month }).daysInMonth })
          .toString();

        const response = await getJobScheduleCalendar(
          `search=${employee.number_employee}&from=${firstDay}&to=${lastDay}`,
        );

        if (response.success && response.responseObject?.data?.length > 0) {
          const employeeData = response.responseObject.data[0];
          const calendarDates = employeeData.job_schedule_calendar || [];

          if (calendarDates.length > 0) {
            const newDates = new Set<string>();
            calendarDates.forEach((item: any) => newDates.add(new Date(item.date).toISOString().split("T")[0]));
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
        console.error(error);
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

  return (
    <PageContainer title="Horarios Intercalados" description="Horarios Intercalados">
      <Breadcrumb title="Horarios Intercalados" items={BCrumb} />

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 9 }}>
          <CustomCalendar
            daysSelected={Array.from(selectedDates)}
            onDateClick={handleDateClick}
            maxSelections={MAX_SELECTIONS}
            initialMonth={currentMonth}
            initialYear={currentYear}
            onMonthVisibleChange={handleMonthChange}
            hideActions
            enableAttendanceToggle={false}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, md: 3 }}>
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
                startIcon={<IconCalendar size={18} />}
                onClick={handleDuplicatePattern}
                sx={{ mb: 1 }}
              >
                Duplicar patrón
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<IconUsers size={18} />}
                onClick={handleApplyToEmployees}
                sx={{ mb: 1 }}
              >
                Aplicar a empleados
              </Button>

              <Button fullWidth variant="outlined" color="error" onClick={handleClearCalendar}>
                Limpiar calendario
              </Button>
            </Box>
          </Box>
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
                <EmployeeFinder
                  onEmployeeSelect={handleEmployeeSelected}
                  error={errors.employeeId || ""}
                  showDetails={false}
                  attendanceType="intercalated"
                />
              )}
            </Grid2>

            {warnings && (
              <Grid2 size={{ xs: 12 }}>
                <Alert severity="warning" sx={{ whiteSpace: "pre-line" }} variant="filled">
                  {warnings.join("\n")}
                </Alert>
              </Grid2>
            )}

            {submitError && (
              <Grid2 size={{ xs: 12 }}>
                <Alert severity="error" variant="filled">
                  {submitError}
                </Alert>
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
    </PageContainer>
  );
};

export default ShiftSchedulePage;
