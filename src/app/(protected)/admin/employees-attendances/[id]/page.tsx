"use client";

import React, { useState } from "react";
import { Grid2, Typography, TextField, Stack, Button } from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import { StatusCodes } from "http-status-codes";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { useParams, redirect } from "next/navigation";
import { getEmployeeAttendanceById } from "@/services/employees-attendances";
import { formatDate } from "@/utils/formatter";
import { logger } from "@/lib/logger";
import { IEmployeeAttendanceDataById } from "@/interfaces/EmployeeAttendance";
import Link from "next/link";

const BCrumb = [
  {
    to: "/admin/employees-attendances",
    title: "Asistencias de empleados",
  },
  {
    title: "Detalles de asistencia",
  },
];

const EmployeeAttendanceById = () => {
  const [loading, setLoading] = useState(false);
  const [employeeAttendanceDataById, setEmployeeAttendanceDataById] = useState<IEmployeeAttendanceDataById | null>(
    null,
  );
  const { id } = useParams();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          setLoading(true);
          const data = await getEmployeeAttendanceById(id as string);
          if (data.statusCode === StatusCodes.OK) {
            setEmployeeAttendanceDataById(data.responseObject);
          } else {
            setEmployeeAttendanceDataById(null);
            redirect("/admin/employees-attendances");
          }
        }
      } catch (error: any) {
        logger.error({ error: error.message, stack: error.stack });
        setEmployeeAttendanceDataById(null);
        redirect("/admin/employees-attendances");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (!employeeAttendanceDataById && !loading) return <div>Asistencia no encontrada</div>;
  if (loading) return <div>Cargando...</div>;

  return (
    <Grid2 container spacing={3}>
      <Breadcrumb title="Detalles de asistencia" items={BCrumb} />
      <BlankCard>
        <Grid2 container spacing={2} p={3}>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Número de empleado
            </Typography>
            <TextField disabled fullWidth value={employeeAttendanceDataById!.employee.number_employee} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Empleado
            </Typography>
            <TextField disabled fullWidth value={employeeAttendanceDataById!.employee.fullName} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              RFC
            </Typography>
            <TextField disabled fullWidth value={employeeAttendanceDataById!.employee.rfc} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              CURP
            </Typography>
            <TextField disabled fullWidth value={employeeAttendanceDataById!.employee.curp} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Organismo Público
            </Typography>
            <TextField disabled fullWidth value={employeeAttendanceDataById!.organism_public.display_name} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Organismo Administrativo
            </Typography>
            <TextField disabled fullWidth value={employeeAttendanceDataById!.organism_administrative.display_name} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Categoría
            </Typography>
            <TextField disabled fullWidth value={employeeAttendanceDataById!.employee.category.name} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Asistencia
            </Typography>
            <TextField disabled fullWidth value={employeeAttendanceDataById!.type_attendance.display_name} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Fecha y hora de entrada
            </Typography>
            <TextField
              disabled
              fullWidth
              value={formatDate(employeeAttendanceDataById!.check_in, "dd/MM/yyyy HH:mm")}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Fecha y hora de salida
            </Typography>
            <TextField
              disabled
              fullWidth
              value={formatDate(employeeAttendanceDataById!.check_out, "dd/MM/yyyy HH:mm")}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Ubicación
            </Typography>
            <TextField disabled fullWidth value={employeeAttendanceDataById!.location.display_name} />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 12 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Justificación
            </Typography>
            <TextField disabled fullWidth multiline={true} value={employeeAttendanceDataById!.description} />
          </Grid2>
          <Grid2 size={12} sx={{ mt: 2 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Link href={"/admin/employees-attendances"} passHref>
                <Button variant="contained" color="error" sx={{ display: "flex" }}>
                  Salir
                </Button>
              </Link>
            </Stack>
          </Grid2>
        </Grid2>
      </BlankCard>
    </Grid2>
  );
};

export default EmployeeAttendanceById;
