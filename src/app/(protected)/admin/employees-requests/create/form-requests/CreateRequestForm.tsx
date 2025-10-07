"use client";
import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ParentCard from "@/app/components/shared/ParentCard";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import {
  Alert,
  Box,
  Button,
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
import Link from "next/link";
import EmployeeFinder from "@/components/shared/EmployeeFinder";
import ScheduleForm from "./schedule/ScheduleForm";
import AttendanceTypeForm from "./attendance-type/page";
import LocationForm from "./location/page";
import FingerprintForm from "./fingerprint/page";
import {
  updateFormData,
  setEmployeeData,
  resetForm,
  setErrors,
  clearErrors,
  setCurrentJobSchedule,
} from "@/store/employees-requests/CreateEmployeeRequest";
import type { RootState } from "@/store/store";
import { getEmployeeJobSchedule } from "@/services/employees";
import type { Employee } from "@/app/api/interfaces/Employee";
import type { JobScheduleEmployee } from "@/app/api/interfaces/JobScheduleEmployee";
import type { HttpResponse } from "@/app/api/interfaces/HttpResponse";
import { setSelectedEmployee } from "@/store/slices/employeeRequestSlice";
import type { AppDispatch } from "@/store/store";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import CustomTextField from "@/components/theme-elements/CustomTextField";
import { createEmployeeRequest } from "@/services/employees-requests";
import REQUEST_TYPES from "@/common/constants/RequestTypes";
import AdscriptionForm from "@/app/(protected)/admin/employees-requests/create/form-requests/adscription/page";
import { EmployeeDetailCard } from "@/components/shared/EmployeeDetailCard";

type CreateRequestFormProps = {
  selectedEmployee?: Employee;
  onSuccess?: () => void;
  onClose?: () => void;
  isSubmitting?: boolean;
};

const CreateRequestForm = ({
  selectedEmployee,
  onSuccess,
  onClose,
  isSubmitting: externalSubmitting,
}: CreateRequestFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { formData, currentJobSchedule, errors } = useSelector((state: RootState) => state.createEmployeeRequest);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const submitting = externalSubmitting !== undefined ? externalSubmitting : isSubmitting;

  React.useEffect(() => {
    if (selectedEmployee && selectedEmployee.id) {
      dispatch(resetForm());
      dispatch(setSelectedEmployee(selectedEmployee));
      dispatch(setEmployeeData(selectedEmployee));
      dispatch(updateFormData({ field: "employeeId", value: selectedEmployee.id.toString() }));
    }
  }, [selectedEmployee, dispatch]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "typeRequestId") {
      dispatch(updateFormData({ field: "fingerprintForm", value: { locationId: 0, requestDate: "" } }));
      dispatch(updateFormData({ field: "scheduleForm", value: { schedules: [], startDate: "", endDate: "" } }));
      dispatch(
        updateFormData({
          field: "locationForm",
          value: { currentLocationId: 0, newLocationId: 0, startDate: "", endDate: "" },
        }),
      );
      dispatch(updateFormData({ field: "attendanceTypeForm", value: { attendanceType: "", applicationDate: "" } }));
      dispatch(
        updateFormData({
          field: "adscriptionForm",
          value: { secretariaId: 0, attendanceType: "", locationId: 0, direccionId: 0, startDate: "" },
        }),
      );
    }
    dispatch(updateFormData({ field: name, value }));
  };

  const handleSelectEmployee = async (employee: Employee) => {
    if (selectedEmployee) return;
    dispatch(resetForm());
    dispatch(setSelectedEmployee(employee));
    dispatch(setEmployeeData(employee));

    if (employee?.id) {
      try {
        dispatch(updateFormData({ field: "employeeId", value: employee.id.toString() }));
        const response = (await getEmployeeJobSchedule(employee.id)) as HttpResponse<JobScheduleEmployee>;
        if (response?.success && response.responseObject) {
          dispatch(setCurrentJobSchedule(response.responseObject));
        }
      } catch (error: any) {
        dispatch(setErrors({ jobSchedule: "Error al obtener el horario del empleado" }));
      }
    } else {
      dispatch(updateFormData({ field: "employeeId", value: "" }));
    }
  };

  const catalogName = "requests/permission-validation";
  const fetchData = useCallback(() => fetchCatalogData(catalogName), []);
  const { options: requestsTypes, isLoading, error } = useFetchOptions(fetchData);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    if (!selectedEmployee) setIsSubmitting(true);
    dispatch(clearErrors());
    try {
      const response = await createEmployeeRequest(formData);

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
      if (onSuccess) onSuccess();
      setTimeout(() => {
        if (onClose) onClose();
        if (!onClose) window.location.href = "/admin/employees-requests";
      }, 3000);
    } catch (err) {
      setResponseMessage("Hubo un error inesperado.");
    } finally {
      if (!selectedEmployee) setIsSubmitting(false);
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
    <ParentCard title="Ingrese los datos de la solicitud">
      <Box>
        {selectedEmployee && (
          <EmployeeDetailCard
            employee={{
              label: (selectedEmployee as any).label || "",
              number_employee: selectedEmployee.number_employee || "",
              birthday: selectedEmployee.birthday ? String(selectedEmployee.birthday) : "",
              rfc: selectedEmployee.rfc || "",
              curp: selectedEmployee.curp || "",
              direccion_display_name: (selectedEmployee as any).direccion_display_name || "",
              secretaria_display_name: (selectedEmployee as any).secretaria_display_name || "",
              category_display_name: (selectedEmployee as any).category_display_name || "",
              employee_type_display_name: (selectedEmployee as any).employee_type_display_name || "",
              trade_union_display_name: (selectedEmployee as any).trade_union_display_name || "",
              location_display_name:
                selectedEmployee.location_display_name || (selectedEmployee as any).location_display_name || "",
              attendance_type_display_name: (selectedEmployee as any).attendance_type_display_name || "",
            }}
          />
        )}
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            {!selectedEmployee && (
              <Grid2 size={{ lg: 12 }}>
                <EmployeeFinder onEmployeeSelect={handleSelectEmployee} error={errors.employeeId} />
              </Grid2>
            )}

            <Grid2 size={{ lg: 12 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ m: 0, p: 0 }}>Tipo de solicitud</CustomFormLabel>

                {formData.typeRequestId === "0" ? (
                  <CustomSelect
                    fullWidth
                    name="typeRequestId"
                    value={formData.typeRequestId}
                    onChange={handleChange}
                    disabled={isLoading || error || formData.employeeId === "" || formData.employeeId === "0"}
                  >
                    <MenuItem key="default" value="0">
                      Selecciona el tipo de solicitud
                    </MenuItem>
                    {isLoading ? (
                      <MenuItem disabled> Cargando...</MenuItem>
                    ) : error ? (
                      <MenuItem disabled>Error al cargar</MenuItem>
                    ) : (
                      requestsTypes?.map((requestType) => (
                        <MenuItem key={requestType.id} value={requestType.id}>
                          {requestType.display_name}
                        </MenuItem>
                      ))
                    )}
                  </CustomSelect>
                ) : (
                  <Chip
                    sx={{
                      mt: 1,
                      fontSize: 16,
                    }}
                    label={
                      requestsTypes.find((rt) => rt.id === formData.typeRequestId)?.display_name ?? "Tipo desconocido"
                    }
                    color="primary"
                    onDelete={() => dispatch(updateFormData({ field: "typeRequestId", value: "0" }))}
                  />
                )}
                <CustomLabelError field={errors.requestId} />
              </FormControl>
            </Grid2>

            {formData.typeRequestId ? (
              <Grid2 size={{ xs: 12, md: 12 }}>
                {Number(formData.typeRequestId) === REQUEST_TYPES.SCHEDULE && (
                  <ScheduleForm currentJobSchedule={currentJobSchedule} />
                )}
                {Number(formData.typeRequestId) === REQUEST_TYPES.LOCATION && <LocationForm />}
                {Number(formData.typeRequestId) === REQUEST_TYPES.ATTENDANCE && <AttendanceTypeForm />}
                {Number(formData.typeRequestId) === REQUEST_TYPES.FINGERPRINT && <FingerprintForm />}
                {Number(formData.typeRequestId) === REQUEST_TYPES.ADSCRIPTION && <AdscriptionForm />}
              </Grid2>
            ) : null}

            <Grid2 size={{ lg: 12 }}>
              <FormControl fullWidth>
                <CustomFormLabel sx={{ m: 0, p: 0 }}>Justificación</CustomFormLabel>
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
                {onClose ? (
                  <Button variant="contained" color="error" sx={{ display: "flex" }} onClick={onClose}>
                    Cancelar
                  </Button>
                ) : (
                  <Link href={"/admin/employees-requests"} passHref>
                    <Button variant="contained" color="error" sx={{ display: "flex" }}>
                      Salir
                    </Button>
                  </Link>
                )}
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
            <Grid2 size={12}>
              {responseMessage && (
                <Alert severity={isSuccess ? "success" : "error"}>
                  <Typography variant="body1" fontWeight={600}>
                    {responseMessage}
                  </Typography>
                </Alert>
              )}
            </Grid2>
            {errors.jobSchedule && (
              <Grid2 size={12}>
                <CustomLabelError field={errors.jobSchedule} />
              </Grid2>
            )}
          </Grid2>
        </form>
      </Box>

      <Dialog open={openDialog} onClose={handlePreventClose} maxWidth="sm" disableEscapeKeyDown>
        <Box sx={{ p: 3 }}>
          <DialogTitle id="alert-dialog-title" variant="h5">
            {"Creación de nueva solicitud"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">¿Desea continuar?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={handleCancel} color="error" disabled={submitting}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} color="primary" autoFocus disabled={submitting}>
              Continuar
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </ParentCard>
  );
};

export default CreateRequestForm;
