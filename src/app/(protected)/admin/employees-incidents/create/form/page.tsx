"use client";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFormData,
  setEmployeeData,
  resetForm,
  setErrors,
  clearErrors,
} from "@/store/employees-incidents/EmployeesIncidentsSlice";
import ParentCard from "@/app/components/shared/ParentCard";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
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
import { fetchCatalogData } from "@/services/catalogs";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { createEmployeeIncident } from "@/services/employees-incidents";
import type { Employee } from "@/app/api/interfaces/Employee";
import { setSelectedEmployee } from "@/store/slices/employeeIncidentSlice";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import Link from "next/link";
import EmployeeFinder from "@/components/shared/EmployeeFinder";
import { AppDispatch, RootState } from "@/store/store";

const IncidentCreateForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { formData, errors } = useSelector((state: RootState) => state.createEmployeeIncident);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    dispatch(updateFormData({ field: name, value }));
  };

  const handleSelectEmployee = async (employee: Employee) => {
    dispatch(resetForm());
    dispatch(setSelectedEmployee(employee));
    dispatch(setEmployeeData(employee));
    if (employee?.id) {
      dispatch(updateFormData({ field: "employeeId", value: employee.id }));
    } else {
      dispatch(updateFormData({ field: "employeeId", value: "" }));
    }
  };

  const catalogName = "incidents";
  const fetchData = useCallback(() => fetchCatalogData(catalogName), [catalogName]);
  const { options: incidentTypes, isLoading, error } = useFetchOptions(fetchData);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    dispatch(clearErrors());
    try {
      const response = await createEmployeeIncident(formData);
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
        setTimeout(() => {
          window.location.href = "/admin/employees-incidents";
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
            <Grid2 size={{ lg: 12 }}>
              <EmployeeFinder onEmployeeSelect={handleSelectEmployee} error={errors.employeeId} />
            </Grid2>
            <Grid2 size={{ lg: 12 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Tipo de incidencia</CustomFormLabel>
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
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Fecha de inicio</CustomFormLabel>
                <CustomTextField
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />
                <CustomLabelError field={errors.startDate && errors.startDate} />
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Fecha de terminacion</CustomFormLabel>
                <CustomTextField
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />
                <CustomLabelError field={errors.endDate && errors.endDate} />
              </FormControl>
            </Grid2>
            <Grid2 size={{ lg: 12 }}>
              <FormControl fullWidth>
                <CustomFormLabel>Justificación</CustomFormLabel>
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
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  sx={{ display: "flex" }}
                >
                  Guardar
                </Button>
                <Link href={"/admin/employees-incidents"} passHref>
                  <Button variant="contained" color="error" sx={{ display: "flex" }}>
                    Salir
                  </Button>
                </Link>
              </Stack>
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
            <Button onClick={handleConfirm} color="primary" autoFocus disabled={isSubmitting}>
              Continuar
            </Button>
            <Button onClick={handleCancel} color="error" disabled={isSubmitting}>
              Cancelar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </ParentCard>
  );
};
export default IncidentCreateForm;
