"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { createEmployeeHiring } from "@/services/employees-hiring";
import { fetchDireccionesData } from "@/services/catalogs";

const CreateContractModal = ({
  open,
  employeeData,
  categories = [],
  employeeTypes = [],
  secretarias = [],
  onClose,
  onSuccess,
}: any) => {
  const [startJobDate, setStartJobDate] = React.useState("");
  const [endJobDate, setEndJobDate] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [employeeTypeId, setEmployeeTypeId] = React.useState("");
  const [secretariaId, setSecretariaId] = React.useState("");
  const [direcciones, setDirecciones] = React.useState<any[]>([]);
  const [direccionId, setDireccionId] = React.useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fullName =
    `${employeeData?.name || ""} ${employeeData?.paternal_last_name || ""} ${employeeData?.maternal_last_name || ""}`.trim();

  React.useEffect(() => {
    if (!open) {
      setStartJobDate("");
      setEndJobDate("");
      setCategoryId("");
      setEmployeeTypeId("");
      setSecretariaId("");
      setDirecciones([]);
      setDireccionId("");
      setOpenConfirmDialog(false);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSecretariaChange = async (value: string) => {
    setSecretariaId(value);
    setDireccionId("");

    const response = await fetchDireccionesData(value);

    if (response.success) {
      setDirecciones(response.responseObject || []);
    } else {
      setDirecciones([]);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);

      const response = await createEmployeeHiring({
        employeeId: employeeData.id,
        startJobDate,
        endJobDate: endJobDate || null,
        categoryId: Number(categoryId),
        employeeTypeId: Number(employeeTypeId),
        direccionId: Number(direccionId),
      });

      if (!response.success) {
        console.error(response.message);
        return;
      }

      setOpenConfirmDialog(false);
      onClose?.();
      onSuccess?.();
    } catch (err) {
      console.error("Error inesperado", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    !!employeeData?.id && !!startJobDate && !!categoryId && !!employeeTypeId && !!secretariaId && !!direccionId;

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
        <DialogTitle>Nuevo contrato</DialogTitle>

        <DialogContent>
          <Grid2 container spacing={2} mt={0.5}>
            <Grid2 size={{ xs: 12, md: 12 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Empleado
              </Typography>
              <TextField fullWidth value={fullName} disabled />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Fecha de alta
              </Typography>
              <TextField
                type="date"
                id="startJobDate"
                name="startJobDate"
                fullWidth
                value={startJobDate}
                onChange={(e) => setStartJobDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Fecha de baja
              </Typography>
              <TextField
                type="date"
                id="endJobDate"
                name="endJobDate"
                fullWidth
                value={endJobDate}
                onChange={(e) => setEndJobDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Categoría
              </Typography>
              <TextField
                select
                id="categoryId"
                name="categoryId"
                fullWidth
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.display_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Tipo de empleado
              </Typography>
              <TextField
                select
                id="employeeTypeId"
                name="employeeTypeId"
                fullWidth
                value={employeeTypeId}
                onChange={(e) => setEmployeeTypeId(e.target.value)}
              >
                {employeeTypes.map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.display_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Secretaría
              </Typography>
              <TextField select fullWidth value={secretariaId} onChange={(e) => handleSecretariaChange(e.target.value)}>
                {secretarias.map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.display_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Dirección inicial
              </Typography>
              <TextField
                select
                fullWidth
                value={direccionId}
                onChange={(e) => setDireccionId(e.target.value)}
                disabled={!secretariaId}
              >
                {direcciones.map((item: any) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.display_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>
          </Grid2>
        </DialogContent>

        <DialogActions>
          <Button color="error" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={() => setOpenConfirmDialog(true)}
            color="primary"
            variant="contained"
            disabled={!canSubmit || isSubmitting}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirmar acción</DialogTitle>

        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas crear un nuevo contrato para <b>{fullName}</b>?
          </Typography>

          <Typography mt={2} fontWeight={600}>
            Fecha de alta: {startJobDate || "No definida"}
          </Typography>
          <Typography fontWeight={600}>Fecha de baja: {endJobDate || "Vigente"}</Typography>
        </DialogContent>

        <DialogActions>
          <Button color="error" onClick={() => setOpenConfirmDialog(false)} disabled={isSubmitting}>
            Cancelar
          </Button>

          <Button color="primary" onClick={handleConfirm} disabled={isSubmitting}>
            Sí, crear contrato
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateContractModal;
