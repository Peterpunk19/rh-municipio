"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
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
  Snackbar,
  Chip,
  Link,
} from "@mui/material";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { Temporal } from "@js-temporal/polyfill";
import { IconCalendar, IconUsers, IconUser, IconDeviceFloppy } from "@tabler/icons-react";
import CustomCalendar from "@/components/customComponents/CustomCalendar";
import ApplyScheduleModal from "@/components/customComponents/ApplyScheduleModal";
import EmployeeFinder from "@/components/shared/EmployeeFinder";
import { FormErrors, ShiftType, SelectedEmployee } from "./_config";
import { saveJobScheduleCalendar, getJobScheduleCalendar } from "@/services/job-schedule-calendar";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PageContainer from "@/app/components/container/PageContainer";
import { EmployeeDetailCard } from "@/components/shared/EmployeeDetailCard";

const BCrumb = [
  {
    to: "/admin/job-schedule-calendar",
    title: "Horarios Intercalados",
  },
];
import { IScheduleData } from "@/components/types";

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
  const [openApplySchedule, setOpenApplySchedule] = useState(false);
  const [appliedSchedules, setAppliedSchedules] = useState<Map<string, IScheduleData>>(new Map());
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStartHourId, setCurrentStartHourId] = useState(0);
  const [currentEndHourId, setCurrentEndHourId] = useState(0);
  const [selectedEmployeeEdit, setSelectedEmployeeEdit] = useState<any | null>(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [employeeFinderKey, setEmployeeFinderKey] = useState(0);
  const [originalSchedules, setOriginalSchedules] = useState<Map<string, IScheduleData>>(new Map());
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const MAX_SELECTIONS = 365;

  const visibleMonthDates = useMemo(() => {
    const monthStr = String(currentMonth).padStart(2, "0");
    const filtered = Array.from(selectedDates).filter((d) => d.startsWith(`${currentYear}-${monthStr}-`));
    return new Set(filtered);
  }, [selectedDates, currentYear, currentMonth]);

  const displayedSelectedDates = useMemo(() => {
    return selectedEmployeeEdit ? visibleMonthDates : selectedDates;
  }, [selectedEmployeeEdit, visibleMonthDates, selectedDates]);

  const hasChanges = useMemo(() => {
    if (!selectedEmployeeEdit) return false;
    if (originalSchedules.size !== appliedSchedules.size) return true;
    let changes = false;
    appliedSchedules.forEach((item, key) => {
      if (changes) return;
      const original = originalSchedules.get(key);
      if (!original) {
        changes = true;
        return;
      }
      if (original.startHourId !== item.startHourId || original.endHourId !== item.endHourId) changes = true;
    });
    if (changes) return true;
    originalSchedules.forEach((_, key) => {
      if (!appliedSchedules.has(key)) changes = true;
    });
    return changes;
  }, [selectedEmployeeEdit, originalSchedules, appliedSchedules]);

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
      setSelectedDates((prevSelectedDates) => {
        const newSelectedDates = new Set(prevSelectedDates);

        if (newSelectedDates.has(date)) {
          newSelectedDates.delete(date);
          setAppliedSchedules((prev) => {
            const newMap = new Map(prev);
            newMap.delete(date);
            return newMap;
          });
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
    setOpenDialog(true);
  };

  const handleClearCalendar = () => {
    setSelectedDates(new Set());
    setAppliedSchedules(new Map());
  };

  const handleOpenApplySchedule = () => {
    if (selectedDates.size === 0) {
      setSnackbar({
        open: true,
        message: "Debe seleccionar al menos una fecha antes de aplicar horarios",
        severity: "warning",
      });
      return;
    }
    setIsEditMode(false);
    setEditingDate(null);
    setCurrentStartHourId(0);
    setCurrentEndHourId(0);
    setOpenApplySchedule(true);
  };

  const handleApplyScheduleConfirm = (
    startHourId: number,
    endHourId: number,
    startDisplay: string,
    endDisplay: string,
  ) => {
    if (isEditMode && editingDate) {
      setAppliedSchedules((prev) => {
        const newMap = new Map(prev);
        newMap.set(editingDate, { startHourId, endHourId, startDisplay, endDisplay });
        return newMap;
      });
    } else {
      const newMap = new Map(appliedSchedules);
      selectedDates.forEach((date) => {
        if (!appliedSchedules.has(date)) {
          newMap.set(date, { startHourId, endHourId, startDisplay, endDisplay });
        }
      });
      setAppliedSchedules(newMap);
    }
    setOpenApplySchedule(false);
    setIsEditMode(false);
    setEditingDate(null);
  };

  const handleScheduleClick = (date: string, schedule: IScheduleData) => {
    setEditingDate(date);
    setIsEditMode(true);
    setCurrentStartHourId(schedule.startHourId);
    setCurrentEndHourId(schedule.endHourId);
    setOpenApplySchedule(true);
  };

  const handleDeleteSchedule = (date: string) => {
    setSelectedDates((prev) => {
      const newSet = new Set(prev);
      newSet.delete(date);
      return newSet;
    });
    setAppliedSchedules((prev) => {
      const newMap = new Map(prev);
      newMap.delete(date);
      return newMap;
    });
    setSnackbar({ open: true, message: "Horario eliminado correctamente", severity: "success" });
  };

  const scheduleDataMap = useMemo(() => appliedSchedules, [appliedSchedules]);

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
      setIsSubmitting(true);
      try {
        const year = currentYear;
        const month = currentMonth;
        const firstDay = Temporal.PlainDate.from({ year, month, day: 1 }).toString();
        const lastDay = Temporal.PlainYearMonth.from({ year, month })
          .toPlainDate({ day: Temporal.PlainYearMonth.from({ year, month }).daysInMonth })
          .toString();

        const payload = {
          employees: selectedEmployees.map((emp) => emp.id),
          schedules: [],
          from: firstDay,
          to: lastDay,
        } as any;

        const response = await saveJobScheduleCalendar(payload);

        if (!response.success) {
          setSubmitError(response.message);
          if (response.responseObject?.warnings) {
            setWarnings(response.responseObject.warnings);
            setWarningSnackbar(response.responseObject.warnings[0]);
          }
          return;
        }

        const disabledCount = response.responseObject?.disabled ?? 0;
        setSubmitSuccess(
          disabledCount > 0
            ? `Se desactivaron ${disabledCount} fecha(s) del mes seleccionado`
            : "No habían fechas para desactivar",
        );

        if (response.responseObject?.warnings) {
          setWarnings(response.responseObject.warnings);
          setWarningSnackbar(response.responseObject.warnings[0]);
        }

        setSelectedEmployees([]);
        setSelectedDates(new Set());
        setAppliedSchedules(new Map());
        setTimeout(() => {
          setOpenDialog(false);
          setSubmitSuccess(null);
        }, 1500);
      } catch (error: any) {
        setSubmitError(error.message || "Error al eliminar horarios");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const datesWithoutSchedule = Array.from(selectedDates).filter((date) => !appliedSchedules.has(date));

    if (datesWithoutSchedule.length > 0) {
      setSubmitError(
        `Hay ${datesWithoutSchedule.length} fecha(s) sin horario asignado. Por favor, aplique horarios a todas las fechas antes de continuar.`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const allDates = Array.from(selectedDates).sort();

      const schedules = allDates.map((date) => {
        const schedule = appliedSchedules.get(date);
        return {
          date,
          startHourId: schedule?.startHourId || 8,
          endHourId: schedule?.endHourId || 17,
        };
      });

      const payload = {
        employees: selectedEmployees.map((emp) => emp.id),
        schedules,
      };

      const response = await saveJobScheduleCalendar(payload);

      if (!response.success) {
        setSubmitError(response.message);

        if (response.responseObject?.warnings) {
          setWarnings(response.responseObject.warnings);
          setWarningSnackbar(response.responseObject.warnings[0]);
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
      setAppliedSchedules(new Map());

      if (!response.responseObject?.warnings?.length) {
        setTimeout(() => {
          setOpenDialog(false);
          setSubmitSuccess(null);
        }, 1500);
      }
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
            const newSchedules = new Map<string, IScheduleData>();
            calendarDates.forEach((item: any) => {
              const dateStr = new Date(item.date).toISOString().split("T")[0];
              newDates.add(dateStr);
              newSchedules.set(dateStr, {
                startHourId: item.start_hour_id,
                endHourId: item.end_hour_id,
                startDisplay: item.start_hour?.display_name || "",
                endDisplay: item.end_hour?.display_name || "",
              });
            });
            setSelectedDates(newDates);
            setAppliedSchedules(newSchedules);
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

  const loadEmployeeCalendarForEdit = useCallback(
    async (employee: any) => {
      if (!employee) return;
      setIsLoadingCalendar(true);
      try {
        const year = currentYear;
        const firstDay = Temporal.PlainDate.from({ year, month: 1, day: 1 }).toString();
        const lastDay = Temporal.PlainDate.from({ year, month: 12, day: 31 }).toString();

        const response = await getJobScheduleCalendar(
          `search=${employee.number_employee ?? employee.label?.split(" - ")?.[1] ?? ""}&from=${firstDay}&to=${lastDay}`,
        );

        const newDates = new Set<string>();
        const newSchedules = new Map<string, IScheduleData>();

        if (response.success && response.responseObject?.data?.length > 0) {
          const employeeData = response.responseObject.data[0];
          const calendarDates = employeeData.job_schedule_calendar || [];
          calendarDates.forEach((item: any) => {
            const dateStr = new Date(item.date).toISOString().split("T")[0];
            newDates.add(dateStr);
            newSchedules.set(dateStr, {
              startHourId: item.start_hour_id,
              endHourId: item.end_hour_id,
              startDisplay: item.start_hour?.display_name || "",
              endDisplay: item.end_hour?.display_name || "",
            });
          });
        }

        setSelectedDates(newDates);
        setAppliedSchedules(newSchedules);
        setOriginalSchedules(new Map(newSchedules));
      } catch (e) {
        setSnackbar({ open: true, message: "Error al cargar el calendario del empleado", severity: "error" });
      } finally {
        setIsLoadingCalendar(false);
      }
    },
    [currentYear],
  );

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!hasChanges) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  const handleMonthChange = useCallback(
    (newYear: number, newMonth: number) => {
      if (newYear !== currentYear || newMonth !== currentMonth) {
        setCurrentYear(newYear);
        setCurrentMonth(newMonth);
        setShiftType("");

        if (selectedEmployeeEdit) {
          setSelectedDates(new Set());
          setAppliedSchedules(new Map());
          setOriginalSchedules(new Map());
          void loadEmployeeCalendarForEdit(selectedEmployeeEdit);
        }
      }
    },
    [currentYear, currentMonth, selectedEmployeeEdit, loadEmployeeCalendarForEdit],
  );

  const handleTopEmployeeSelect = async (employee: any) => {
    if (!employee) return;
    if (selectedEmployeeEdit && selectedEmployeeEdit.id === employee.id) return;

    if (selectedEmployeeEdit && hasChanges) {
      const ok = window.confirm("Tienes cambios sin guardar. ¿Deseas descartarlos y cambiar de empleado?");
      if (!ok) return;
    }

    setSelectedEmployeeEdit(employee);
    setShowEmployeeDetails(false);
    setSelectedDates(new Set());
    setAppliedSchedules(new Map());
    setOriginalSchedules(new Map());
    await loadEmployeeCalendarForEdit(employee);
  };

  const getChangeSummary = useMemo(() => {
    const removed: string[] = [];
    const added: { date: string; start: string; end: string }[] = [];
    const modified: { date: string; start: string; end: string }[] = [];

    originalSchedules.forEach((orig, date) => {
      const cur = appliedSchedules.get(date);
      if (!cur) removed.push(date);
      else if (cur.startHourId !== orig.startHourId || cur.endHourId !== orig.endHourId)
        modified.push({ date, start: cur.startDisplay, end: cur.endDisplay });
    });
    appliedSchedules.forEach((cur, date) => {
      if (!originalSchedules.has(date)) added.push({ date, start: cur.startDisplay, end: cur.endDisplay });
    });
    return { removed, added, modified };
  }, [originalSchedules, appliedSchedules]);

  const monthChangeSummary = useMemo(() => {
    const monthStr = String(currentMonth).padStart(2, "0");
    const inMonth = (d: string) => d.startsWith(`${currentYear}-${monthStr}-`);
    return {
      removed: getChangeSummary.removed.filter(inMonth),
      added: getChangeSummary.added.filter((x) => inMonth(x.date)),
      modified: getChangeSummary.modified.filter((x) => inMonth(x.date)),
    };
  }, [getChangeSummary, currentYear, currentMonth]);

  const handleSaveCalendar = () => {
    if (!selectedEmployeeEdit) return;
    setOpenSaveDialog(true);
  };

  const confirmSaveCalendar = async () => {
    if (!selectedEmployeeEdit) return;
    setIsSubmitting(true);
    try {
      if (appliedSchedules.size === 0) {
        const ym = Temporal.PlainYearMonth.from({ year: currentYear, month: currentMonth });
        const from = ym.toPlainDate({ day: 1 }).toString();
        const to = ym.toPlainDate({ day: ym.daysInMonth }).toString();

        const payload = { employees: [selectedEmployeeEdit.id], from, to, schedules: [] as any[] };
        const response = await saveJobScheduleCalendar(payload);
        if (!response.success) {
          setSubmitError(response.message);
          if (response.responseObject?.warnings) setWarnings(response.responseObject.warnings);
          if (response.message) setSnackbar({ open: true, message: response.message, severity: "error" });
          return;
        }
        setOriginalSchedules(new Map());
        setOpenSaveDialog(false);
        setSnackbar({ open: true, message: "Calendario limpiado correctamente", severity: "success" });
        if (response.responseObject?.warnings) setWarnings(response.responseObject.warnings);
        await loadEmployeeCalendarForEdit(selectedEmployeeEdit);
        return;
      }

      if (
        getChangeSummary.removed.length === 0 &&
        getChangeSummary.added.length === 0 &&
        getChangeSummary.modified.length === 0
      ) {
        setIsSubmitting(false);
        setOpenSaveDialog(false);
        setSnackbar({ open: true, message: "No hay cambios por guardar", severity: "warning" });
        return;
      }
      const schedules: any[] = [];
      let invalidCount = 0;
      const invalidDates: string[] = [];
      const monthStr = String(currentMonth).padStart(2, "0");
      appliedSchedules.forEach((s, date) => {
        if (!date.startsWith(`${currentYear}-${monthStr}-`)) return;
        const startId = Number(s.startHourId);
        const endId = Number(s.endHourId);
        if (!startId || !endId) {
          invalidCount++;
          invalidDates.push(date);
          return;
        }
        schedules.push({ date, startHourId: startId, endHourId: endId });
      });

      const ym = Temporal.PlainYearMonth.from({ year: currentYear, month: currentMonth });
      const rangeFrom = ym.toPlainDate({ day: 1 }).toString();
      const rangeTo = ym.toPlainDate({ day: ym.daysInMonth }).toString();

      if (invalidCount > 0) {
        setIsSubmitting(false);
        setSubmitError("Hay fecha(s) con horas inválidas. Corrige las horas antes de guardar.");
        setSnackbar({ open: true, message: "Corrige horas inválidas antes de guardar", severity: "error" });
        return;
      }
      const payload: any = { employees: [selectedEmployeeEdit.id], schedules };
      payload.from = rangeFrom;
      payload.to = rangeTo;
      const response = await saveJobScheduleCalendar(payload);
      if (!response.success) {
        setSubmitError(response.message);
        if (response.responseObject?.warnings) setWarnings(response.responseObject.warnings);
        if (response.message) setSnackbar({ open: true, message: response.message, severity: "error" });
        return;
      }
      setOriginalSchedules(new Map(appliedSchedules));
      setOpenSaveDialog(false);
      setSnackbar({ open: true, message: "Calendario guardado correctamente", severity: "success" });
      if (response.responseObject?.warnings) setWarnings(response.responseObject.warnings);
      setSelectedEmployeeEdit(null);
      setShowEmployeeDetails(false);
      setSelectedDates(new Set());
      setAppliedSchedules(new Map());
      setOriginalSchedules(new Map());
      setEmployeeFinderKey((k) => k + 1);
    } catch (e: any) {
      setSubmitError(e.message || "Error al guardar los horarios");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveEmployee = (employeeId: number) => {
    setSelectedEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));
  };

  return (
    <PageContainer title="Horarios Intercalados" description="Horarios Intercalados">
      <Breadcrumb title="Horarios Intercalados" items={BCrumb} />
      <Box sx={{ mb: 2 }}>
        <EmployeeFinder
          key={employeeFinderKey}
          onEmployeeSelect={handleTopEmployeeSelect}
          error={null}
          showDetails={false}
          attendanceType="intercalated"
          label="Buscar empleado (RFC, CURP, nombre o número de empleado)"
          initialEmployee={null}
        />
        {selectedEmployeeEdit && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "#FAFAFA",
              border: "1px solid #E6EAF2",
              borderRadius: 2,
              px: 2,
              py: 1.25,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "#E6EAF2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748B",
                }}
              >
                <IconUser size={16} />
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
                  {selectedEmployeeEdit.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  #{selectedEmployeeEdit.number_employee ?? selectedEmployeeEdit.id} ·{" "}
                  {selectedEmployeeEdit.attendance_type_display_name}
                </Typography>
              </Box>
            </Box>
            <Link
              component="button"
              underline="hover"
              color="primary"
              sx={{ textTransform: "none", fontWeight: 500, fontSize: 13, p: 0, minWidth: 0 }}
              onClick={() => setShowEmployeeDetails((v) => !v)}
            >
              {showEmployeeDetails ? "Ocultar detalles" : "Ver detalles"}
            </Link>
          </Box>
        )}
        {selectedEmployeeEdit && showEmployeeDetails && (
          <Box sx={{ mt: 2 }}>
            <EmployeeDetailCard employee={selectedEmployeeEdit} />
          </Box>
        )}
      </Box>

      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, md: 9 }}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <CustomCalendar
              key={`${currentYear}-${currentMonth}`}
              daysSelected={Array.from(selectedDates)}
              onDateClick={handleDateClick}
              maxSelections={MAX_SELECTIONS}
              initialMonth={currentMonth}
              initialYear={currentYear}
              onMonthVisibleChange={handleMonthChange}
              hideActions
              scheduleData={scheduleDataMap}
              onScheduleClick={handleScheduleClick}
              employeeId={selectedEmployeeEdit?.id}
            />
          </Paper>
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
                  {displayedSelectedDates.size}
                </Box>
              </Box>

              <Paper variant="outlined" sx={{ p: 1, maxHeight: 200, overflow: "auto" }}>
                {displayedSelectedDates.size > 0 ? (
                  <List dense>
                    {Array.from(displayedSelectedDates).map((date) => (
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

            <Button
              color="error"
              variant="contained"
              fullWidth
              onClick={handleOpenApplySchedule}
              disabled={selectedDates.size === 0}
            >
              Aplicar horarios
            </Button>
            <ApplyScheduleModal
              open={openApplySchedule}
              onClose={() => {
                setOpenApplySchedule(false);
                setIsEditMode(false);
                setEditingDate(null);
              }}
              onConfirm={handleApplyScheduleConfirm}
              onDelete={handleDeleteSchedule}
              defaultStartHourId={currentStartHourId}
              defaultEndHourId={currentEndHourId}
              editingDate={editingDate}
              isEditMode={isEditMode}
            />
            {selectedEmployeeEdit && (
              <Button
                startIcon={<IconDeviceFloppy size={18} />}
                sx={{ mt: 1 }}
                fullWidth
                variant="contained"
                color="primary"
                disabled={!hasChanges}
                onClick={handleSaveCalendar}
              >
                Guardar calendario para {selectedEmployeeEdit.label}
              </Button>
            )}
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

            {!isDuplicateMode && selectedEmployees.length > 0 && (
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Empleados seleccionados:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedEmployees.map((employee) => (
                    <Chip
                      key={employee.id}
                      label={employee.label}
                      onDelete={() => handleRemoveEmployee(employee.id)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid2>
            )}

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

      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle variant="h5">Confirmar guardado</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle2" gutterBottom>
            Se aplicarán los siguientes cambios para {selectedEmployeeEdit?.label}:
          </Typography>
          {monthChangeSummary.removed.length === 0 &&
          monthChangeSummary.added.length === 0 &&
          monthChangeSummary.modified.length === 0 ? (
            <Typography variant="body2">No hay cambios</Typography>
          ) : (
            <>
              {monthChangeSummary.removed.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Fechas eliminadas:</Typography>
                  <List dense>
                    {monthChangeSummary.removed.map((d) => (
                      <ListItem key={d}>
                        <ListItemText primary={d} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              {(monthChangeSummary.added.length > 0 || monthChangeSummary.modified.length > 0) && (
                <Box>
                  <Typography variant="subtitle2">Fechas agregadas/modificadas:</Typography>
                  <List dense>
                    {[...monthChangeSummary.added, ...monthChangeSummary.modified].map((it) => (
                      <ListItem key={it.date}>
                        <ListItemText primary={`${it.date} → ${it.start}–${it.end}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={confirmSaveCalendar} color="primary" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default ShiftSchedulePage;
