"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  FormControl,
  Grid2,
  MenuItem,
  Typography,
  Button,
  IconButton,
  Stack,
  Paper,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CustomFormLabel from "@/app/components/forms/theme-elements/CustomFormLabel";
import CustomSelect from "@/app/components/forms/theme-elements/CustomSelect";
import CustomLabelError from "@/components/theme-elements/CustomLabelError";
import { updateFormData, removeSchedule } from "@/store/employees-requests/CreateEmployeeRequest";
import { RootState } from "@/store/store";
import { useFetchOptions } from "@/components/customHooks/useFetchOptions";
import { fetchCatalogData } from "@/services/catalogs";
import { AppDispatch } from "@/store/store";
import DateRangePicker from "@/components/customFields/DateRangePicker";

interface ScheduleFormProps {
  currentJobSchedule: any;
}

function hasDuplicateSchedules(schedules: any[]): boolean {
  return schedules.some((schedule, index) =>
    schedules.some(
      (otherSchedule, otherIndex) =>
        index !== otherIndex &&
        schedule.startDayId !== 0 &&
        schedule.endDayId !== 0 &&
        schedule.startHourId !== 0 &&
        schedule.endHourId !== 0 &&
        otherSchedule.startDayId !== 0 &&
        otherSchedule.endDayId !== 0 &&
        otherSchedule.startHourId !== 0 &&
        otherSchedule.endHourId !== 0 &&
        schedule.startDayId === otherSchedule.startDayId &&
        schedule.endDayId === otherSchedule.endDayId &&
        schedule.startHourId === otherSchedule.startHourId &&
        schedule.endHourId === otherSchedule.endHourId,
    ),
  );
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ currentJobSchedule }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { formData, errors } = useSelector((state: RootState) => state.createEmployeeRequest);

  const [errorsLocalValidation, setErrorsLocalValidation] = useState<Record<string, string>>({});

  const catalogName = "day";
  const fetchDays = React.useCallback(() => fetchCatalogData(catalogName), []);
  const { options: days, isLoading: isLoadingDays, error: errorDays } = useFetchOptions(fetchDays);

  const catalogNameHours = "hour";
  const fetchHours = React.useCallback(() => fetchCatalogData(catalogNameHours), []);
  const { options: hours, isLoading: isLoadingHours, error: errorHours } = useFetchOptions(fetchHours);

  const getAvailableDays = (currentIndex: number) => {
    const selectedDays = formData.scheduleForm.schedules
      .filter((_, idx) => idx !== currentIndex)
      .flatMap((schedule) => [schedule.startDayId, schedule.endDayId]);

    return days?.filter((day) => !selectedDays.includes(Number(day.id))) || [];
  };

  const handleChange = (event: any, index?: number) => {
    const { name, value } = event.target;

    if (index !== undefined) {
      const schedules = [...formData.scheduleForm.schedules];
      schedules[index] = {
        ...schedules[index],
        [name]: value,
      };
      dispatch(updateFormData({ field: "scheduleForm.schedules", value: schedules }));

      if (hasDuplicateSchedules(schedules)) {
        setErrorsLocalValidation((prev) => ({
          ...prev,
          schedule: "No pueden haber 2 horarios repetidos",
        }));
      } else {
        setErrorsLocalValidation((prev) => {
          const { schedule, ...rest } = prev;
          return rest;
        });
      }
    } else {
      dispatch(updateFormData({ field: `scheduleForm.${name}`, value }));
    }
  };

  const handleAddSchedule = () => {
    dispatch(
      updateFormData({
        field: "scheduleForm.schedules",
        value: [
          {
            startDayId: 0,
            endDayId: 0,
            startHourId: 0,
            endHourId: 0,
          },
          ...formData.scheduleForm.schedules,
        ],
      }),
    );

    const hasDuplicates = formData.scheduleForm.schedules.some((schedule, index) =>
      formData.scheduleForm.schedules.some(
        (otherSchedule, otherIndex) =>
          index !== otherIndex &&
          schedule.startDayId !== 0 &&
          schedule.endDayId !== 0 &&
          schedule.startHourId !== 0 &&
          schedule.endHourId !== 0 &&
          otherSchedule.startDayId !== 0 &&
          otherSchedule.endDayId !== 0 &&
          otherSchedule.startHourId !== 0 &&
          otherSchedule.endHourId !== 0 &&
          schedule.startDayId === otherSchedule.startDayId &&
          schedule.endDayId === otherSchedule.endDayId &&
          schedule.startHourId === otherSchedule.startHourId &&
          schedule.endHourId === otherSchedule.endHourId,
      ),
    );

    if (hasDuplicates) {
      setErrorsLocalValidation((prev) => ({
        ...prev,
        schedule: "No pueden haber 2 horarios repetidos",
      }));
    } else {
      setErrorsLocalValidation((prev) => {
        const { schedule, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleRemoveSchedule = (index: number) => {
    dispatch(removeSchedule(index));
  };

  const handleDateChange = (field: string, value: string) => {
    dispatch(updateFormData({ field: `scheduleForm.${field}`, value }));
  };

  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <DateRangePicker
            startDate={formData.scheduleForm.startDate}
            endDate={formData.scheduleForm.endDate}
            onStartDateChange={(date) => handleDateChange("startDate", date)}
            onEndDateChange={(date) => handleDateChange("endDate", date)}
            startDateError={errors.startDate}
            endDateError={errors.endDate}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Horario Actual
          </Typography>
          {currentJobSchedule ? (
            <Paper sx={{ p: 2 }}>
              <Typography>
                {`${currentJobSchedule.start_day.display_name} a ${currentJobSchedule.end_day.display_name}`}
              </Typography>
              <Typography>
                {`${currentJobSchedule.start_hour.display_name} a ${currentJobSchedule.end_hour.display_name}`}
              </Typography>
            </Paper>
          ) : (
            <Typography color="text.secondary">No hay horario asignado actualmente</Typography>
          )}
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" gutterBottom>
              Nuevos Horarios
            </Typography>
            <Tooltip title="Agregar nuevo horario">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddSchedule}
                disabled={formData.scheduleForm.schedules.length >= 7}
                sx={{
                  minWidth: "auto",
                  width: "40px",
                  height: "40px",
                  p: 0,
                  "&:hover": {
                    backgroundColor: "primary.main",
                  },
                }}
              >
                <AddIcon />
              </Button>
            </Tooltip>
          </Stack>
          <CustomLabelError field={errorsLocalValidation.schedule} />
          {hasDuplicateSchedules(formData.scheduleForm.schedules) && (
            <Typography color="error" sx={{ mt: 1 }}>
              No pueden haber 2 horarios repetidos
            </Typography>
          )}
          {formData.scheduleForm.schedules.map((schedule, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid2 container spacing={2} style={{ display: "flex", justifyContent: "center" }}>
                <Grid2 size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth>
                    <CustomFormLabel>Día Inicio</CustomFormLabel>
                    <CustomSelect
                      name="startDayId"
                      value={schedule.startDayId}
                      onChange={(e: any) => handleChange(e, index)}
                      disabled={isLoadingDays || errorDays}
                    >
                      <MenuItem value={0}>Selecciona el día</MenuItem>
                      {getAvailableDays(index).map((day) => (
                        <MenuItem key={day.id} value={day.id}>
                          {day.display_name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </FormControl>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 3 }}>
                  <FormControl fullWidth>
                    <CustomFormLabel>Día Fin</CustomFormLabel>
                    <CustomSelect
                      name="endDayId"
                      value={schedule.endDayId}
                      onChange={(e: any) => handleChange(e, index)}
                      disabled={isLoadingDays || errorDays}
                    >
                      <MenuItem value={0}>Selecciona el día</MenuItem>
                      {getAvailableDays(index).map((day) => (
                        <MenuItem key={day.id} value={day.id}>
                          {day.display_name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </FormControl>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth>
                    <CustomFormLabel>Hora Entrada</CustomFormLabel>
                    <CustomSelect
                      name="startHourId"
                      value={schedule.startHourId}
                      onChange={(e: any) => handleChange(e, index)}
                      disabled={isLoadingHours || errorHours}
                    >
                      <MenuItem value={0}>Selecciona la hora</MenuItem>
                      {hours?.map((hour) => (
                        <MenuItem key={hour.id} value={hour.id}>
                          {hour.display_name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </FormControl>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth>
                    <CustomFormLabel>Hora Salida</CustomFormLabel>
                    <CustomSelect
                      name="endHourId"
                      value={schedule.endHourId}
                      onChange={(e: any) => handleChange(e, index)}
                      disabled={isLoadingHours || errorHours}
                    >
                      <MenuItem value={0}>Selecciona la hora</MenuItem>
                      {hours?.map((hour) => (
                        <MenuItem key={hour.id} value={hour.id}>
                          {hour.display_name}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </FormControl>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 2 }} sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Stack direction="row" spacing={2} alignItems="center" marginTop={5}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveSchedule(index)}
                      disabled={formData.scheduleForm.schedules.length === 1}
                    >
                      <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                    </IconButton>
                  </Stack>
                </Grid2>
              </Grid2>
            </Box>
          ))}
          <CustomLabelError field={errors.schedule} />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ScheduleForm;
