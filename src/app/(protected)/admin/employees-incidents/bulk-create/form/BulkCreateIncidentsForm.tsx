"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Grid2,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import ParentCard from "@/app/components/shared/ParentCard";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import CustomCalendar from "@/components/customComponents/CustomCalendar";
import { MiniMonthCalendar } from "@/components/customComponents/MiniMonthCalendar";
import { fetchSecretariasData, fetchDireccionesData, fetchCatalogData, fetchHoursData } from "@/services/catalogs";
import { getEmployees } from "@/services/employees";
import { createBulkEmployeeIncidents } from "@/services/employees-incidents";
import { validateIncidentDays } from "@/services/incident-validation";
import { INCIDENT_TYPES_ID } from "@/common/constants/IncidentTypes";
import type { ICatalogCreate } from "@/interfaces/Catalogs";

interface EmployeeWithIncidentStatus {
  id: number;
  numberEmployee: string;
  full_name: string;
  attendance_type_display_name: string;
  existingIncident?: boolean;
  validationData?: any;
  hasConflict?: boolean;
}

interface Secretaria extends ICatalogCreate {
  id: number | string;
}

interface Direccion extends ICatalogCreate {
  id: number | string;
  secretaria_id?: number | string;
}

interface Incident extends ICatalogCreate {
  id: number;
  allow_bulk_creation: boolean;
  display_calendar_dates: boolean;
}

interface Hour extends ICatalogCreate {
  id: number | string;
}

function getMonthsBetween(start: string, end: string) {
  const months: { year: number; month: number }[] = [];
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  let cursor = startDate.startOf("month");
  while (cursor.isBefore(endDate) || cursor.isSame(endDate, "month")) {
    months.push({
      year: cursor.year(),
      month: cursor.month(),
    });
    cursor = cursor.add(1, "month");
  }

  return months;
}

const BulkCreateIncidentsForm: React.FC = () => {
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [selectedSecretaria, setSelectedSecretaria] = useState<number>(0);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [selectedDireccion, setSelectedDireccion] = useState<number>(0);
  const [employees, setEmployees] = useState<EmployeeWithIncidentStatus[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [hours, setHours] = useState<Hour[]>([]);
  const [selectedIncidentType, setSelectedIncidentType] = useState<number>(0);
  const [startHourId, setStartHourId] = useState<number>(0);
  const [endHourId, setEndHourId] = useState<number>(0);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchSecretarias();
    fetchIncidents();
    fetchHours();
  }, []);

  useEffect(() => {
    if (selectedSecretaria) {
      fetchDirecciones(Number(selectedSecretaria));
    } else {
      setDirecciones([]);
      setSelectedDireccion(0);
      setEmployees([]);
    }
  }, [selectedSecretaria]);

  useEffect(() => {
    const isIncidentConfigured =
      selectedSecretaria > 0 &&
      selectedDireccion > 0 &&
      selectedIncidentType > 0 &&
      !!startDate &&
      !!endDate &&
      (!isArrestoIncident || (startHourId > 0 && endHourId > 0));

    if (isIncidentConfigured) {
      fetchEmployeesByDireccion(Number(selectedDireccion));
    } else {
      setEmployees([]);
    }
  }, [selectedSecretaria, selectedDireccion, selectedIncidentType, startDate, endDate]);

  const fetchSecretarias = async () => {
    try {
      const response = await fetchSecretariasData();
      if (response && response.success) {
        setSecretarias(response.responseObject || []);
      }
    } catch (err) {
      console.error("Error fetching secretarias:", err);
    }
  };

  const fetchDirecciones = async (secretariaId: number) => {
    try {
      const response = await fetchDireccionesData(secretariaId.toString());
      if (response && response.success) {
        setDirecciones(response.responseObject || []);
      }
    } catch (err) {
      console.error("Error fetching direcciones:", err);
    }
  };

  const fetchEmployeesByDireccion = async (direccionId: number) => {
    try {
      setLoading(true);
      const response = await getEmployees(`direccion=${direccionId}&limit=1000`);
      if (response.success) {
        const employeesData = response.responseObject?.data || [];
        setEmployees(
          employeesData.map((emp: any) => ({
            id: emp.id,
            full_name: `${emp.name} ${emp.paternal_last_name} ${emp.maternal_last_name}`,
            numberEmployee: emp.number_employee,
            attendance_type_display_name: emp.employee_attendance_type?.[0]?.attendance?.display_name || "N/A",
            existingIncident: false,
          })),
        );
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await fetchCatalogData("incidents");
      if (response && response.success) {
        setIncidents(response.responseObject || []);
      }
    } catch (err) {
      console.error("Error fetching incidents:", err);
    }
  };

  const fetchHours = async () => {
    try {
      const response = await fetchHoursData();
      if (response && response.success) {
        setHours(response.responseObject || []);
      }
    } catch (err) {
      console.error("Error fetching hours:", err);
    }
  };

  const handleCalendarSave = (dates: string[]) => {
    if (dates.length > 0) {
      const firstDate = dates[0];
      const lastDate = dates[dates.length - 1];

      setStartDate(dayjs(firstDate));
      setEndDate(dayjs(lastDate));
      setSelectedDates(dates);
    } else {
      setStartDate(null);
      setEndDate(null);
      setSelectedDates([]);
    }
    setOpenCalendar(false);
  };

  const handleCalendarCancel = () => {
    setOpenCalendar(false);
  };

  const handleIncidentTypeChange = (incidentId: number) => {
    setSelectedIncidentType(incidentId);
    setSelectedDates([]);
    setStartDate(null);
    setEndDate(null);
    setStartHourId(0);
    setEndHourId(0);

    const selectedIncident = incidents.find((inc) => inc.id === incidentId);
    const isCalendarIncident = selectedIncident?.display_calendar_dates;

    if (isCalendarIncident) {
      setOpenCalendar(true);
    }
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

  const handleDateChange = (field: "startDate" | "endDate", newValue: Dayjs | null) => {
    let newStartDate = startDate;
    let newEndDate = endDate;

    if (field === "startDate") {
      newStartDate = newValue;
      setStartDate(newValue);
    } else {
      newEndDate = newValue;
      setEndDate(newValue);
    }

    if (newStartDate && newEndDate && (shouldDisplayCalendarDates || isArrestoIncident)) {
      const dates = generateDatesBetween(newStartDate, newEndDate);
      setSelectedDates(dates);
    } else if (!newStartDate || !newEndDate) {
      setSelectedDates([]);
    }
  };

  const generateDatesBetween = (start: Dayjs, end: Dayjs) => {
    const dates: string[] = [];
    let current = start.startOf("day");
    const endOfDay = end.endOf("day");

    while (current.isBefore(endOfDay) || current.isSame(endOfDay, "day")) {
      dates.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }

    return dates;
  };

  const removeDates = () => {
    setSelectedDates([]);
    setStartDate(null);
    setEndDate(null);
  };

  const toggleIncidentDate = (date: string) => {
    setSelectedDates((prev) => {
      let newDates: string[];

      if (prev.includes(date)) {
        newDates = prev.filter((d) => d !== date);
      } else {
        newDates = [...prev, date].sort();
      }

      if (newDates.length > 0) {
        setStartDate(dayjs(newDates[0]));
        setEndDate(dayjs(newDates[newDates.length - 1]));
      } else {
        setStartDate(null);
        setEndDate(null);
      }

      return newDates;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableEmployees = employees.filter((emp) => !emp.existingIncident);
      setSelectedEmployees(selectableEmployees.map((emp) => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleEmployeeSelect = (employeeId: number, checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [...prev, employeeId]);
    } else {
      setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId));
    }
  };

  const checkForIncidentConflicts = async (
    employeeId: number,
    incidentDates: string[],
    incidentId: number,
  ): Promise<boolean> => {
    try {
      const startDate = incidentDates[0];
      const endDate = incidentDates[incidentDates.length - 1];

      const response = await fetch(
        `/api/incident-rules/validate?employeeId=${employeeId}&incidentId=${incidentId}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
        {
          method: "GET",
        },
      );

      if (!response.ok) {
        return true;
      }

      const result = await response.json();
      return !result.success;
    } catch (error) {
      console.error("Error checking incident conflicts:", error);
      return true;
    }
  };

  const validateEmployeeIncidents = async () => {
    if (!selectedIncidentType || selectedIncidentType === 0 || !startDate || !endDate || employees.length === 0) {
      return;
    }

    let startDateForValidation = startDate?.format("YYYY-MM-DD");
    let endDateForValidation = endDate?.format("YYYY-MM-DD");

    if (isArrestoIncident) {
      if (startHourId) {
        startDateForValidation = combineDateAndHour(startDate?.format("YYYY-MM-DD") || "", startHourId);
      }

      if (endHourId) {
        endDateForValidation = combineDateAndHour(endDate?.format("YYYY-MM-DD") || "", endHourId);
      } else {
        endDateForValidation = combineDateAndHour(endDate?.format("YYYY-MM-DD") || "", startHourId || 0);
      }
    }

    const updatedEmployees = await Promise.all(
      employees.map(async (employee) => {
        try {
          const validation = await validateIncidentDays(
            employee.id,
            selectedIncidentType,
            startDateForValidation,
            endDateForValidation,
          );

          const hasConflictWithOtherIncidents =
            selectedDates.length > 0
              ? await checkForIncidentConflicts(employee.id, selectedDates, selectedIncidentType)
              : false;

          const hasConflict =
            !validation.success ||
            (validation.responseObject &&
              validation.responseObject.remaining_days < selectedDates.length &&
              validation.responseObject.hasRules !== false) ||
            hasConflictWithOtherIncidents;

          return {
            ...employee,
            validationData: validation,
            hasConflict,
            existingIncident: hasConflict,
          };
        } catch (error) {
          console.error(`Error validating employee ${employee.id}:`, error);
          return {
            ...employee,
            hasConflict: true,
            existingIncident: true,
            validationData: null,
          };
        }
      }),
    );

    setEmployees(updatedEmployees);
  };

  useEffect(() => {
    const canValidate =
      selectedIncidentType > 0 &&
      !!startDate &&
      !!endDate &&
      employees.length > 0 &&
      (!isArrestoIncident || (startHourId > 0 && endHourId > 0));

    if (!canValidate) return;

    validateEmployeeIncidents();
  }, [selectedIncidentType, startDate, endDate, selectedDates, startHourId, endHourId]);

  const handleSubmit = async () => {
    if (isArrestoIncident && startHourId && endHourId) {
      const startHourDisplay = getHourDisplayName(startHourId);
      const endHourDisplay = getHourDisplayName(endHourId);

      if (startHourDisplay && endHourDisplay) {
        const [startHour, startMin] = startHourDisplay.split(":").map(Number);
        const [endHour, endMin] = endHourDisplay.split(":").map(Number);

        const startTotalMinutes = startHour * 60 + startMin;
        const endTotalMinutes = endHour * 60 + endMin;

        if (startDate?.format("YYYY-MM-DD") === endDate?.format("YYYY-MM-DD") && endTotalMinutes < startTotalMinutes) {
          setError(
            "Para incidencias tipo ARRESTO, la hora de fin debe ser mayor o igual a la hora de inicio cuando es el mismo día",
          );
          return;
        }
      }
    }

    try {
      setLoading(true);
      setErrors({});
      setError("");
      setSuccess("");

      const payload = {
        employeeIds: selectedEmployees,
        incidentId: Number(selectedIncidentType),
        startDate:
          isArrestoIncident && startHourId
            ? combineDateAndHour(startDate?.format("YYYY-MM-DD") || "", startHourId)
            : startDate?.format("YYYY-MM-DD") || "",
        endDate:
          isArrestoIncident && endHourId
            ? combineDateAndHour(endDate?.format("YYYY-MM-DD") || "", endHourId)
            : endDate?.format("YYYY-MM-DD") || "",
        description: description,
        incidentDates: selectedDates,
        startHour: isArrestoIncident && startHourId ? startHourId : null,
        endHour: isArrestoIncident && endHourId ? endHourId : null,
      };

      const response = await createBulkEmployeeIncidents(payload);

      if (response.success) {
        setSuccess("Incidencias creadas exitosamente");
        setSelectedEmployees([]);
        setDescription("");
        setSelectedDates([]);
        setStartDate(null);
        setEndDate(null);
        setStartHourId(0);
        setEndHourId(0);
        setSelectedSecretaria(0);
        setSelectedDireccion(0);
        setSelectedIncidentType(0);
        setEmployees([]);
        setError("");
        setErrors({});
        setDescription("");
      } else {
        if (response.responseObject) {
          const newErrors: { [key: string]: string } = {};
          for (const key in response.responseObject) {
            if (response.responseObject[key].messages && response.responseObject[key].messages.length > 0) {
              newErrors[key] = response.responseObject[key].messages[0];
            }
          }
          setErrors(newErrors);
        }
        setError(response.message || "Error al crear las incidencias");
      }
    } catch (error: any) {
      setError(error.message || "Error al crear las incidencias");
    } finally {
      setLoading(false);
    }
  };

  const selectedIncidentData = useMemo(() => {
    return incidents.find((inc) => inc.id === Number(selectedIncidentType));
  }, [selectedIncidentType, incidents]);

  const shouldDisplayCalendarDates = useMemo(() => {
    return selectedIncidentData?.display_calendar_dates ?? false;
  }, [selectedIncidentData]);

  const isArrestoIncident = useMemo(() => {
    return Number(selectedIncidentType) === INCIDENT_TYPES_ID.ARRESTO;
  }, [selectedIncidentType]);

  const selectableEmployees = employees.filter((emp) => !emp.hasConflict);
  const conflictedEmployees = employees.filter((emp) => emp.hasConflict);

  return (
    <ParentCard title="Creación masiva de incidencias">
      <Box>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Grid2 container spacing={2}>
            <Grid2 size={{ lg: 3, xs: 12 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Organismo Público</CustomFormLabel>
                <CustomSelect
                  fullWidth
                  value={selectedSecretaria || "0"}
                  onChange={(e: any) => {
                    setSelectedSecretaria(Number(e.target.value));
                    setSelectedDireccion(0);
                  }}
                  displayEmpty
                >
                  <MenuItem key="default" value="0">
                    Selecciona el organismo público
                  </MenuItem>
                  {secretarias.map((secretaria) => (
                    <MenuItem key={secretaria.id} value={secretaria.id}>
                      {secretaria.display_name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid2>

            <Grid2 size={{ lg: 3, xs: 12 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Organismo administrativo</CustomFormLabel>
                <CustomSelect
                  fullWidth
                  value={selectedDireccion || "0"}
                  onChange={(e: any) => setSelectedDireccion(Number(e.target.value))}
                  disabled={!selectedSecretaria}
                  displayEmpty
                >
                  <MenuItem key="default" value="0">
                    Selecciona el organismo administrativo
                  </MenuItem>
                  {direcciones.map((direccion) => (
                    <MenuItem key={direccion.id} value={direccion.id}>
                      {direccion.display_name}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </Grid2>

            <Grid2 size={{ lg: 2, xs: 12 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Tipo de incidencia</CustomFormLabel>
                <CustomSelect
                  fullWidth
                  value={selectedIncidentType || "0"}
                  onChange={(e: any) => handleIncidentTypeChange(Number(e.target.value))}
                  disabled={!incidents.length || !selectedDireccion}
                  displayEmpty
                >
                  <MenuItem key="default" value="0">
                    Selecciona el tipo de incidencia
                  </MenuItem>
                  {incidents
                    .filter((incident) => incident.allow_bulk_creation)
                    .map((incident) => (
                      <MenuItem key={incident.id} value={incident.id}>
                        {incident.display_name}
                      </MenuItem>
                    ))}
                </CustomSelect>
              </FormControl>
            </Grid2>

            <Grid2 size={{ lg: 2, xs: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Fecha de inicio</CustomFormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    value={startDate}
                    onChange={(newValue) => handleDateChange("startDate", newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid2>

            <Grid2 size={{ lg: 2, xs: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Fecha de terminación</CustomFormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  <DatePicker
                    value={endDate}
                    onChange={(newValue) => handleDateChange("endDate", newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid2>

            {isArrestoIncident && (
              <>
                <Grid2 size={{ lg: 6, xs: 6 }}>
                  <FormControl fullWidth>
                    <CustomFormLabel sx={{ mt: 1 }}>Hora inicio</CustomFormLabel>
                    <CustomSelect
                      value={startHourId || "0"}
                      onChange={(e: any) => setStartHourId(Number(e.target.value))}
                      size="small"
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem key="default" value="0">
                        00:00:00
                      </MenuItem>
                      {hours.map((hour) => (
                        <MenuItem key={hour.id} value={hour.id}>
                          {hour.display_name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </FormControl>
                </Grid2>

                <Grid2 size={{ lg: 6, xs: 6 }}>
                  <FormControl fullWidth>
                    <CustomFormLabel sx={{ mt: 1 }}>Hora fin</CustomFormLabel>
                    <CustomSelect
                      value={endHourId || "0"}
                      onChange={(e: any) => setEndHourId(Number(e.target.value))}
                      size="small"
                      fullWidth
                      displayEmpty
                    >
                      <MenuItem key="default" value="0">
                        00:00:00
                      </MenuItem>
                      {hours.map((hour) => (
                        <MenuItem key={hour.id} value={hour.id}>
                          {hour.display_name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </FormControl>
                </Grid2>
              </>
            )}

            <Grid2 size={{ lg: 12 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Justificación</CustomFormLabel>
                <CustomTextField
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDescription(e.target.value);
                    if (errors.description) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.description;
                        return newErrors;
                      });
                    }
                  }}
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.description}
                />
                <CustomLabelError field={errors.description} />
              </FormControl>
            </Grid2>

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
                    {selectedDates.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        {selectedDates.length} días seleccionados
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
                  {selectedDates.length > 0 ? (
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
                        {getMonthsBetween(
                          startDate?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
                          endDate?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
                        ).map(({ year, month }) => (
                          <MiniMonthCalendar
                            key={`${year}-${month}`}
                            year={year}
                            month={month}
                            selectedDates={selectedDates}
                            onToggleDate={shouldDisplayCalendarDates ? toggleIncidentDate : undefined}
                          />
                        ))}
                      </Box>
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

                {selectedDates.length > 0 && shouldDisplayCalendarDates && (
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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Seleccionar empleados</Typography>
                <Box>
                  <Chip
                    label={`${selectedEmployees.length} de ${employees.length} empleados seleccionados`}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip label={`${conflictedEmployees.length} con conflictos`} color="error" size="small" />
                </Box>
              </Box>

              {employees.length > 0 && (
                <Box mb={2}>
                  <Button
                    onClick={() => handleSelectAll(true)}
                    disabled={selectableEmployees.length === 0}
                    sx={{ mr: 1 }}
                  >
                    Seleccionar todos
                  </Button>
                  <Button onClick={() => handleSelectAll(false)}>Deseleccionar todos</Button>
                </Box>
              )}

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          indeterminate={
                            selectedEmployees.length > 0 && selectedEmployees.length < selectableEmployees.length
                          }
                          checked={
                            selectableEmployees.length > 0 && selectedEmployees.length === selectableEmployees.length
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>Empleado</TableCell>
                      <TableCell>Número de empleado</TableCell>
                      <TableCell>Tipo de asistencia</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employees.map((employee) => {
                      const isSelectable = !employee.hasConflict;
                      const isSelected = selectedEmployees.includes(employee.id);

                      return (
                        <TableRow
                          key={employee.id}
                          sx={{
                            opacity: isSelectable ? 1 : 0.5,
                            backgroundColor: !isSelectable ? "#f5f5f5" : "inherit",
                          }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              disabled={!isSelectable}
                              onChange={(e) => handleEmployeeSelect(employee.id, e.target.checked)}
                            />
                          </TableCell>
                          <TableCell>{employee.full_name}</TableCell>
                          <TableCell>{employee.numberEmployee}</TableCell>
                          <TableCell>{employee.attendance_type_display_name}</TableCell>
                          <TableCell>
                            {isSelectable ? (
                              <Chip label="Disponible" color="success" size="small" />
                            ) : (
                              <Chip label="Con conflicto" color="error" size="small" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid2>

            <Grid2 size={12}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
            </Grid2>

            <Grid2 size={12}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" color="error" onClick={() => window.history.back()}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || selectedEmployees.length === 0}
                >
                  {loading ? "Procesando..." : "Crear incidencias"}
                </Button>
              </Stack>
            </Grid2>
          </Grid2>
        </form>
      </Box>

      <Dialog fullWidth maxWidth="xl" open={openCalendar} onClose={handleCalendarCancel} disableEscapeKeyDown>
        <DialogTitle>Seleccionar fechas de incidencia</DialogTitle>
        <DialogContent>
          {selectedDireccion && (
            <CustomCalendar
              key={selectedIncidentType}
              onSave={handleCalendarSave}
              onCancel={handleCalendarCancel}
              daysSelected={selectedDates}
            />
          )}
        </DialogContent>
      </Dialog>
    </ParentCard>
  );
};

export default BulkCreateIncidentsForm;
