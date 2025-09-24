"use client";

import * as React from "react";
import { Grid2 as Grid, Tabs, Tab, Box, CardContent, Divider } from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import {
  IconAlertCircle,
  IconArticle,
  IconFileInvoice,
  IconCalendar,
  IconMap2,
  IconUserCircle,
  IconClock,
  IconFingerprint,
} from "@tabler/icons-react";
import { StatusCodes } from "http-status-codes";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import { logger } from "@/lib/logger";
import PersonalTab from "../(profile)/sections/PersonalTab";
import AddressTab from "../(profile)/sections/AddressTab";
import HiringTab from "../(profile)/sections/HiringTab";
import LocationScheduleTab from "../(profile)/sections/LocationScheduleTab";
import EmployeeProfileCard from "../(profile)/sections/EmployeeProfileCard";
import { useParams } from "next/navigation";
import { getEmployeeById } from "@/services/employees";
import { redirect } from "next/navigation";
import EmployeesIncidents from "@/app/(protected)/admin/employees-incidents/page";
import { updateFilter } from "@/store/tables/FiltersSlice";
import { useDispatch } from "@/store/hooks";
import EmployeeRequests from "@/app/(protected)/admin/employees-requests/page";
import { a11yPropsProfile } from "@/common/utils";
import CustomCalendarAttendance from "@/components/customComponents/CustomCalendarAttendance";
import EmployeesAttendances from "@/app/(protected)/admin/employees-attendances/page";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const BCrumb = [
  {
    to: "/admin/employees",
    title: "Listado de empleados",
  },
  {
    title: "Perfil del empleado",
  },
];
const Profile = () => {
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [employeeData, setEmployeeData] = React.useState<any>(null);
  const { id } = useParams();

  React.useEffect(() => {
    async function fetchEmployee() {
      try {
        if (id) {
          setLoading(true);
          const response = await getEmployeeById(id as string);
          if (response.statusCode === StatusCodes.OK) {
            setEmployeeData(response.responseObject);
          } else {
            setEmployeeData(null);
            redirect("/admin/employees");
          }
          setLoading(false);
        } else {
          logger.error({ error: "No employee id provided" });
          redirect("/admin/employees");
        }
      } catch (error: any) {
        logger.error({ error: error.message, stack: error.stack });
        setLoading(false);
        redirect("/admin/employees");
      }
    }
    fetchEmployee();
  }, [id]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(
      updateFilter({
        entity: event.target.id,
        key: "employee_id",
        value: id,
      }),
    );

    setValue(newValue);
  };

  if (!employeeData && !loading) return <div>Empleado no encontrado</div>;
  if (loading) return <div>Cargando...</div>;

  return (
    !loading && (
      <Grid container spacing={3}>
        <Breadcrumb title="Perfil del empleado" items={BCrumb} />
        <BlankCard>
          <EmployeeProfileCard employeeData={employeeData} />
        </BlankCard>
        <Grid size={12}>
          <BlankCard>
            <Box sx={{ pl: 2 }}>
              <Tabs value={value} onChange={handleChange} scrollButtons="auto" aria-label="profile tabs">
                <Tab
                  iconPosition="start"
                  icon={<IconUserCircle size="22" />}
                  label="Datos Generales"
                  {...a11yPropsProfile("personalInformation")}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconArticle size="22" />}
                  label="Datos de contratación"
                  {...a11yPropsProfile("hiringInformation")}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconAlertCircle size="22" />}
                  label="Incidencias"
                  {...a11yPropsProfile("employeesIncidents")}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconFileInvoice size="22" />}
                  label="Solicitudes"
                  {...a11yPropsProfile("employeeRequests")}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconFingerprint size="22" />}
                  label="Asistencias"
                  {...a11yPropsProfile("employeesAttendances")}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconCalendar size="22" />}
                  label="Calendario"
                  {...a11yPropsProfile("employeesCalendarAttendance")}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconClock size="22" />}
                  label="Ubicación y horario"
                  {...a11yPropsProfile("employeesSchedule")}
                />
              </Tabs>
            </Box>
            <Divider />
            <CardContent>
              <TabPanel value={value} index={0}>
                <PersonalTab employeeData={employeeData} />
                <AddressTab employeeData={employeeData} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <HiringTab employeeData={employeeData} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <EmployeesIncidents />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <EmployeeRequests />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <EmployeesAttendances
                  employeeData={employeeData}
                  actionButtons={{ downloadPdf: true, createAttendance: false }}
                  showSearchBar={false}
                />
              </TabPanel>
              <TabPanel value={value} index={5}>
                <CustomCalendarAttendance />
              </TabPanel>
              <TabPanel value={value} index={6}>
                <LocationScheduleTab employeeData={employeeData} />
              </TabPanel>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    )
  );
};

export default Profile;
