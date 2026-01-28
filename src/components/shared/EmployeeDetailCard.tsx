import { Card, CardContent, Typography, Grid2 as Grid, Fade } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { InfoItem } from "@/components/shared/InfoItem";

interface IEmployee {
  full_name: string;
  number_employee: string;
  label: string;
  rfc: string;
  curp: string;
  birthday: string;
  secretaria_display_name: string;
  direccion_display_name: string;
  category_display_name: string;
  employee_type_display_name: string;
  trade_union_display_name: string;
  location_display_name: string;
  attendance_type_display_name: string;
}

export function formatAntiguedadLabel(a: {
  antiguedadYears: number;
  antiguedadMonths: number;
  antiguedadDaysResidual: number;
}) {
  const parts: string[] = [];

  if (a.antiguedadYears > 0) parts.push(`${a.antiguedadYears} año${a.antiguedadYears === 1 ? "" : "s"}`);
  if (a.antiguedadMonths > 0) parts.push(`${a.antiguedadMonths} mes${a.antiguedadMonths === 1 ? "" : "es"}`);

  if (a.antiguedadDaysResidual > 0 || parts.length === 0) {
    parts.push(`${a.antiguedadDaysResidual} día${a.antiguedadDaysResidual === 1 ? "" : "s"}`);
  }

  return parts.join(" ");
}

export const EmployeeDetailCard = ({ employee }: { employee: IEmployee | null }) => {
  if (!employee) return null;

  const initials = employee.label
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return (
    <Fade in={true}>
      <Card
        variant="outlined"
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: (theme) => theme.palette.primary.light,
          borderColor: "primary.main",
          borderLeft: 4,
          borderLeftColor: "primary.main",
        }}
      >
        <Typography variant="h5" mb={2}>
          Información del empleado
        </Typography>
        <Divider />
        <Box sx={{ overflow: "auto" }}>
          <Box pt={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 72, height: 72, bgcolor: "primary.main" }}>{initials}</Avatar>

              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {employee.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No. Empleado: {employee.number_employee}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "inline-block",
                    mt: 0.5,
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  Antigüedad laboral:{" "}
                  {formatAntiguedadLabel({
                    antiguedadYears: employee.antiguedad_years,
                    antiguedadMonths: employee.antiguedad_months,
                    antiguedadDaysResidual: employee.antiguedad_days_residual,
                  })}
                </Typography>
              </Box>
            </Box>

            <Grid container rowSpacing={2} columnSpacing={3} mt={3}>
              <Grid size={{ lg: 5, xs: 12 }}>
                <InfoItem label="RFC" value={employee.rfc} />
              </Grid>

              <Grid size={{ lg: 7, xs: 12 }}>
                <InfoItem label="CURP" value={employee.curp} />
              </Grid>

              <Grid size={{ lg: 5, xs: 12 }}>
                <InfoItem
                  label="Ubicación administrativa"
                  value={`${employee.direccion_display_name} - ${employee.secretaria_display_name}`}
                />
              </Grid>

              <Grid size={{ lg: 4, xs: 12 }}>
                <InfoItem label="Categoría laboral" value={employee.category_display_name} />
              </Grid>

              <Grid size={{ lg: 3, xs: 12 }}>
                <InfoItem label="Tipo de empleado" value={employee.employee_type_display_name} />
              </Grid>

              <Grid size={{ lg: 5, xs: 12 }}>
                <InfoItem label="Ubicación" value={employee.location_display_name} />
              </Grid>

              <Grid size={{ lg: 7, xs: 12 }}>
                <InfoItem label="Tipo de checado" value={employee.attendance_type_display_name} />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Card>
    </Fade>
  );
};
