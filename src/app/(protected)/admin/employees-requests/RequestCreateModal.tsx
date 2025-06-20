"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Box,
  FormControl,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchCatalogData } from "@/services/catalogs";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import ScheduleForm from "./create/form-requests/schedule/page";
import AttendanceTypeForm from "./create/form-requests/attendance-type/page";
import LocationForm from "./create/form-requests/location/page";
import FingerprintForm from "./create/form-requests/fingerprint/page";
import {
  updateFormData,
  setEmployeeData,
  resetForm,
  setErrors,
  clearErrors,
} from "@/store/employees-requests/CreateEmployeeRequest";
import type { RootState } from "@/store/store";
import { getEmployeeJobSchedule } from "@/services/employees";
import type { JobScheduleEmployee } from "@/app/api/interfaces/JobScheduleEmployee";
import type { HttpResponse } from "@/app/api/interfaces/HttpResponse";
import { setSelectedEmployee, setJobSchedule } from "@/store/slices/employeeRequestSlice";
import type { AppDispatch } from "@/store/store";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import CustomTextField from "@/components/theme-elements/CustomTextField";
import { createEmployeeRequest } from "@/services/employees-requests";
import REQUEST_TYPES from "@/common/constants/RequestTypes";
import { useRouter } from "next/navigation";
import MenuItem from "@mui/material/MenuItem";
import { RequestCreateModalProps } from "@/app/api/employee-requests/types";
import { getEmployeeById } from "@/services/employees";
import { EmployeeDetailCard } from "@/components/shared/EmployeeDetailCard";

export const RequestCreateModal = ({ open, onClose, employeeId, onSuccess }: RequestCreateModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { formData, currentJobSchedule, errors } = useSelector((state: RootState) => state.createEmployeeRequest);
  const [responseMessage, setResponseMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);

  const catalogName = "requests";
  const fetchData = useCallback(() => fetchCatalogData(catalogName), []);
  const { options: requestsTypes, isLoading, error } = useFetchOptions(fetchData);

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
        updateFormData({ field: "adscriptionForm", value: { attendanceType: "", locationId: "", direccionId: "" } }),
      );
    }
    dispatch(updateFormData({ field: name, value }));
  };

  const fetchEmployeeData = useCallback(async () => {
    const response = await getEmployeeById(employeeId as string);
    if (!response.success || !response.responseObject) return;

    const employeeData = response.responseObject;
    const employee = {
      id: employeeData.id,
      label: `${employeeData.name} ${employeeData.paternal_last_name} ${employeeData.maternal_last_name} - ${employeeData.number_employee}`,
      number_employee: employeeData.number_employee,
      birthday: employeeData.birthday,
      rfc: employeeData.rfc,
      curp: employeeData.curp,
      direccion_display_name: employeeData.employee_hiring[0]?.direccion?.display_name,
      secretaria_display_name: employeeData.employee_hiring[0]?.direccion?.secretaria?.display_name,
      category_display_name: employeeData.employee_hiring[0]?.category?.display_name,
      employee_type_display_name: employeeData.employee_hiring[0]?.employee_type?.display_name,
      trade_union_display_name: employeeData.employee_trade_union[0]?.trade_union?.display_name,
      location_display_name: employeeData.employee_location[0]?.location?.display_name,
      attendance_type_display_name: employeeData.employee_attendance_type[0]?.attendance?.display_name,
    };

    dispatch(resetForm());
    dispatch(setSelectedEmployee(employeeData));
    dispatch(setEmployeeData(employee));
    setCurrentEmployee(employee);

    if (employee?.id) {
      try {
        dispatch(updateFormData({ field: "employeeId", value: employee.id.toString() }));
        const response = (await getEmployeeJobSchedule(employee.id)) as HttpResponse<JobScheduleEmployee>;
        if (response?.success && response.responseObject) {
          dispatch(setJobSchedule(response.responseObject));
        }
      } catch (error) {
        console.error("Error fetching employee job schedule:", error);
        dispatch(setErrors({ jobSchedule: "Error al obtener el horario del empleado" }));
      }
    } else {
      dispatch(updateFormData({ field: "employeeId", value: "" }));
    }
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (open && employeeId) {
      fetchEmployeeData();
    } else {
      dispatch(resetForm());
    }
  }, [open, employeeId, fetchEmployeeData, dispatch]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    dispatch(clearErrors());

    try {
      const response = await createEmployeeRequest({
        ...formData,
        employeeId: parseInt(employeeId as string),
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
      setResponseMessage(response.message);
      dispatch(resetForm());

      setTimeout(() => {
        onSuccess?.();
        setResponseMessage("");
        onClose();
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error("Error creating request:", err);
      setResponseMessage("Ocurrió un error al crear la solicitud. Por favor intente nuevamente.");
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

  const handleClose = () => {
    if (isSubmitting) return;
    dispatch(resetForm());
    setResponseMessage("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handlePreventClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="request-create-dialog-title"
    >
      <DialogTitle
        id="request-create-dialog-title"
        sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h5" component="span">
          Nueva Solicitud
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <EmployeeDetailCard employee={currentEmployee} />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <CustomFormLabel>Descripción</CustomFormLabel>
            <CustomTextField
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              disabled={isSubmitting}
            />
            <CustomLabelError field={errors.description} />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <CustomFormLabel>Tipo de solicitud</CustomFormLabel>
            <CustomSelect
              fullWidth
              name="typeRequestId"
              value={formData.typeRequestId || "0"}
              onChange={handleChange}
              disabled={isLoading || error || isSubmitting}
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
            <CustomLabelError field={errors.typeRequestId} />
          </FormControl>

          <Box sx={{ mt: 3, mb: 2 }}>
            {Number(formData.typeRequestId) === REQUEST_TYPES.SCHEDULE && (
              <ScheduleForm currentJobSchedule={currentJobSchedule} />
            )}
            {Number(formData.typeRequestId) === REQUEST_TYPES.LOCATION && <LocationForm />}
            {Number(formData.typeRequestId) === REQUEST_TYPES.ATTENDANCE && <AttendanceTypeForm />}
            {Number(formData.typeRequestId) === REQUEST_TYPES.FINGERPRINT && <FingerprintForm />}
          </Box>

          {responseMessage && (
            <Alert severity={isSuccess ? "success" : "error"} sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2">{responseMessage}</Typography>
            </Alert>
          )}
          {errors.jobSchedule && <CustomLabelError field={errors.jobSchedule} />}

          <DialogActions sx={{ px: 0, pb: 0 }}>
            <Button onClick={handleClose} disabled={isSubmitting} color="error" variant="outlined">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !formData.typeRequestId || formData.typeRequestId === "0"}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>

      <Dialog open={openDialog} onClose={handlePreventClose} maxWidth="sm">
        <DialogTitle>Confirmar</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Está seguro de crear esta solicitud?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color="primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default RequestCreateModal;
