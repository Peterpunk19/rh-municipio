"use client";

import React from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid2, TextField, Typography } from "@mui/material";
import { createEmployeeHiringTerminate } from "@/services/employees-hiring";

const TerminateContractModal = ({ open, hiring, onClose, onSuccess }: any) => {
  const [terminationDate, setTerminationDate] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [comments, setComments] = React.useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);

  const handleConfirm = async () => {
    try {
      const response = await createEmployeeHiringTerminate({
        employeeHiringId: hiring.id,
        terminationDate,
        reason,
        comments,
      });

      if (!response.success) {
        console.error(response.message);
        return;
      }

      setOpenConfirmDialog(false);

      onClose();
      onSuccess?.();
    } catch (err) {
      console.error("Error inesperado", err);
    }
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>Terminar contrato</DialogTitle>

      <DialogContent>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Fecha de baja
            </Typography>
            <TextField
              type="date"
              id="terminationDate"
              name="terminationDate"
              fullWidth
              onChange={(e) => setTerminationDate(e.target.value)}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Motivo
            </Typography>
            <TextField id="reason" name="reason" onChange={(e) => setReason(e.target.value)} fullWidth />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Comentarios
            </Typography>
            <TextField id="comments" name="comments" onChange={(e) => setComments(e.target.value)} fullWidth />
          </Grid2>
        </Grid2>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => setOpenConfirmDialog(true)} color="error" disabled={!terminationDate}>
          Confirmar
        </Button>
      </DialogActions>

      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirmar acción</DialogTitle>

        <DialogContent>
          <Typography>¿Estás seguro de que deseas terminar este contrato ?</Typography>

          <Typography mt={2} fontWeight={600}>
            Fecha de baja: {terminationDate || "No definida"}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancelar</Button>

          <Button color="error" onClick={handleConfirm}>
            Sí, terminar contrato
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default TerminateContractModal;
