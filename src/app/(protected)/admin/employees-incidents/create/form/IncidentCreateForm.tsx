"use client";
import React, { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  setEmployeeData,
  resetForm,
  setErrors,
  clearErrors,
  setIncidentDates,
  setCreatedIncident,
  clearCreatedIncident,
} from "@/store/employees-incidents/EmployeesIncidentsSlice";
import ParentCard from "@/app/components/shared/ParentCard";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomCalendar from "@/components/customComponents/CustomCalendar";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid2,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/es";
import { createEmployeeIncident } from "@/services/employees-incidents";
import type { Employee } from "@/app/api/interfaces/Employee";
import { setSelectedEmployee } from "@/store/slices/employeeIncidentSlice";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import Link from "next/link";
import EmployeeFinder from "@/components/shared/EmployeeFinder";
import { AppDispatch, RootState } from "@/store/store";
import { EmployeeDetailCard } from "@/components/shared/EmployeeDetailCard";
import { useCurrentUser } from "@/hooks/use-current-user";
import { validateIncidentDays } from "@/services/incident-validation";
import type { IResponse } from "@/utils/types";
import IncidentDaysInfo from "@/components/customComponents/IncidentDaysInfo";
import { HttpMessages } from "@/common/response/messages";
import { getFirstDayMonthString, getMonthsBetween } from "@/common/utils";
import { INCIDENT_TYPES_ID } from "@/common/constants/IncidentTypes";
import { MiniMonthCalendar } from "@/components/customComponents/MiniMonthCalendar";
import { SuccessActionDialog } from "@/components/customComponents/SuccessActionDialog";
import { fetchCatalogData } from "@/services/catalogs";
import { fetchHoursData } from "@/services/catalogs";

dayjs.extend(utc);
dayjs.locale("es");

type IncidentCreateFormProps = {
  selectedEmployee?: any;
  onSuccess?: () => void;
  onClose?: () => void;
  isSubmitting?: boolean;
};

const IncidentCreateForm = ({
  selectedEmployee,
  onSuccess,
  onClose,
  isSubmitting: externalSubmitting,
}: IncidentCreateFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useCurrentUser();
  const { formData, errors } = useSelector((state: RootState) => state.createEmployeeIncident);
  const selectedEmployeeFromStore = useSelector((state: RootState) => state.employeeIncident.selectedEmployee);
  const createdIncident = useSelector((state: RootState) => state.createEmployeeIncident.createdIncident);
  const currentEmployee = selectedEmployee || selectedEmployeeFromStore;
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [validationData, setValidationData] = useState<IResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [maxSelections, setMaxSelections] = useState<number>(20);
  const [visibleMonthStart, setVisibleMonthStart] = useState<string>(getFirstDayMonthString(new Date()));

  const submitting = externalSubmitting !== undefined ? externalSubmitting : isSubmitting;
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  const [incidentTypes, setIncidentTypes] = useState<any[]>([]);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hours, setHours] = useState<any[]>([]);
  const [startHourId, setStartHourId] = useState<number>(0);
  const [endHourId, setEndHourId] = useState<number>(0);

  const fetchIncidentTypes = useCallback(async (employeeId: string) => {
    if (!employeeId) {
      return;
    }

    setIsLoadingIncidents(true);
    setLoadError(null);

    try {
      const response = await fetchCatalogData(`incidents/by-employee`, {
        employee_id: employeeId,
      });

      if (response?.success && response.responseObject) {
        setIncidentTypes(response.responseObject);
      } else {
        setLoadError(response?.message || "Error al cargar tipos de incidencia");
        setIncidentTypes([]);
      }
    } catch (error) {
      setLoadError("Error al cargar tipos de incidencia");
      setIncidentTypes([]);
    } finally {
      setIsLoadingIncidents(false);
    }
  }, []);

  const isLoading = isLoadingIncidents;

  React.useEffect(() => {
    if (selectedEmployee && selectedEmployee.id) {
      dispatch(setSelectedEmployee(selectedEmployee));
      dispatch(setEmployeeData(selectedEmployee));
      dispatch(updateFormData({ field: "employeeId", value: selectedEmployee.id.toString() }));
    }
  }, [selectedEmployee, dispatch]);

  React.useEffect(() => {
    if (selectedEmployee?.id) {
      fetchIncidentTypes(selectedEmployee.id.toString());
    }
  }, [selectedEmployee?.id, fetchIncidentTypes]);

  React.useEffect(() => {
    const loadHours = async () => {
      try {
        const response = await fetchHoursData();
        if (response?.success && response.responseObject) {
          setHours(response.responseObject);
        }
      } catch (error) {
        console.error("Error loading hours:", error);
      }
    };
    loadHours();
  }, []);

  const recalculateIncidentDates = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) {
      dispatch(setIncidentDates([]));
      return;
    }

    const start = safeDateFromISO(startDate);
    const end = safeDateFromISO(endDate);

    if (start > end) {
      dispatch(setIncidentDates([]));
      return;
    }

    const dates: string[] = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      dates.push(cursor.toISOString().split("T")[0]);
      cursor.setDate(cursor.getDate() + 1);
    }

    dispatch(setIncidentDates(dates));
  };

  const toggleIncidentDate = (date: string) => {
    const exists = formData.incidentDates.includes(date);

    let nextDates = exists ? formData.incidentDates.filter((d) => d !== date) : [...formData.incidentDates, date];

    if (nextDates.length === 0) {
      dispatch(updateFormData({ field: "startDate", value: "" }));
      dispatch(updateFormData({ field: "endDate", value: "" }));
      dispatch(setIncidentDates([]));
      return;
    }

    nextDates = nextDates.sort();

    dispatch(setIncidentDates(nextDates));
    dispatch(updateFormData({ field: "startDate", value: nextDates[0] }));
    dispatch(updateFormData({ field: "endDate", value: nextDates[nextDates.length - 1] }));
  };

  const getHourDisplayName = (hourId: number) => {
    const hour = hours.find((h) => h.id === hourId);
    return hour?.display_name || "";
  };

  const combineDateAndHour = (date: string, hourId: number) => {
    if (!date || !hourId) return date;
    const hourDisplay = getHourDisplayName(hourId);
    if (!hourDisplay) return date;
    return `${date} ${hourDisplay}:00`;
  };

  const handleDateChange = async (name: string, newValue: dayjs.Dayjs | null) => {
    const dateOnly = newValue ? newValue.format("YYYY-MM-DD") : "";

    let finalValue = dateOnly;
    if (isArrestoIncident && dateOnly) {
      if (name === "startDate" && startHourId) {
        finalValue = combineDateAndHour(dateOnly, startHourId);
      } else if (name === "endDate" && endHourId) {
        finalValue = combineDateAndHour(dateOnly, endHourId);
      }
    }

    dispatch(updateFormData({ field: name, value: finalValue }));

    if (name === "startDate") {
      const endDateForCalc = formData.endDate?.split(" ")[0] || formData.endDate;

      if (!isLactanciaIncident && !isVacationIncident) {
        recalculateIncidentDates(dateOnly, endDateForCalc);
      }

      if (formData.employeeId && formData.incidentId) {
        await validateIncident(formData.employeeId, formData.incidentId, dateOnly, endDateForCalc);
      }
    }

    if (name === "endDate") {
      const startDateForCalc = formData.startDate?.split(" ")[0] || formData.startDate;

      if (!isVacationIncident) {
        recalculateIncidentDates(startDateForCalc, dateOnly);
      }

      if (formData.employeeId && formData.incidentId) {
        await validateIncident(formData.employeeId, formData.incidentId, startDateForCalc, dateOnly);
      }
    }
  };

  const handleHourChange = (name: string, hourId: number) => {
    if (name === "startHourId") {
      setStartHourId(hourId);
      if (formData.startDate) {
        const dateOnly = formData.startDate.split(" ")[0];
        const newValue = combineDateAndHour(dateOnly, hourId);
        dispatch(updateFormData({ field: "startDate", value: newValue }));
      }
    } else if (name === "endHourId") {
      setEndHourId(hourId);
      if (formData.endDate) {
        const dateOnly = formData.endDate.split(" ")[0];
        const newValue = combineDateAndHour(dateOnly, hourId);
        dispatch(updateFormData({ field: "endDate", value: newValue }));
      }
    }
  };

  const validateIncident = async (employeeId: string, incidentId: string, startDate?: string, endDate?: string) => {
    if (!employeeId || !incidentId) {
      setValidationData(null);
      setValidationError(null);
      return null;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      const response = await validateIncidentDays(employeeId, incidentId, startDate, endDate);
      setValidationData(response);

      if (response.success && response.responseObject) {
        const maxDays = response.responseObject.hasRules === false ? 365 : response.responseObject.remaining_days;
        setMaxSelections(maxDays);

        if (Number(incidentId) === INCIDENT_TYPES_ID.LACTANCIA && startDate && maxDays > 0) {
          const start = new Date(startDate);
          const calculatedEndDate = new Date(start);
          calculatedEndDate.setDate(calculatedEndDate.getDate() + maxDays - 1);
          const endDateStr = calculatedEndDate.toISOString().split("T")[0];
          dispatch(updateFormData({ field: "endDate", value: endDateStr }));
        }

        return maxDays;
      }
      setValidationData(null);
      setValidationError(HttpMessages.error.internalServerError);
      return null;
    } catch (error) {
      setValidationData(null);
      setValidationError(HttpMessages.error.internalServerError);
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  const handleChange = async (event: any) => {
    const { name, value } = event.target;
    const updatedFormData = { ...formData, [name]: value };
    dispatch(updateFormData({ field: name, value }));

    if (name === "employeeId") {
      const newErrors = { ...errors };
      delete newErrors.employeeId;
      const filteredErrors = Object.fromEntries(
        Object.entries(newErrors).filter(([_, v]) => typeof v === "string" && v !== undefined),
      );
      dispatch(setErrors(filteredErrors as { [key: string]: string }));
      setValidationData(null);
      setValidationError(null);
    }

    if (name === "incidentId") {
      const selectedIncident = incidentTypes?.find((item) => item.id === value);
      const isCalendarIncident = selectedIncident?.display_calendar_dates;
      dispatch(updateFormData({ field: "startDate", value: "" }));
      dispatch(updateFormData({ field: "endDate", value: "" }));
      dispatch(updateFormData({ field: "incidentDates", value: [] }));

      if (isCalendarIncident) {
        setOpenCalendar(true);
      }

      setValidationData(null);
      setValidationError(null);
    }

    if (
      (name === "employeeId" || name === "incidentId") &&
      updatedFormData.employeeId &&
      updatedFormData.incidentId &&
      Number(updatedFormData.incidentId) !== INCIDENT_TYPES_ID.LACTANCIA
    ) {
      const defaultDate = visibleMonthStart;
      validateIncident(
        updatedFormData.employeeId,
        updatedFormData.incidentId,
        updatedFormData.startDate || defaultDate,
        updatedFormData.endDate || defaultDate,
      );
    }

    if (name === "startDate") {
      recalculateIncidentDates(value, formData.endDate);

      if (formData.employeeId && formData.incidentId) {
        await validateIncident(formData.employeeId, formData.incidentId, value, formData.endDate);
      }
    }

    if (name === "endDate") {
      recalculateIncidentDates(formData.startDate, value);

      if (formData.employeeId && formData.incidentId) {
        await validateIncident(formData.employeeId, formData.incidentId, formData.startDate, value);
      }
    }
  };

  const handleSelectEmployee = async (employee: Employee) => {
    dispatch(setSelectedEmployee(employee));
    dispatch(setEmployeeData(employee));

    if (employee?.id) {
      const employeeId = employee.id.toString();
      dispatch(updateFormData({ field: "employeeId", value: employeeId }));
      dispatch(updateFormData({ field: "incidentId", value: "0" }));
      dispatch(updateFormData({ field: "startDate", value: "" }));
      dispatch(updateFormData({ field: "endDate", value: "" }));
      dispatch(updateFormData({ field: "incidentDates", value: [] }));

      const newErrors = { ...errors };
      delete newErrors.employeeId;
      const filteredErrors = Object.fromEntries(
        Object.entries(newErrors).filter(([_, v]) => typeof v === "string" && v !== undefined),
      );
      dispatch(setErrors(filteredErrors as { [key: string]: string }));

      await fetchIncidentTypes(employeeId);
    } else {
      dispatch(updateFormData({ field: "employeeId", value: "" }));
      dispatch(updateFormData({ field: "incidentId", value: "0" }));
      dispatch(updateFormData({ field: "startDate", value: "" }));
      dispatch(updateFormData({ field: "endDate", value: "" }));
      dispatch(updateFormData({ field: "incidentDates", value: [] }));
      setIncidentTypes([]);
    }
  };

  const goToForm = () => {
    dispatch(resetForm());
    setOpenSuccessDialog(false);
  };

  const goToDetail = () => {
    const id = createdIncident?.id;
    if (!id) return;

    router.push(`/admin/employees-incidents/${id}`);

    dispatch(resetForm());
    dispatch(clearCreatedIncident());
  };

  const goToList = () => {
    router.push("/admin/employees-incidents");

    dispatch(resetForm());
    dispatch(clearCreatedIncident());
  };

  const error = loadError as string | null;

  const filteredIncidentTypes = useMemo(() => {
    if (!incidentTypes || !Array.isArray(incidentTypes)) return [];
    return incidentTypes;
  }, [incidentTypes]);

  const calendarIncidentIds = useMemo(() => {
    return filteredIncidentTypes?.filter((item) => item.display_calendar_dates).map((item) => item.id) || [];
  }, [filteredIncidentTypes]);

  const isVacationIncident = useMemo(() => {
    return calendarIncidentIds.includes(formData.incidentId);
  }, [formData.incidentId, calendarIncidentIds]);

  const shouldDisplayCalendarDates = useMemo(() => {
    const incident = filteredIncidentTypes?.find((item) => item.id === formData.incidentId);
    return incident?.display_calendar_dates ?? false;
  }, [formData.incidentId, filteredIncidentTypes]);

  const isLactanciaIncident = useMemo(() => {
    return Number(formData.incidentId) === INCIDENT_TYPES_ID.LACTANCIA;
  }, [formData.incidentId]);

  const isArrestoIncident = useMemo(() => {
    return Number(formData.incidentId) === INCIDENT_TYPES_ID.ARRESTO;
  }, [formData.incidentId]);

  const isEntryOrExitIncident = useMemo(() => {
    const incidentId = Number(formData.incidentId);
    return (
      incidentId === INCIDENT_TYPES_ID.JUSTIFICACION_ENTRADA || incidentId === INCIDENT_TYPES_ID.JUSTIFICACION_SALIDA
    );
  }, [formData.incidentId]);

  const handleCalendarSave = async (selectedDates: string[]) => {
    if (selectedDates.length > 0) {
      const startDate = selectedDates[0];
      const endDate = selectedDates[selectedDates.length - 1];

      dispatch(updateFormData({ field: "startDate", value: startDate }));
      dispatch(updateFormData({ field: "endDate", value: endDate }));
      dispatch(setIncidentDates(selectedDates));

      if (formData.employeeId && formData.incidentId) {
        await validateIncident(formData.employeeId, formData.incidentId, startDate, endDate);
      }
    }
    setOpenCalendar(false);
  };

  const handleCalendarCancel = () => {
    setOpenCalendar(false);
  };

  const lastValidationRef = useRef<string | null>(null);

  const handleCalendarMonthChange = useCallback(
    (year: number, month: number) => {
      const m = String(month).padStart(2, "0");
      const monthStart = `${year}-${m}-01`;

      setVisibleMonthStart(monthStart);

      const curIncidentId = Number(formData.incidentId);
      const isEntryOrExit =
        curIncidentId === INCIDENT_TYPES_ID.JUSTIFICACION_ENTRADA ||
        curIncidentId === INCIDENT_TYPES_ID.JUSTIFICACION_SALIDA;

      if (isEntryOrExit && formData.employeeId && formData.incidentId) {
        const key = `${formData.employeeId}-${formData.incidentId}-${year}-${m}`;
        if (lastValidationRef.current === key) return;
        lastValidationRef.current = key;
        validateIncident(formData.employeeId, formData.incidentId, monthStart, monthStart);
      }
    },
    [formData.employeeId, formData.incidentId],
  );

  const selectedDatesForCalendar = useMemo(() => {
    if (formData.incidentDates && formData.incidentDates.length > 0) {
      return formData.incidentDates;
    }
    const { startDate, endDate } = formData as { startDate: string; endDate: string };
    if (!startDate) return [] as string[];
    const start = new Date(startDate);
    const end = new Date(endDate || startDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return [] as string[];

    const dates: string[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(cur.toISOString().split("T")[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  }, [formData.incidentDates, formData.startDate, formData.endDate]);

  const removeDates = () => {
    dispatch(updateFormData({ field: "startDate", value: "" }));
    dispatch(updateFormData({ field: "endDate", value: "" }));
    dispatch(updateFormData({ field: "incidentDates", value: [] }));

    if (formData.employeeId && formData.incidentId) {
      validateIncident(formData.employeeId, formData.incidentId, visibleMonthStart, visibleMonthStart);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    dispatch(clearErrors());

    try {
      const shouldIncludeIncidentDates = isVacationIncident && !isArrestoIncident;

      const { incidentDates, ...formDataWithoutDates } = formData;

      const submitData: any = {
        ...formDataWithoutDates,
        employeeId: Number(formData.employeeId),
        ...(shouldIncludeIncidentDates && { incidentDates }),
      };

      const response = await createEmployeeIncident(submitData);
      if (!response.success) {
        if (response.responseObject) {
          const newErrors: { [key: string]: string } = {};
          for (const key in response.responseObject) {
            if (response.responseObject[key].messages && response.responseObject[key].messages.length > 0) {
              newErrors[key] = response.responseObject[key].messages[0];
            }
          }
          dispatch(setErrors(newErrors));
          setResponseMessage(response.message);
          setIsSuccess(false);
        } else {
          throw new Error("Error al enviar el formulario. Por favor intente nuevamente.");
        }
        return;
      } else {
        setIsSuccess(true);
        setResponseMessage(response.message);

        dispatch(setCreatedIncident(response.responseObject));
        setOpenSuccessDialog(true);
      }
    } catch (err) {
      setResponseMessage("Hubo un error inesperado.");
    } finally {
      setIsSubmitting(false);
      setOpenDialog(false);
    }
  };

  const handlePreventClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  return (
    <ParentCard title="Ingrese los datos de la incidencia">
      <Box>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            {selectedEmployee ? (
              <Grid2 size={{ lg: 12 }}>
                <EmployeeDetailCard
                  employee={{
                    full_name: selectedEmployee.full_name || "",
                    label: selectedEmployee.label || "",
                    number_employee: selectedEmployee.number_employee || "",
                    birthday: selectedEmployee.birthday ? String(selectedEmployee.birthday) : "",
                    rfc: selectedEmployee.rfc || "",
                    curp: selectedEmployee.curp || "",
                    direccion_display_name: selectedEmployee.direccion_display_name || "",
                    secretaria_display_name: selectedEmployee.secretaria_display_name || "",
                    category_display_name: selectedEmployee.category_display_name || "",
                    employee_type_display_name: selectedEmployee.employee_type_display_name || "",
                    trade_union_display_name: selectedEmployee.trade_union_display_name || "",
                    location_display_name: selectedEmployee.location_display_name || "",
                    attendance_type_display_name: selectedEmployee.attendance_type_display_name || "",
                  }}
                />
              </Grid2>
            ) : (
              <Grid2 size={{ lg: 12 }}>
                <EmployeeFinder
                  onEmployeeSelect={handleSelectEmployee}
                  error={errors.employeeId || ""}
                  initialEmployee={selectedEmployee}
                />
              </Grid2>
            )}
            <Grid2 size={{ lg: 12 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Tipo de incidencia</CustomFormLabel>
                <CustomSelect
                  fullWidth
                  name="incidentId"
                  value={formData.incidentId}
                  onChange={handleChange}
                  disabled={!formData.employeeId || formData.employeeId === "0" || isLoading || !!loadError}
                  error={!!errors.incidentId}
                >
                  <MenuItem key="default" value="0">
                    {!formData.employeeId || formData.employeeId === "0"
                      ? "Primero selecciona un empleado"
                      : isLoading
                        ? "Cargando tipos de incidencia..."
                        : "Selecciona el tipo de incidencia"}
                  </MenuItem>
                  {isLoading ? (
                    <MenuItem disabled> Cargando...</MenuItem>
                  ) : error ? (
                    <MenuItem disabled>Error al cargar</MenuItem>
                  ) : (
                    filteredIncidentTypes?.map((incident) => (
                      <MenuItem key={incident.id} value={incident.id}>
                        {incident.display_name}
                      </MenuItem>
                    ))
                  )}
                </CustomSelect>
                <CustomLabelError field={errors.incidentId} />

                {formData.employeeId && formData.incidentId && formData.incidentId !== "0" && (
                  <Box mt={2}>
                    {isValidating && <Typography variant="caption">Validando...</Typography>}
                    {validationError && (
                      <Typography variant="caption" color="error">
                        Error: {validationError}
                      </Typography>
                    )}

                    <Box mt={2}>
                      <IncidentDaysInfo
                        validationData={validationData}
                        isLoading={isValidating}
                        error={validationError}
                      />
                    </Box>
                  </Box>
                )}
              </FormControl>
            </Grid2>

            <Dialog fullWidth maxWidth="xl" open={openCalendar} onClose={handleCalendarCancel} disableEscapeKeyDown>
              <DialogTitle>Seleccionar fechas de incidencia</DialogTitle>
              <DialogContent>
                {formData && formData.employeeId && (
                  <CustomCalendar
                    key={formData.incidentId}
                    employeeId={formData.employeeId}
                    onSave={handleCalendarSave}
                    onCancel={handleCalendarCancel}
                    maxSelections={maxSelections}
                    daysSelected={selectedDatesForCalendar}
                    onMonthVisibleChange={handleCalendarMonthChange}
                    clearOnMonthChange={isEntryOrExitIncident}
                  />
                )}
              </DialogContent>
            </Dialog>

            <Grid2 size={{ xs: 12, md: isArrestoIncident ? 4 : 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Fecha de inicio</CustomFormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    value={formData.startDate ? dayjs(formData.startDate.split(" ")[0]) : null}
                    onChange={(newValue) => handleDateChange("startDate", newValue)}
                    disabled={isVacationIncident}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                      },
                    }}
                  />
                </LocalizationProvider>
                <CustomLabelError field={errors.startDate} />
              </FormControl>
            </Grid2>
            {isArrestoIncident && (
              <Grid2 size={{ xs: 12, md: 2 }}>
                <FormControl fullWidth>
                  <CustomFormLabel sx={{ mt: 1 }}>Hora inicio</CustomFormLabel>
                  <CustomSelect
                    value={startHourId}
                    onChange={(e: any) => handleHourChange("startHourId", Number(e.target.value))}
                    size="small"
                    fullWidth
                    displayEmpty
                  >
                    <MenuItem value={0} disabled>
                      --:--
                    </MenuItem>
                    {hours.map((hour) => (
                      <MenuItem key={hour.id} value={hour.id}>
                        {hour.display_name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </FormControl>
              </Grid2>
            )}
            <Grid2 size={{ xs: 12, md: isArrestoIncident ? 4 : 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Fecha de terminación</CustomFormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    value={formData.endDate ? dayjs(formData.endDate.split(" ")[0]) : null}
                    onChange={(newValue) => handleDateChange("endDate", newValue)}
                    disabled={isVacationIncident || isLactanciaIncident}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.endDate,
                      },
                    }}
                  />
                </LocalizationProvider>
                <CustomLabelError field={errors.endDate && errors.endDate} />
              </FormControl>
            </Grid2>
            {isArrestoIncident && (
              <Grid2 size={{ xs: 12, md: 2 }}>
                <FormControl fullWidth>
                  <CustomFormLabel sx={{ mt: 1 }}>Hora fin</CustomFormLabel>
                  <CustomSelect
                    value={endHourId}
                    onChange={(e: any) => handleHourChange("endHourId", Number(e.target.value))}
                    size="small"
                    fullWidth
                    displayEmpty
                  >
                    <MenuItem value={0} disabled>
                      --:--
                    </MenuItem>
                    {hours.map((hour) => (
                      <MenuItem key={hour.id} value={hour.id}>
                        {hour.display_name}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </FormControl>
              </Grid2>
            )}

            <Grid2 size={{ lg: 12 }}>
              <FormControl fullWidth>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Box>
                    <CustomFormLabel sx={{ mt: 0 }}>Fechas de incidencia</CustomFormLabel>
                    {formData.incidentDates && formData.incidentDates.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        {formData.incidentDates.length} días seleccionados
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    border: 1,
                    borderColor: "grey.300",
                    borderRadius: 1,
                    p: 2,
                    minHeight: 56,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    backgroundColor: "primary.light",
                  }}
                >
                  {formData.incidentDates && formData.incidentDates.length > 0 ? (
                    <>
                      {formData.startDate && formData.endDate && (
                        <>
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: {
                                xs: "1fr",
                                sm: "repeat(2, 1fr)",
                                md: "repeat(3, 1fr)",
                                lg: "repeat(4, 1fr)",
                              },
                              gap: 2,
                            }}
                          >
                            {getMonthsBetween(formData.startDate, formData.endDate).map(({ year, month }) => (
                              <MiniMonthCalendar
                                key={`${year}-${month}`}
                                year={year}
                                month={month}
                                selectedDates={formData.incidentDates}
                                onToggleDate={shouldDisplayCalendarDates ? toggleIncidentDate : undefined}
                              />
                            ))}
                          </Box>
                        </>
                      )}
                    </>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                      <Typography variant="body2" color="textSecondary">
                        No se han seleccionado fechas de incidencia
                      </Typography>
                      {shouldDisplayCalendarDates && (
                        <Button variant="outlined" size="small" onClick={() => setOpenCalendar(true)}>
                          Seleccionar fechas
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>

                {formData.incidentDates && formData.incidentDates.length > 0 && shouldDisplayCalendarDates && (
                  <Stack direction="row" spacing={1} mt={2}>
                    <Button variant="outlined" size="small" onClick={() => setOpenCalendar(true)}>
                      Modificar fechas
                    </Button>
                    <Button variant="outlined" color="warning" size="small" onClick={removeDates}>
                      Quitar fechas
                    </Button>
                  </Stack>
                )}
              </FormControl>
            </Grid2>

            <Grid2 size={{ lg: 12 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Justificación</CustomFormLabel>
                <CustomTextField
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  fullWidth
                />
                <CustomLabelError field={errors.description && errors.description} />
              </FormControl>
            </Grid2>

            <Grid2 size={12}>
              {responseMessage && (
                <Alert severity={isSuccess ? "success" : "error"}>
                  <Typography variant="body1" fontWeight={600}>
                    {responseMessage}
                  </Typography>
                </Alert>
              )}
            </Grid2>

            <Grid2 size={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Link href={"/admin/employees-incidents"} passHref>
                  <Button variant="contained" color="error" sx={{ display: "flex" }}>
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  sx={{ display: "flex" }}
                >
                  Guardar
                </Button>
              </Stack>
            </Grid2>
          </Grid2>
        </form>
      </Box>

      <Dialog open={openDialog} onClose={handlePreventClose} maxWidth="sm" disableEscapeKeyDown>
        <Box sx={{ p: 3 }}>
          <DialogTitle id="alert-dialog-title" variant="h5">
            {"Creación de nueva incidencia"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">¿Desea continuar?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCancel} color="error" disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleConfirm} color="primary" autoFocus disabled={isSubmitting}>
              Continuar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <SuccessActionDialog
        open={openSuccessDialog}
        title="Datos enviados"
        message={responseMessage}
        actions={[
          {
            label: "Ver incidencia",
            primary: true,
            onClick: goToDetail,
          },
          {
            label: "Ver listado",
            variant: "outlined",
            onClick: goToList,
          },
          {
            label: "Crear otra",
            variant: "text",
            color: "error",
            onClick: goToForm,
          },
        ]}
      />
    </ParentCard>
  );
};
export default IncidentCreateForm;
