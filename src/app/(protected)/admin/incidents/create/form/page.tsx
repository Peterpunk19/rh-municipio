"use client";
import React, { use, useState, useEffect } from "react";
import ParentCard from "@/app/components/shared/ParentCard";
import CustomTextField from "@/app/components/forms/theme-elements/CustomTextField";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { useDebouncedCallback } from "use-debounce";
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
  TextField, 
  Autocomplete, 
  Paper, 
  CircularProgress,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { fetchIncidentTypesData } from "@/services/catalogs";
import { getEmployeeById } from "@/services/employees";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { createIncident } from "@/services/incidents";
import { FormErrors, initialFormData } from "./dataConfig";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import Link from "next/link";
const IncidentCreateForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [employees, setEmployees] = useState<{ id: number; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Debounced function to fetch API data
  const fetchOptions = useDebouncedCallback(async (query: string) => {
    if (!query) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/employees/autocomplete?search=${query}`);
      const data = await response.json();
      console.log(data.responseObject)
      setEmployees(data.responseObject);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, 800); // Debounce delay (800ms)

  // Trigger debounced API call when input changes
  useEffect(() => {
    fetchOptions(inputValue);
  }, [inputValue, fetchOptions]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", 
    }));
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectEmployee = async (_: any, newValue: { id: string; label: string } | null) => {
    if (newValue) {
      try {
        const employeeData = await getEmployeeById(newValue.id);
        setSelectedEmployee(employeeData.responseObject);
        setFormData((prevFormData) => ({
            ...prevFormData,
            employeeId: newValue.id,
        }));
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setSelectedEmployee(null);
      }
    } else {
      setSelectedEmployee(null);
      setFormData((prevFormData) => ({
        ...prevFormData,
        employeeId: "0",
      }));
    }
  };

  const { options: incidentTypes, isLoading, error } = useFetchOptions(fetchIncidentTypesData);

  const resetFormValues = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const response = await createIncident(formData);
      if (!response.success) {
        if (response && response.responseObject) {
          const newErrors: FormErrors = {};
          for (const key in response.responseObject) {
            if (response.responseObject[key].messages && response.responseObject[key].messages.length > 0) {
              newErrors[key] = response.responseObject[key].messages[0];
            }
          }
          setErrors(newErrors);
          setResponseMessage(response.message);
          setIsSuccess(false);
        } else {
          throw new Error("Failed to submit form. Please try again.");
        }
        console.log(errors);
        return;
      } else {
        setIsSuccess(true);
        setResponseMessage(response.message);
        resetFormValues();
        setTimeout(() => {
          window.location.href = "/admin/incidents";
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
              <FormControl fullWidth>
                <CustomFormLabel>Empleado</CustomFormLabel>
                <Autocomplete
                    freeSolo
                    options={employees}
                    getOptionLabel={(employee) => employee.label}
                    inputValue={inputValue}
                    onInputChange={(_, value) => setInputValue(value)}
                    onChange={handleSelectEmployee}
                    loading={loading}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Ingresa RFC, CURP, Nombre o Número de empleado"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: loading ? <CircularProgress color="inherit" size={20} /> : null,
                        }}
                        />
                    )}
                    renderOption={(props, employee) => (
                        <MenuItem {...props} key={employee.id}>
                        {employee.label}
                        </MenuItem>
                    )}
                    PaperComponent={(props) => <Paper {...props} elevation={3} />}
                    />
                <CustomLabelError field={errors.employeeId && errors.employeeId} />
              </FormControl>
            </Grid2>
            {selectedEmployee && (
                <>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                        <CustomFormLabel>Número de Empleado</CustomFormLabel>
                        <CustomTextField
                            value={selectedEmployee.number_employee}
                            variant="outlined"
                            fullWidth
                            disabled
                        />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                        <CustomFormLabel>Nombre</CustomFormLabel>
                        <CustomTextField
                            value={`${selectedEmployee.name} ${selectedEmployee.paternal_last_name} ${selectedEmployee.maternal_last_name}`}
                            variant="outlined"
                            fullWidth
                            disabled
                        />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                        <CustomFormLabel>RFC</CustomFormLabel>
                        <CustomTextField
                            value={selectedEmployee.rfc}
                            variant="outlined"
                            fullWidth
                            disabled
                        />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                        <CustomFormLabel>CURP</CustomFormLabel>
                        <CustomTextField
                            value={selectedEmployee.curp}
                            variant="outlined"
                            fullWidth
                            disabled
                        />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                        <CustomFormLabel>Organismo público</CustomFormLabel>
                        <CustomTextField
                            value={selectedEmployee.employee_hiring?.[0]?.direccion?.secretaria?.display_name}
                            variant="outlined"
                            fullWidth
                            disabled
                        />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                        <CustomFormLabel>Organismo administrativo</CustomFormLabel>
                        <CustomTextField
                            value={selectedEmployee.employee_hiring?.[0]?.direccion?.display_name}
                            variant="outlined"
                            fullWidth
                            disabled
                        />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                        <CustomFormLabel>Sindicato</CustomFormLabel>
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                        <CustomFormLabel>Tipo de empleado</CustomFormLabel>
                        <CustomTextField
                            value={selectedEmployee.employee_hiring?.[0]?.employe_type?.display_name}
                            variant="outlined"
                            fullWidth
                            disabled
                        />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                        <CustomFormLabel>Categoría</CustomFormLabel>
                        <CustomTextField
                            value={selectedEmployee.employee_hiring?.[0]?.category?.display_name}
                            variant="outlined"
                            fullWidth
                            disabled
                        />
                        </FormControl>
                    </Grid2>
                </>
            )}
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
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} sx={{ display: "flex" }}>
                  Guardar
                </Button>
                <Link href={"/admin/incidents"} passHref>
                  <Button variant="contained" color="error" sx={{ display: "flex" }}>
                    Salir
                  </Button>
                </Link>
              </Stack>
            </Grid2>
            <Grid2 size={12}>
              {responseMessage && (
                <Alert severity={isSuccess ? "success" : "error"}>
                  <Typography variant="body1" fontWeight={600}>{responseMessage}</Typography>
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
