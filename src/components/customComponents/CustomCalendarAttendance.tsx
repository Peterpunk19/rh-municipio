"use client";

import React, { useEffect, useState, useMemo } from "react";
import Divider from '@mui/material/Divider';
import { Grid2 as Grid, Box, Typography, Button, ButtonGroup } from "@mui/material";
import { Temporal } from "@js-temporal/polyfill";
import {toUpper} from "lodash";
import {IconClockUp, IconClockDown, IconClockCheck, IconClockCancel} from "@tabler/icons-react";
import {getEmployeesAttendances} from "@/services/employees-attendances";
import {StatusCodes} from "http-status-codes";
import {logger} from "@/lib/logger";
wimport {useSelector} from "@/store/hooks";
import type {RootState} from "@/store/store";

type CalendarDay = {
  date: Temporal.PlainDate;
  isInMonth: boolean;
};

type Attendance = {
  id: number;
  check_in: string;
  check_out: string;
};

const CustomCalendarAttendance = ()=> {
  const { values } = useSelector(
    (state: RootState) => state.filters.employeesAttendances || { searchTerm: "", values: {} },
  );

  const [attendanceData, setAttendanceData] = React.useState<any>([]);

  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  async function fetchEmployeesAttendances(month: number, year: number) {
    const [from, to] = getFirstAndLastMonth(month, year);
    const employeeId = values.employee_id;

    try {
      const response = await getEmployeesAttendances({ employeeId: employeeId ?? "", checkIn: from, checkOut: to});
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
    const map = new Map<string, Attendance>();
    if (!attendanceData) return map;

    for (const record of attendanceData) {
      const dateStr = Temporal.Instant.from(record.check_in).toZonedDateTimeISO("America/Mexico_City").toPlainDate().toString();
      map.set(dateStr, record);
    }
    return map;
  }, [attendanceData]);

  const today = Temporal.Now.plainDateISO();

  const [month, setMonth] = useState(Temporal.Now.plainDateISO().month);
  const [year, setYear] = useState(Temporal.Now.plainDateISO().year);
  const [monthCalendar, setMonthCalendar] = useState<CalendarDay[]>([]);

  const getFirstAndLastMonth = (month: number, year: number) => {
    const firstDay = Temporal.PlainDate.from({ year: year, month: month, day: 1 });
    const lastDay = firstDay.with({ day: firstDay.daysInMonth });

    const firstDayStr = firstDay.toString();
    const lastDayStr = lastDay.toString();

    return [firstDayStr, lastDayStr];
  }

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

  useEffect(() => {
    fetchEmployeesAttendances(month, year);

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
        {days.map((name, index) => (
          <Grid size={{xs: 1}} key={index} border={1} borderColor="#f6f6f6" borderLeft={1} borderRight={1} sx={{ borderLeftColor: "#ddd", borderRightColor: "#ddd" }} >
            <Typography align="center" fontWeight="bold">{name}</Typography>
          </Grid>
        ))}
      </Grid>
      <Grid container columns={7} flexGrow={1}>
        {monthCalendar.map((day, index) => {
          const attendance = attendanceMap.get(day.date.toString());

          const isPast = Temporal.PlainDate.compare(day.date, today) < 0;
          const hasAttendance = !!attendance;

          const backgroundColor = hasAttendance
            ? 'success.attendance'
            : isPast
              ? 'error.attendance'
              : '#fff';

          const color = hasAttendance
            ? '#fff'
            : isPast
              ? '#fff'
              : '#000';

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
                  p: 2,
                  position: 'relative',
                  minHeight: 112
                }}
              >
                {attendance ?
                  <Box
                    fontWeight="bold"
                    sx={{
                      textAlign: 'left',
                      mb: 2
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconClockCheck size="16"/>
                      <Typography fontWeight={600} variant="body2">
                        Asistencia
                      </Typography>
                    </Box>
                  </Box>
                  : isPast && (
                  <Box
                    fontWeight="bold"
                    sx={{
                      textAlign: 'left',
                      mb: 2
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconClockCancel size="16"/>
                      <Typography fontWeight={600} variant="body2">
                        Falta
                      </Typography>
                    </Box>
                  </Box>
                )
                }
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
                    backgroundColor: backgroundColor,
                    border: attendance ? 'success.attendance' : "1px solid #eee",
                    borderColor: attendance ? 'danger.attendance' : 'danger.attendance',
                    color:  color
                  }}
                >
                  {day.date.day}
                  {Temporal.PlainDate.compare(day.date, today) === 0 ?
                    <Divider sx={{marginTop: 0.5, border: 1.5, borderColor: 'orangered'}} />
                    : null
                  }
                </Box>

                {attendance && (
                  <Box mt={4}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconClockUp size={14} />
                      <Typography variant="body2" fontWeight={500}>
                        Entrada: {Temporal.Instant.from(attendance.check_in).toZonedDateTimeISO("America/Mexico_City").toPlainTime().toString().slice(0, 5)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconClockDown size={14} />
                      <Typography variant="body2" fontWeight={500}>
                        Salida: {Temporal.Instant.from(attendance.check_out).toZonedDateTimeISO("America/Mexico_City").toPlainTime().toString().slice(0, 5)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
          )
        })}
      </Grid>
    </Box>
  );
}

export default CustomCalendarAttendance;
