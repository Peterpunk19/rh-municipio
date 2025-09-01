"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateFormData, setEmployeeData, resetForm } from "@/store/employees-incidents/EmployeesIncidentsSlice";
import { setSelectedEmployee } from "@/store/slices/employeeIncidentSlice";
import type { AppDispatch } from "@/store/store";
import { IncidentCreateModalProps } from "@/app/api/employee-incidents/types";
import { getEmployeeById } from "@/services/employees";
import IncidentCreateForm from "./create/form/page";

export const IncidentCreateModal = ({ open, onClose, employeeId, onSuccess }: IncidentCreateModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);

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
      gender_id: employeeData.gender.id,
      gender_name: employeeData.gender.name,
      direccion_display_name: employeeData.employee_hiring?.[0]?.direccion?.display_name,
      secretaria_display_name: employeeData.employee_hiring?.[0]?.direccion?.secretaria?.display_name,
      category_display_name: employeeData.employee_hiring?.[0]?.category?.display_name,
      employee_type_display_name: employeeData.employee_hiring?.[0]?.employee_type?.display_name,
      trade_union_display_name: employeeData.employee_trade_union?.[0]?.trade_union?.display_name,
      location_display_name: employeeData.employee_location?.[0]?.location?.display_name,
      attendance_type_display_name: employeeData.employee_attendance_type?.[0]?.attendance?.display_name,
    };

    dispatch(resetForm());
    dispatch(setSelectedEmployee(employeeData));
    dispatch(setEmployeeData(employee));
    setCurrentEmployee(employee);

    if (employee?.id) {
      dispatch(updateFormData({ field: "employeeId", value: employee.id.toString() }));
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

  const handlePreventClose = (reason: string) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") {
      return;
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    dispatch(resetForm());
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handlePreventClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="incident-create-dialog-title"
    >
      <DialogTitle
        id="incident-create-dialog-title"
        sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h5" component="span">
          Nueva Incidencia
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
        <IncidentCreateForm
          selectedEmployee={currentEmployee}
          onSuccess={onSuccess}
          onClose={handleClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default IncidentCreateModal;
