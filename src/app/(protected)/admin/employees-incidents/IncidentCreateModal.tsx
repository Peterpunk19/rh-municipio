"use client";

import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Box,
  TextField,
  FormControl,
  MenuItem,
  Typography,
  Alert,
  Stack,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RootState, AppDispatch } from "@/store/store";
import { createEmployeeIncident } from "@/services/employees-incidents";
import { updateFormData, resetForm, clearErrors, setErrors } from "@/store/employees-incidents/EmployeesIncidentsSlice";
import { useRouter } from "next/navigation";
import { fetchCatalogData } from "@/services/catalogs";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import type { IncidentCreateModalProps } from "@/app/api/employee-incidents/types";

export const IncidentCreateModal = ({ open, onClose, employeeId, onSuccess }: IncidentCreateModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { formData, errors } = useSelector((state: RootState) => state.createEmployeeIncident);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const catalogName = "incidents";
  const fetchData = useCallback(() => fetchCatalogData(catalogName), [catalogName]);
  const { options: incidentTypes, isLoading, error } = useFetchOptions(fetchData);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(updateFormData({ field: name, value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    dispatch(clearErrors());

    try {
      const employeeIdNumber = parseInt(employeeId as string);
      const response = await createEmployeeIncident({
        ...formData,
        employeeId: employeeIdNumber,
        createdBy: employeeIdNumber,
      });

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
      }

      setIsSuccess(true);
      setResponseMessage(response.message || "Incidencia creada exitosamente");
      dispatch(resetForm());

      setTimeout(() => {
        onSuccess?.();
        setResponseMessage("");
        onClose();
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Error creating incident:", error);
      setResponseMessage("Ocurrió un error al crear la incidencia. Por favor intente nuevamente.");
      setIsSuccess(false);
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
    <Dialog open={open} onClose={handlePreventClose} maxWidth="sm" fullWidth disableEscapeKeyDown={isSubmitting}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Crear nueva incidencia</Typography>
          <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close" disabled={isSubmitting}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {responseMessage && (
              <Alert severity={isSuccess ? "success" : "error"}>
                <Typography variant="body1" fontWeight={600}>
                  {responseMessage}
                </Typography>
              </Alert>
            )}

            <FormControl fullWidth error={!!errors.incidentId}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Tipo de incidencia <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                select
                fullWidth
                name="incidentId"
                value={formData.incidentId || ""}
                onChange={handleChange}
                variant="outlined"
                disabled={isLoading || isSubmitting}
                error={!!errors.incidentId}
                helperText={errors.incidentId}
              >
                <MenuItem value="">
                  <em>Selecciona el tipo de incidencia</em>
                </MenuItem>
                {isLoading ? (
                  <MenuItem disabled> Cargando...</MenuItem>
                ) : error ? (
                  <MenuItem disabled>Error al cargar</MenuItem>
                ) : (
                  incidentTypes?.map((incident: any) => (
                    <MenuItem key={incident.id} value={incident.id}>
                      {incident.display_name}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </FormControl>

            <Box display="flex" gap={2}>
              <FormControl fullWidth error={!!errors.startDate}>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Fecha de inicio <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  name="startDate"
                  type="date"
                  value={formData.startDate || ""}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  disabled={isSubmitting}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>

              <FormControl fullWidth error={!!errors.endDate}>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Fecha de terminación <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextField
                  name="endDate"
                  type="date"
                  value={formData.endDate || ""}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  disabled={isSubmitting}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: formData.startDate || undefined,
                  }}
                />
              </FormControl>
            </Box>

            <FormControl fullWidth error={!!errors.description}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Justificación <span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                disabled={isSubmitting}
                error={!!errors.description}
                helperText={errors.description}
                placeholder="Describe la razón de la incidencia..."
              />
            </FormControl>

            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button variant="outlined" color="error" onClick={onClose} disabled={isSubmitting} sx={{ minWidth: 120 }}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ minWidth: 120 }}
                startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <Dialog open={openDialog} onClose={handlePreventClose} maxWidth="sm" disableEscapeKeyDown>
        <Box sx={{ p: 3 }}>
          <DialogTitle id="alert-dialog-title" variant="h5">
            {"Creación de nueva incidencia"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Desea continuar con la creación de la incidencia?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="error" disabled={isSubmitting} variant="text">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              color="primary"
              autoFocus
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
            >
              {isSubmitting ? "Guardando..." : "Continuar"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Dialog>
  );
};

export default IncidentCreateModal;
