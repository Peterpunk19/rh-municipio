"use client";

import React, { useEffect, useState, useMemo } from "react";
import Divider from '@mui/material/Divider';
import {Grid2 as Grid, Box, Typography, Button, ButtonGroup} from "@mui/material";
import { Temporal } from "@js-temporal/polyfill";
import {toUpper} from "lodash";
import {IconClockUp, IconClockDown, IconClockCheck} from "@tabler/icons-react";
import {getEmployeesAttendances} from "@/services/employees-attendances";
import {StatusCodes} from "http-status-codes";
import {logger} from "@/lib/logger";
import {useSelector} from "@/store/hooks";
import type {RootState} from "@/store/store";
import {formatDate} from "@/utils/formatter";
import {calculateDaysBetweenDates} from "@/common/utils";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IncidentDetailModal from "@/app/(protected)/employee/incidents/IncidentDetailModal";
import {IAttendance, IAttendanceCalendar, ICalendarDay} from "@/components/types";
import {generateUniqueKey} from "@/utils";

const CustomCalendarAttendance = ()=> {
  const { values } = useSelector(
    (state: RootState) => state.filters.employeesAttendances || { searchTerm: "", values: {} },
  );

  const [attendanceData, setAttendanceData] = React.useState<any>([]);
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  async function fetchEmployeesAttendances(from: string, to: string) {
    const employeeId = values.employee_id;

    try {
      const response = await getEmployeesAttendances({
        employeeId: employeeId ?? "",
        checkIn: from,
        checkOut: to,
        limit: calculateDaysBetweenDates(from, to)
      });

      if (response.statusCode === StatusCodes.OK) {
        setAttendanceData(response.responseObject.data);
      } else {
        setAttendanceData(null);
      }
    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack });
    }
  }

  const attendanceMap = useMemo(() => {
    const map = new Map<string, IAttendanceCalendar>();
    if (!attendanceData || attendanceData.length === 0) return map;

    for (const record of attendanceData) {
      const dateString = record.check_in?.substring(0, 10) ||
        record.check_out?.substring(0, 10);

      if (!dateString) {
        continue;
      }

      const incidents = record.employee_attendance_incident?.map((ai: any) => ({
        id: ai.employee_incident.id,
        type: ai.employee_incident.incident.display_name,
        name: ai.employee_incident.incident.name,
        displayTimeOnCalendar: ai.employee_incident.incident.display_time_on_calendar,
        bgColorOnCalendar: ai.employee_incident.incident.bgColorOnCalendar,
        colorOnCalendar: ai.employee_incident.incident.colorOnCalendar,
        status: ai.employee_incident.incident_status.display_name,
      })) || [];

      const attendance: IAttendanceCalendar = {
        id: record.id,
        checkIn: record.check_in || null,
        checkOut: record.check_out || null,
        incidents,
        hasIncidents: incidents.length > 0,
      };

      map.set(dateString, attendance);
    }

    return map;
  }, [attendanceData]);

  const today = Temporal.Now.plainDateISO();

  const [month, setMonth] = useState(Temporal.Now.plainDateISO().month);
  const [year, setYear] = useState(Temporal.Now.plainDateISO().year);
  const [monthCalendar, setMonthCalendar] = useState<ICalendarDay[]>([]);

  const next = () => {
    const { month: nextMonth, year: nextYear } = Temporal.PlainYearMonth.from({
      month,
      year,
    }).add({ months: 1 });


    setMonth(nextMonth);
    setYear(nextYear);
  };

  const previous = () => {
    const { month: prevMonth, year: prevYear } = Temporal.PlainYearMonth.from({
      month,
      year,
    }).subtract({ months: 1 });
    setMonth(prevMonth);
    setYear(prevYear);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedIncident(null);
  };

  useEffect(() => {
    const fiveWeeks = 5 * 7;
    const sixWeeks = 6 * 7;
    const startOfMonth = Temporal.PlainDate.from({ year, month, day: 1 });
    const monthLength = startOfMonth.daysInMonth;
    const dayOfWeekMonthStartedOn = startOfMonth.dayOfWeek % 7;
    const length =
      dayOfWeekMonthStartedOn + monthLength > fiveWeeks ? sixWeeks : fiveWeeks;

    const calendar = new Array(length)
      .fill({})
      .map((_, index) => {
        const date = startOfMonth.add({
          days: index - dayOfWeekMonthStartedOn,
        });
        return {
          isInMonth: !(
            index < dayOfWeekMonthStartedOn ||
            index - dayOfWeekMonthStartedOn >= monthLength
          ),
          date,
        };
      });

    const firstDay = calendar[0]?.date;
    const lastDay = calendar[calendar.length - 1]?.date;

    fetchEmployeesAttendances(formatDate(new Date(firstDay.toString()), "yyyy-MM-dd"), formatDate(new Date(lastDay.toString()), "yyyy-MM-dd"));

    setMonthCalendar(calendar);
  }, [year, month]);

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box>
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button onClick={previous}>Anterior</Button>
            <Button onClick={next}>Siguiente</Button>
          </ButtonGroup>
        </Box>

        <Box flexGrow={1} display="flex" justifyContent="center">
          <Typography
            color="textSecondary"
            variant="h3"
            fontWeight="400"
          >
            {toUpper(Temporal.PlainDate.from({ year, month, day: 1 }).toLocaleString("es", {
              month: "long",
              year: "numeric",
            }))}
          </Typography>
        </Box>

        <Box width="180px" />
      </Box>

      <Grid container columns={7}>
        {days.map((name) => (
          <Grid size={{xs: 1}} key={generateUniqueKey()} border={1} borderColor="#f6f6f6" borderLeft={1} borderRight={1} sx={{ borderLeftColor: "#ddd", borderRightColor: "#ddd" }} >
            <Typography align="center" fontWeight="bold">{name}</Typography>
          </Grid>
        ))}
      </Grid>
      <Grid container columns={7} flexGrow={1}>
        {monthCalendar.map((day, index) => {
          const dateStr = day.date.toString();
          const attendance = attendanceMap.get(dateStr);
          const hasIncidents = attendance?.hasIncidents;
          const incidents = attendance?.incidents || [];
          const checkIn = attendance?.checkIn;
          const checkOut = attendance?.checkOut;

          const isPast = Temporal.PlainDate.compare(day.date, today) < 0;

          return (
            <Grid
              size={{xs: 1}}
              key={index}
              textAlign="right"
              border={0.5}
              borderColor="#eee"
              sx={{
                backgroundColor: day.isInMonth ? "#fff" : "#f6f6f6",
                color: day.isInMonth ? "#000" : "#999999",
                pt: 2.4,
                pl: 1,
                pr  : 1,
                position: 'relative',
                minHeight: 140,
              }}
            >
              <Box
                fontWeight="bold"
                sx={{
                  width: 32,
                  height: 32,
                  lineHeight: '32px',
                  borderRadius: '50%',
                  textAlign: 'center',
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  border: day.isInMonth ? Temporal.PlainDate.compare(day.date, today) === 0 ? '1px solid #000' : "1px solid #fff" : "1px solid #f6f6f6",
                  color: "#000"
                }}
              >
                {day.date.day}
              </Box>
              <>
                <Box sx={{mt: 3}}>
                  {attendance ? (
                    <Box sx={{ textAlign: 'left', mb: 2 }}>
                      {hasIncidents ? (
                        incidents.map((inc: any) => (
                          <Box
                            key={generateUniqueKey()}
                            onClick={() => {
                              setSelectedIncident(inc.id);
                              setModalOpen(true);
                            }}
                            display="flex"
                            alignItems="center"
                            title={`Haz clic para ver detalle de ${inc.type}`}
                            gap={1}
                            sx={{
                              mb: 0.3,
                              backgroundColor: inc.bgColorOnCalendar || '#eee',
                              borderRadius: '6px',
                              px: 1,
                              py: 0.3,
                              cursor: 'pointer',
                            }}
                          >
                            <IconClockCheck size={14} color={inc.colorOnCalendar || '#000'}/>
                            <Typography
                              fontWeight={600}
                              variant="body2"
                              sx={{ fontSize: '0.75rem', color: inc.colorOnCalendar || '#000' }}
                            >
                              {inc.type}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        (() => {
                          let label = "";
                          let bg = "";
                          let color = "#fff";

                          if (checkIn && checkOut) {
                            label = "ASISTENCIA";
                            bg = "success.attendance";
                          } else if (checkIn && !checkOut) {
                            label = "OMISIÓN DE SALIDA";
                            bg = "warning.main";
                          } else if (!checkIn && checkOut) {
                            label = "OMISIÓN DE ENTRADA";
                            bg = "warning.main";
                          }

                          if (!label) return null;

                          return (
                            <Box
                              key={generateUniqueKey()}
                              display="flex"
                              alignItems="center"
                              gap={1}
                              sx={{
                                mb: 0.3,
                                backgroundColor: bg,
                                borderRadius: "6px",
                                px: 1,
                                py: 0.3,
                              }}
                            >
                              <IconClockCheck size={14} color={color} />
                              <Typography
                                fontWeight={600}
                                variant="body2"
                                sx={{ fontSize: "0.75rem", color }}
                              >
                                {label}
                              </Typography>
                            </Box>
                          );
                        })()
                      )}
                    </Box>
                  ) : (
                    isPast && (
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography fontWeight={600} variant="body2">
                          SIN REGISTROS
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>

                {attendance && (
                  <>
                    {(
                      (!attendance.hasIncidents && (checkIn || checkOut)) ||
                      (attendance.hasIncidents &&
                        attendance.incidents.some(
                          (inc: any) => inc.displayTimeOnCalendar === true
                        ))
                    ) && (
                      <>
                        <Box
                          key={generateUniqueKey()}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          sx={{
                            mb: 0.3,
                            backgroundColor: "#eee",
                            borderRadius: "6px",
                            px: 1,
                            py: 0.3,
                          }}
                        >
                          <IconClockUp size={14} color="#000" />
                          <Typography
                            fontWeight={600}
                            variant="body2"
                            sx={{ fontSize: "0.75rem", color: "#000" }}
                          >
                            Entrada: {checkIn ? formatDate(new Date(checkIn), "HH:mm") : ""}
                          </Typography>
                        </Box>

                        <Box
                          key={generateUniqueKey()}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          sx={{
                            mb: 0.3,
                            backgroundColor: "#eee",
                            borderRadius: "6px",
                            px: 1,
                            py: 0.3,
                          }}
                        >
                          <IconClockDown size={14} color="#000" />
                          <Typography
                            fontWeight={600}
                            variant="body2"
                            sx={{ fontSize: "0.75rem", color: "#000" }}
                          >
                            Salida: {checkOut ? formatDate(new Date(checkOut), "HH:mm") : ""}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </>
                )}
              </>
            </Grid>
          )
        })}
      </Grid>

      {selectedIncident && (
        <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
          <DialogTitle id="alert-dialog-title">Detalle de incidencia</DialogTitle>
          <DialogContent>
            <IncidentDetailModal id={selectedIncident} />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
}

export default CustomCalendarAttendance;
