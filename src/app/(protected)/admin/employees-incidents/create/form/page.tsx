"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  setEmployeeData,
  resetForm,
  setErrors,
  clearErrors,
  setIncidentDates,
} from "@/store/employees-incidents/EmployeesIncidentsSlice";
import ParentCard from "@/app/components/shared/ParentCard";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomCalendar from "@/components/customComponents/CustomCalendar";
import {
  Alert,
  Box,
  Button, Card,
  Chip,
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
import { fetchCatalogData } from "@/services/catalogs";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { createEmployeeIncident } from "@/services/employees-incidents";
import type { Employee } from "@/app/api/interfaces/Employee";
import { setSelectedEmployee } from "@/store/slices/employeeIncidentSlice";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import Link from "next/link";
import EmployeeFinder from "@/components/shared/EmployeeFinder";
import { AppDispatch, RootState } from "@/store/store";
import { formatDate } from "@/utils/formatter";
import { EmployeeDetailCard } from "@/components/shared/EmployeeDetailCard";

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
  const { formData, errors } = useSelector((state: RootState) => state.createEmployeeIncident);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);

  const submitting = externalSubmitting !== undefined ? externalSubmitting : isSubmitting;

  React.useEffect(() => {
    if (selectedEmployee && selectedEmployee.id) {
      dispatch(setSelectedEmployee(selectedEmployee));
      dispatch(setEmployeeData(selectedEmployee));
      dispatch(updateFormData({ field: "employeeId", value: selectedEmployee.id.toString() }));
    }
  }, [selectedEmployee, dispatch]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    dispatch(updateFormData({ field: name, value }));
    if (name === "employeeId" && value && value !== "0") {
      const newErrors = { ...errors };
      delete newErrors.employeeId;
      const filteredErrors = Object.fromEntries(
        Object.entries(newErrors).filter(([_, v]) => typeof v === "string" && v !== undefined),
      );
      dispatch(setErrors(filteredErrors as { [key: string]: string }));
    }

    if (name === "incidentId") {
      const isCalendarIncident = incidentTypes?.find((item) => item.id === value)?.display_calendar_dates;

      if (isCalendarIncident) {
        setOpenCalendar(true);
      }
    }

    if (name === "endDate") {
      const start = new Date(formData.startDate);
      const end = new Date(value);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
        const dates: string[] = [];
        const current = new Date(start);

        while (current <= end) {
          dates.push(current.toISOString().split("T")[0]);
          current.setDate(current.getDate() + 1);
        }
        dispatch(setIncidentDates(dates));
      } else {
        dispatch(setIncidentDates([]));
      }
    }
  };

  const handleSelectEmployee = async (employee: Employee) => {
    dispatch(setSelectedEmployee(employee));
    dispatch(setEmployeeData(employee));
    if (employee?.id) {
      dispatch(updateFormData({ field: "employeeId", value: employee.id.toString() }));
      const newErrors = { ...errors };
      delete newErrors.employeeId;
      const filteredErrors = Object.fromEntries(
        Object.entries(newErrors).filter(([_, v]) => typeof v === "string" && v !== undefined),
      );
      dispatch(setErrors(filteredErrors as { [key: string]: string }));
    } else {
      dispatch(updateFormData({ field: "employeeId", value: "" }));
    }
  };

  const catalogName = "incidents";
  const fetchData = useCallback(() => fetchCatalogData(catalogName), [catalogName]);
  const { options: incidentTypes, isLoading, error } = useFetchOptions(fetchData);

  const calendarIncidentIds = useMemo(() => {
    return incidentTypes?.filter((item) => item.display_calendar_dates === 1).map((item) => item.id) || [];
  }, [incidentTypes]);

  const isVacationIncident = useMemo(() => {
    return calendarIncidentIds.includes(formData.incidentId);
  }, [formData.incidentId, calendarIncidentIds]);

  const handleCalendarSave = (selectedDates: string[]) => {
    if (selectedDates.length > 0) {
      const startDate = selectedDates[0];
      const endDate = selectedDates[selectedDates.length - 1];

      dispatch(updateFormData({ field: "startDate", value: startDate }));
      dispatch(updateFormData({ field: "endDate", value: endDate }));
      dispatch(setIncidentDates(selectedDates));
    }
    setOpenCalendar(false);
  };

  const handleCalendarCancel = () => {
    setOpenCalendar(false);
  };

  const removeDates = () => {
    dispatch(updateFormData({ field: "startDate", value: "" }));
    dispatch(updateFormData({ field: "endDate", value: "" }));
    dispatch(updateFormData({ field: "incidentDates", value: [] }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    dispatch(clearErrors());

    try {
      const submitData = {
        ...formData,
        employeeId: Number(formData.employeeId),
        ...(isVacationIncident && { incidentDates: formData.incidentDates }),
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
        dispatch(resetForm());
        if (onSuccess) onSuccess();
        setTimeout(() => {
          if (onClose) onClose();
          if (!onClose) window.location.href = "/admin/employees-incidents";
        }, 3000);
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
                  disabled={isLoading || error}
                >
                  <MenuItem key="default" value="0">
                    Selecciona el tipo de incidencia
                  </MenuItem>
                  {isLoading ? (
                    <MenuItem disabled> Cargando...</MenuItem>
                  ) : error ? (
                    <MenuItem disabled>Error al cargar</MenuItem>
                  ) : (
                    incidentTypes?.map((incident) => (
                      <MenuItem key={incident.id} value={incident.id}>
                        {incident.display_name}
                      </MenuItem>
                    ))
                  )}
                </CustomSelect>
                <CustomLabelError field={errors.incidentId} />
              </FormControl>
            </Grid2>

            <Grid2 size={{ lg: 12 }}>
              <Card
                variant="outlined"
                elevation={0}
                sx={{
                  backgroundColor: (theme) => theme.palette.primary.light,
                  py: 0,
                  mt: 2,
                  p: 2,
                  position: "relative",
                }}>
                <Box
                  sx={{ display: "grid", alignItems: "center", justifyContent: "space-between", width: "100%" }}
                >
                  <Typography variant="subtitle2" fontWeight="600">
                    Dias permitidos:
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="600">
                    Dias usados:
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="600">
                    Dias restantes:
                  </Typography>
                </Box>
              </Card>
            </Grid2>

            <Dialog fullWidth maxWidth="lg" open={openCalendar} onClose={handleCalendarCancel} disableEscapeKeyDown>
              <DialogTitle>Seleccionar fechas de incidencia</DialogTitle>
              <DialogContent>
                <CustomCalendar
                  onSave={handleCalendarSave}
                  onCancel={handleCalendarCancel}
                  maxSelections={20}
                  daysSelected={formData.incidentDates}
                />
              </DialogContent>
            </Dialog>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Fecha de inicio</CustomFormLabel>
                <CustomTextField
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  disabled={isVacationIncident}
                />
                <CustomLabelError field={errors.startDate} />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ mt: 1 }}>Fecha de terminación</CustomFormLabel>
                <CustomTextField
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  disabled={isVacationIncident}
                />
                <CustomLabelError field={errors.endDate && errors.endDate} />
              </FormControl>
            </Grid2>

            {isVacationIncident && (
              <Grid2 size={{ lg: 12 }}>
                <FormControl fullWidth>
                  <CustomFormLabel sx={{ mt: 1 }}>Fechas de incidencia</CustomFormLabel>
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
                        {formData.incidentDates.map((date, index) => (
                          <Chip
                            key={index}
                            label={formatDate(date, "dd/MM/yyyy")}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        ))}
                        <Stack
                          justifyContent="space-between"
                          direction="row"
                          alignItems="center"
                          my={2}
                          sx={{ ml: "auto" }}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setOpenCalendar(true)}
                            sx={{ ml: "auto", mr: 2 }}
                          >
                            Modificar fechas
                          </Button>
                          <Button variant="outlined" color="warning" size="small" onClick={removeDates}>
                            Quitar fechas
                          </Button>
                        </Stack>
                      </>
                    ) : (
                      <Box
                        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          No se han seleccionado fechas de incidencia
                        </Typography>
                        <Button variant="outlined" size="small" onClick={() => setOpenCalendar(true)}>
                          Seleccionar fechas
                        </Button>
                      </Box>
                    )}
                  </Box>
                </FormControl>
              </Grid2>
            )}

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
    </ParentCard>
  );
};
export default IncidentCreateForm;
