"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { IconX, IconClock, IconTrash } from "@tabler/icons-react";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import { fetchHoursData } from "@/services/catalogs";

interface HourOption {
  id: string | number;
  name: string;
  display_name: string;
}

interface ApplyScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (startHourId: number, endHourId: number, startDisplay: string, endDisplay: string) => void;
  onDelete?: (date: string) => void;
  defaultStartHourId?: number;
  defaultEndHourId?: number;
  editingDate?: string | null;
  isEditMode?: boolean;
}

const ApplyScheduleModal = ({
  open,
  onClose,
  onConfirm,
  onDelete,
  defaultStartHourId = 0,
  defaultEndHourId = 0,
  editingDate,
  isEditMode = false,
}: ApplyScheduleModalProps) => {
  const [startHourId, setStartHourId] = useState<number>(defaultStartHourId);
  const [endHourId, setEndHourId] = useState<number>(defaultEndHourId);
  const [hours, setHours] = useState<HourOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadHours = async () => {
      setIsLoading(true);
      try {
        const response = await fetchHoursData();
        if (response?.success && response.responseObject) {
          setHours(response.responseObject);
        }
      } catch (error) {
        console.error("Error loading hours:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (open && hours.length === 0) {
      loadHours();
    }
  }, [open]);

  useEffect(() => {
    setStartHourId(defaultStartHourId);
    setEndHourId(defaultEndHourId);
  }, [defaultStartHourId, defaultEndHourId, open]);

  const getDisplayName = (hourId: number) => {
    const hour = hours.find((h) => h.id === hourId);
    return hour?.display_name || "";
  };

  const formatTimeDisplay = (hourId: number) => {
    const displayName = getDisplayName(hourId);
    if (!displayName) return "--:--";
    const [hoursStr, minutes] = displayName.split(":");
    const hour = parseInt(hoursStr, 10);
    const period = hour >= 12 ? "p.m." : "a.m.";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${String(displayHour).padStart(2, "0")}:${minutes} ${period}`;
  };

  const handleConfirm = () => {
    const startDisplay = getDisplayName(startHourId);
    const endDisplay = getDisplayName(endHourId);
    onConfirm(startHourId, endHourId, startDisplay, endDisplay);
  };

  const scheduleContent = (
    <>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
              Entrada
            </Typography>
            <CustomSelect
              value={startHourId}
              onChange={(e: any) => setStartHourId(Number(e.target.value))}
              size="small"
              fullWidth
              displayEmpty
              startAdornment={<IconClock size={40} style={{ marginRight: 8, color: "#666" }} />}
              sx={{ backgroundColor: "#f5f5f5" }}
            >
              <MenuItem value={0} disabled>
                --:--
              </MenuItem>
              {hours.map((hour) => (
                <MenuItem key={hour.id} value={hour.id}>
                  {hour.display_name}
                </MenuItem>
              ))}
            </CustomSelect>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
              Salida
            </Typography>
            <CustomSelect
              value={endHourId}
              onChange={(e: any) => setEndHourId(Number(e.target.value))}
              size="small"
              fullWidth
              displayEmpty
              startAdornment={<IconClock size={40} style={{ marginRight: 8, color: "#666" }} />}
              sx={{ backgroundColor: "#f5f5f5" }}
            >
              <MenuItem value={0} disabled>
                --:--
              </MenuItem>
              {hours.map((hour) => (
                <MenuItem key={hour.id} value={hour.id}>
                  {hour.display_name}
                </MenuItem>
              ))}
            </CustomSelect>
          </Box>
        </Box>
      )}
    </>
  );

  if (isEditMode) {
    return (
      <>
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", pb: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Editar jornada
              </Typography>
              {editingDate && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  Fecha: {editingDate}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                Horas: {formatTimeDisplay(startHourId)} - {formatTimeDisplay(endHourId)}
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <IconX size={20} />
            </IconButton>
          </DialogTitle>

          <DialogContent>{scheduleContent}</DialogContent>

          <DialogActions sx={{ px: 3, pb: 2, justifyContent: "center" }}>
            <Button onClick={() => setShowDeleteConfirm(true)} color="error">
              Eliminar
            </Button>
            <Button onClick={onClose} color="primary">
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={startHourId === 0 || endHourId === 0 || isLoading}
              sx={{
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} maxWidth="xs">
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar el horario de la fecha <strong>{editingDate}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteConfirm(false)} color="error">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (editingDate && onDelete) {
                  onDelete(editingDate);
                  setShowDeleteConfirm(false);
                  onClose();
                }
              }}
              color="primary"
              variant="contained"
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 380,
            p: 3,
            maxHeight: "100vh",
            overflow: "auto",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Aplicar jornada
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Horas: {formatTimeDisplay(startHourId)} - {formatTimeDisplay(endHourId)}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <IconX size={20} />
        </IconButton>
      </Box>

      <Box sx={{ mb: 3 }}>{scheduleContent}</Box>

      <Button
        variant="contained"
        fullWidth
        onClick={handleConfirm}
        disabled={startHourId === 0 || endHourId === 0 || isLoading}
        sx={{
          backgroundColor: "#e07a5f",
          "&:hover": { backgroundColor: "#c96a52" },
          textTransform: "none",
          fontWeight: 500,
        }}
      >
        Confirmar
      </Button>
    </Drawer>
  );
};

export default ApplyScheduleModal;
