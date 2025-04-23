"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
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
  Stack,
  Typography,
} from "@mui/material";
import EmployeeFinder from "@/components/shared/EmployeeFinder";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomTextField from "@/components/theme-elements/CustomTextField";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import ParentCard from "@/app/components/shared/ParentCard";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import {
  clearErrors,
  resetForm,
  setEmployeeData,
  setErrors,
  updateFormData,
} from "@/store/employees-attendances/CreateEmployeeAttendance";
import type { Employee } from "@/app/api/interfaces/Employee";
import { setSelectedEmployee } from "@/store/slices/employeeAttendanceSlice";
import { createEmployeeAttendance } from "@/services/employees-attendances";
import CircularProgress from "@mui/material/CircularProgress";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";

const BCrumb = [
  {
    to: "/admin/employees-attendances",
    title: "Listado de asistencias",
  },
  {
    title: "Crear asistencia manual",
  },
];

const CreateEmployee = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { formData, errors } = useSelector((state: RootState) => state.createEmployeeAttendance);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(updateFormData({ field: name, value }));
  };

  const handleChangeDateTime = (name: any, value: any) => {
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

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    dispatch(clearErrors());
    try {
      const response = await createEmployeeAttendance(formData);

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
      setResponseMessage(response.message);
      dispatch(resetForm());
      setTimeout(() => {
        router.push("/admin/employees-attendances");
      }, 3000);
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
    <PageContainer title="Crear asistencia manual">
      <Breadcrumb title="Crear asistencia manual" items={BCrumb} />
      <ParentCard title="Ingrese los datos de la asistencia">
        <Box>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ lg: 12 }}>
                <EmployeeFinder onEmployeeSelect={handleSelectEmployee} error={errors.employeeId} />
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <CustomFormLabel>Fecha de inicio</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      slotProps={{
                        textField: {
                          fullWidth: true,

                          sx: {
                            "& .MuiSvgIcon-root": {
                              width: "18px",
                              height: "18px",
                            },
                            "& .MuiFormHelperText-root": {
                              display: "none",
                            },
                          },
                        },
                      }}
                      value={formData.checkIn || null}
                      onChange={(newValue) => {
                        handleChangeDateTime("checkIn", newValue);
                      }}
                    />
                  </LocalizationProvider>
                  <CustomLabelError field={errors.checkIn} />
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <CustomFormLabel>Fecha de terminacion</CustomFormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      slotProps={{
                        textField: {
                          fullWidth: true,

                          sx: {
                            "& .MuiSvgIcon-root": {
                              width: "18px",
                              height: "18px",
                            },
                            "& .MuiFormHelperText-root": {
                              display: "none",
                            },
                          },
                        },
                      }}
                      value={formData.checkOut || null}
                      onChange={(newValue) => {
                        handleChangeDateTime("checkOut", newValue);
                      }}
                    />
                  </LocalizationProvider>
                  <CustomLabelError field={errors.checkOut} />
                </FormControl>
              </Grid2>

              <Grid2 size={{ lg: 12 }}>
                <FormControl fullWidth>
                  <CustomFormLabel>Descripción</CustomFormLabel>
                  <CustomTextField
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    fullWidth
                  />
                  <CustomLabelError field={errors.description} />
                </FormControl>
              </Grid2>

              <Grid2 size={12} sx={{ mt: 2 }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Link href={"/admin/employees-attendances"} passHref>
                    <Button variant="contained" color="error" sx={{ display: "flex" }}>
                      Salir
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{ display: "flex" }}
                    startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                  </Button>
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
              {"Creación de nueva asistencia manual"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">¿Desea continuar?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={handleCancel} color="error" disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button onClick={handleConfirm} color="primary" autoFocus disabled={isSubmitting}>
                Continuar
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </ParentCard>
    </PageContainer>
  );
};

export default CreateEmployee;
