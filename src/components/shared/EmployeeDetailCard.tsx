import {
  Card,
  CardContent,
  Typography,
  Grid2 as Grid,
  Fade,
} from '@mui/material';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

interface IEmployee {
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

export const EmployeeDetailCard = ({employee}: { employee: IEmployee | null; }) => {
  if (!employee) return null;

  return (
    <Fade in={true}>
      <Card variant="outlined" sx={{ mt: 2, p: 2 }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Información del empleado
          </Typography>
          <Divider />
          <Box sx={{ overflow: 'auto' }}>
            <Box pt={3}>
              <Box display="flex" alignItems="center">
                <Avatar
                  alt=""
                  src=""
                  sx={{ width: '72px', height: '72px' }}
                />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" mb={0.5}>
                    {employee.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={0.5}>
                    {employee.number_employee}
                  </Typography>
                </Box>
              </Box>
              <Grid container>
                <Grid
                  mt={4}
                  size={{
                    lg: 5,
                    xs: 12
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    RFC
                  </Typography>
                  <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                    {employee.rfc}
                  </Typography>
                </Grid>
                <Grid
                  mt={4}
                  size={{
                    lg: 7,
                    xs: 12
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    CURP
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    {employee.curp}
                  </Typography>
                </Grid>
                <Grid
                  mt={2}
                  size={{
                    lg: 5,
                    xs: 12
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    Ubicación administrativa
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    {employee.direccion_display_name} - {employee.secretaria_display_name}
                  </Typography>
                </Grid>
                <Grid
                  mt={2}
                  size={{
                    lg: 4,
                    xs: 12
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    Categoría laboral
                  </Typography>
                  <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                    {employee.category_display_name}
                  </Typography>
                </Grid>
                <Grid
                  mt={2}
                  size={{
                    lg: 3,
                    xs: 12
                  }}>
                  <Typography variant="body2" color="text.secondary">
                    Tipo de empleado
                  </Typography>
                  <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                    {employee.employee_type_display_name}
                  </Typography>
                </Grid>
                <Grid
                  mt={2}
                  size={{
                    lg: 5,
                    xs: 12
                  }}>
                  <Typography variant="body2" mb={0.5} color="text.secondary">
                    Ubicación
                  </Typography>
                  <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                    {employee.location_display_name}
                  </Typography>
                </Grid>
                <Grid
                  mt={2}
                  size={{
                    lg: 7,
                    xs: 12
                  }}>
                  <Typography variant="body2" mb={0.5} color="text.secondary">
                    Tipo de checado
                  </Typography>
                  <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                    {employee.attendance_type_display_name}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};
