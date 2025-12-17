"use client";

import React, { useState } from "react";
import {
  Grid2 as Grid,
  Box,
  FormControlLabel,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { Temporal } from "@js-temporal/polyfill";
import { toUpper } from "lodash";

import { useEmployeeCalendar } from "@/hooks/calendar/useEmployeeCalendar";
import IncidentDetailModal from "@/app/(protected)/employee/incidents/IncidentDetailModal";
import CustomCheckbox from "@/app/components/forms/theme-elements/CustomCheckbox";
import CalendarAttendanceDay from "./CalendarAttendanceDay";
import CalendarHeader from "@/components/customComponents/CalendarHeader";
import CalendarDaysHeader from "@/components/customComponents/CalendarDaysHeader";

const CustomCalendarAttendance = ({ employeeData }: any) => {
  const {
    today,
    days,
    month,
    year,
    monthCalendar,
    attendanceMap,
    scheduleMap,
    next,
    previous,
  } = useEmployeeCalendar(employeeData.id);

  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <Box display="flex" flexDirection="column" height="100%" sx={{ bgcolor: "#F5F7FB", borderRadius: 3, p: 2 }}>
      <CalendarHeader
        title={toUpper(
          Temporal.PlainDate.from({ year, month, day: 1 }).toLocaleString("es", {
            month: "long",
            year: "numeric",
          })
        )}
        onPrevious={previous}
        onNext={next}
        rightSlot={
          <FormControlLabel
            control={
              <CustomCheckbox
                checked={showSchedule}
                onChange={(e) => setShowSchedule(e.target.checked)}
              />
            }
            label="Mostrar horario"
          />
        }
      />

      <CalendarDaysHeader days={days} mb={2} />

      <Grid container columns={7} flexGrow={1}>
        {monthCalendar.map((day) => {
          const key = day.date.toString().substring(0, 10);
          return (
            <CalendarAttendanceDay
              key={key}
              day={day}
              today={today}
              attendance={attendanceMap.get(key)}
              isWorkDay={scheduleMap.has(key)}
              schedule={scheduleMap.get(key)}
              showSchedule={showSchedule}
              onIncidentClick={(id) => {
                setSelectedIncident(id);
                setModalOpen(true);
              }}
            />
          );
        })}
      </Grid>

      {selectedIncident && (
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="md">
          <DialogTitle>Detalle de incidencia</DialogTitle>
          <DialogContent>
            <IncidentDetailModal id={selectedIncident} />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default CustomCalendarAttendance;
