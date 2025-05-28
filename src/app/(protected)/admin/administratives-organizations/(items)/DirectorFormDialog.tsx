import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid2 as Grid,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export default function DirectorFormDialog({
  open,
  onClose,
  onSave,
  director,
}: { open: boolean; onClose: () => void; onSave: (data: any) => void; director: any }) {
  const [form, setForm] = useState({ director: "", deputy_director: "", start_date: "", end_date: "" });

  useEffect(() => {
    if (director) setForm(director);
  }, [director]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string) => (value: dayjs.Dayjs | null) => {
    setForm((prev) => ({
      ...prev,
      [name]: value && value.isValid() ? value.toISOString() : "",
    }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Director</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          name="director"
          value={form.director}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Suplente"
          name="deputy_director"
          value={form.deputy_director}
          onChange={handleChange}
          fullWidth
          margin="dense"
        />
        <Divider />
        <Typography variant="body1" fontWeight="bold" sx={{ mt: 2, mb: 2 }}>
          Periodo del Cargo
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                name="start_date"
                value={form.start_date && dayjs(form.start_date).isValid() ? dayjs(form.start_date) : null}
                onChange={handleDateChange("start_date")}
                label="De"
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                name="end_date"
                value={form.end_date && dayjs(form.end_date).isValid() ? dayjs(form.end_date) : null}
                onChange={handleDateChange("end_date")}
                label="A"
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSave(form)} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
