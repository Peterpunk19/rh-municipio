"use client";

import React, { useState } from "react";
import { Grid2, Divider, Typography } from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import { StatusCodes } from "http-status-codes";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { useParams, redirect } from "next/navigation";
import { getEmployeeAttendanceById } from "@/services/employees-attendances";
import { formatDate } from "@/utils/formatter";
import { logger } from "@/lib/logger";

const BCrumb = [
  {
    to: "/admin/employees-attendances",
    title: "Asistencias de empleados",
  },
  {
    title: "Detalles de asistencia",
  },
];

const EmployeeAttendance = () => {
  const [loading, setLoading] = useState(false);
  const [employeeAttendanceData, setEmployeeAttendanceData] = useState<any>(null);
  const { id } = useParams();

  React.useEffect(() => {
    try {
      if (id) {
        setLoading(true);
        getEmployeeAttendanceById(id as string).then((data) => {
          if (data.statusCode === StatusCodes.OK) {
            setEmployeeAttendanceData(data.responseObject);
          } else {
            setEmployeeAttendanceData(null);
            redirect("/admin/employees-attendances");
          }
          setLoading(false);
        });
      }
    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack });
      setLoading(false);
      redirect("/admin/employees-attendances");
    }
  }, [id]);

  if (!employeeAttendanceData && !loading) return <div>Asistencia no encontrada</div>;
  if (loading) return <div>Cargando...</div>;

  return (
    !loading && (
      <Grid2 container spacing={3}>
        <Breadcrumb title="Detalles de asistencia" items={BCrumb} />
        <BlankCard>
          <Grid2 container spacing={2} p={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Asistencia
              </Typography>
              <Typography variant="body1">{employeeAttendanceData.type_attendance.display_name}</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Ubicación
              </Typography>
              <Typography variant="body1">{employeeAttendanceData.location.display_name}</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Fecha de creación
              </Typography>
              <Typography variant="body1">
                {formatDate(employeeAttendanceData.created_at, "dd/MM/yyyy HH:mm")}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Fecha de entrada
              </Typography>
              <Typography variant="body1">{formatDate(employeeAttendanceData.check_in, "dd/MM/yyyy HH:mm")}</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Fecha de salida
              </Typography>
              <Typography variant="body1">
                {formatDate(employeeAttendanceData.check_out, "dd/MM/yyyy HH:mm")}
              </Typography>
            </Grid2>
            <Grid2 size={{ md: 12 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Descripción
              </Typography>
              <Typography variant="body1">{employeeAttendanceData.description}</Typography>
            </Grid2>
          </Grid2>
          <Divider></Divider>

          <Grid2 container spacing={2} p={3}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Organismo público
              </Typography>
              <Typography variant="body1">{employeeAttendanceData.organism_public.display_name}</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Organismo administrativo
              </Typography>
              <Typography variant="body1">{employeeAttendanceData.organism_administrative.display_name}</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Empleado
              </Typography>
              <Typography variant="body1">
                {employeeAttendanceData.employee.number_employee} {employeeAttendanceData.employee.fullName}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                CURP
              </Typography>
              <Typography variant="body1">{employeeAttendanceData.employee.curp}</Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                RFC
              </Typography>
              <Typography variant="body1">{employeeAttendanceData.employee.rfc}</Typography>
            </Grid2>
          </Grid2>
        </BlankCard>
      </Grid2>
    )
  );
};

export default EmployeeAttendance;
