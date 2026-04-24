"use client";

import * as React from "react";
import { Grid2 as Grid, Tabs, Tab, Box, CardContent, Divider, Typography } from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import {
  IconAlertCircle,
  IconArticle,
  IconFileInvoice,
  IconCalendar,
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
import TerminateContractModal from "../(profile)/sections/TerminateContractModal";
import LocationScheduleTab from "../(profile)/sections/LocationScheduleTab";
import EmployeeProfileCard from "../(profile)/sections/EmployeeProfileCard";
import { useParams } from "next/navigation";
import { getEmployeeById } from "@/services/employees";
import { redirect } from "next/navigation";
import EmployeesIncidents from "@/app/(protected)/admin/employees-incidents/page";
import EmployeeRequests from "@/app/(protected)/admin/employees-requests/page";
import CustomCalendarAttendance from "@/components/customComponents/CustomCalendarAttendance";
import EmployeesAttendances from "@/app/(protected)/admin/employees-attendances/EmployeeAttendance";
import { formatScheduleText } from "@/utils/formatter";
import { updateFilter } from "@/store/tables/FiltersSlice";
import { useDispatch } from "@/store/hooks";
import { a11yPropsProfile } from "@/common/utils";
import { useTabsWithQueryParam } from "@/hooks/useTabsWithQueryParam";
import PageContainer from "@/app/components/container/PageContainer";
import CreateContractModal from "@/app/(protected)/admin/employees/(profile)/sections/CreateContractModal";
import { fetchCategoryData, fetchEmployeeTypesData, fetchSecretariasData } from "@/services/catalogs";

const TAB_QUERY_MAP = {
  personal: 0,
  hiring: 1,
  incidents: 2,
  requests: 3,
  attendances: 4,
  calendar: 5,
  schedule: 6,
} as const;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box
          sx={{
            animation: "fadeSlide 0.35s ease",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

const BCrumb = [{ to: "/admin/employees", title: "Listado de empleados" }, { title: "Perfil del empleado" }];
const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { value, handleTabChange } = useTabsWithQueryParam(TAB_QUERY_MAP, "personal");

  const [loading, setLoading] = React.useState(false);
  const [employeeData, setEmployeeData] = React.useState<any>(null);
  const [fullName, setFullName] = React.useState<any>("");

  const [openTerminateModal, setOpenTerminateModal] = React.useState(false);
  const [selectedHiring, setSelectedHiring] = React.useState<any>(null);

  const [openCreateContractModal, setOpenCreateContractModal] = React.useState(false);

  const [categories, setCategories] = React.useState<any[]>([]);
  const [employeeTypes, setEmployeeTypes] = React.useState<any[]>([]);
  const [secretarias, setSecretarias] = React.useState<any[]>([]);

  async function fetchCatalogs() {
    try {
      const [categoriesResponse, employeeTypesResponse, secretariasResponse] = await Promise.all([
        fetchCategoryData(),
        fetchEmployeeTypesData(),
        fetchSecretariasData(),
      ]);

      if (categoriesResponse.success) setCategories(categoriesResponse.responseObject || []);
      if (employeeTypesResponse.success) setEmployeeTypes(employeeTypesResponse.responseObject || []);
      if (secretariasResponse.success) setSecretarias(secretariasResponse.responseObject || []);
    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack });
    }
  }

  async function fetchEmployee() {
    try {
      if (!id) {
        redirect("/admin/employees");
        return;
      }

      setLoading(true);
      const response = await getEmployeeById(id as string);

      if (response.statusCode === StatusCodes.OK) {
        setEmployeeData(response.responseObject);
        const fullName =
          `${response.responseObject.number_employee} - ${response.responseObject.name} ${response.responseObject.paternal_last_name} ${response.responseObject.maternal_last_name}` ||
          "";
        setFullName(fullName);
      } else {
        redirect("/admin/employees");
      }

      setLoading(false);
    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack });
      setLoading(false);
      redirect("/admin/employees");
    }
  }

  React.useEffect(() => {
    fetchCatalogs();
    fetchEmployee();
  }, [id]);

  const onTabChange = (event: React.SyntheticEvent, newValue: number) => {
    dispatch(
      updateFilter({
        entity: event.target.id,
        key: "employee_id",
        value: id,
      }),
    );

    handleTabChange(event, newValue);
  };

  if (!employeeData && !loading) return <div>Empleado no encontrado</div>;
  if (loading) return <div>Cargando...</div>;

  const handleTerminateContract = (hiring: any) => {
    console.log("Terminar contrato:", hiring);

    // abrir modal
    setSelectedHiring(hiring);
    setOpenTerminateModal(true);
  };

  const handleCreateNewContract = (employeeData: any) => {
    console.log("Nuevo contrato:", employeeData);

    // abrir modal
    setOpenCreateContractModal(true);
  };

  return (
    <PageContainer title={fullName}>
      <Grid container spacing={3}>
        <Breadcrumb title="Perfil del empleado" items={BCrumb} />

        <BlankCard>
          <EmployeeProfileCard employeeData={employeeData} />
        </BlankCard>

        <Grid size={12}>
          <BlankCard>
            <Box sx={{ pl: 2 }}>
              <Tabs
                value={value}
                onChange={onTabChange}
                scrollButtons="auto"
                aria-label="profile tabs"
                TabIndicatorProps={{
                  sx: {
                    height: 3,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                  },
                }}
              >
                {[
                  {
                    label: "Datos Generales",
                    icon: <IconUserCircle size={22} />,
                    a11y: "personalInformation",
                  },
                  {
                    label: "Historial de contratación",
                    icon: <IconArticle size={22} />,
                    a11y: "hiringInformation",
                  },
                  {
                    label: "Incidencias",
                    icon: <IconAlertCircle size={22} />,
                    a11y: "employeesIncidents",
                  },
                  {
                    label: "Solicitudes",
                    icon: <IconFileInvoice size={22} />,
                    a11y: "employeeRequests",
                  },
                  {
                    label: "Asistencias",
                    icon: <IconFingerprint size={22} />,
                    a11y: "employeesAttendances",
                  },
                  {
                    label: "Calendario",
                    icon: <IconCalendar size={22} />,
                    a11y: "employeesCalendarAttendance",
                  },
                  {
                    label: "Ubicación y horario",
                    icon: <IconClock size={22} />,
                    a11y: "employeesSchedule",
                  },
                ].map(({ label, icon, a11y }) => (
                  <Tab
                    key={a11y}
                    label={label}
                    icon={icon}
                    iconPosition="start"
                    {...a11yPropsProfile(a11y)}
                    sx={{
                      transition: "all 0.25s ease",
                      "&.Mui-selected": {
                        color: "primary.main",
                        fontWeight: 600,
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            <Divider />

            <CardContent id="profile-tabs-content">
              <TabPanel value={value} index={0}>
                <PersonalTab employeeData={employeeData} />
                <AddressTab employeeData={employeeData} />
              </TabPanel>

              <TabPanel value={value} index={1}>
                <HiringTab
                  employeeData={employeeData}
                  onTerminateContract={handleTerminateContract}
                  onCreateNewContract={handleCreateNewContract}
                />
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
                <Box display="flex" justifyContent="space-between" mb={2} gap={1}>
                  <Box flex={1}>
                    <Typography variant="subtitle1" color="text.secondary">
                      HORARIO:
                    </Typography>

                    {employeeData.job_schedule_employee.length ? (
                      <Typography variant="subtitle1" fontWeight={600} mb={0.5} sx={{ whiteSpace: "pre-line" }}>
                        {formatScheduleText(employeeData.job_schedule_employee)}
                      </Typography>
                    ) : employeeData.job_schedule_calendar.length ? (
                      <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                        Ver en el calendario
                      </Typography>
                    ) : (
                      <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                        No tiene asignado
                      </Typography>
                    )}
                  </Box>

                  <Box flex={1} textAlign="right">
                    <Typography variant="subtitle1" color="text.secondary">
                      TIPO DE ASISTENCIA:
                    </Typography>

                    {employeeData.employee_attendance_type.length ? (
                      <Typography variant="subtitle1" fontWeight={600} mb={0.5} sx={{ whiteSpace: "pre-line" }}>
                        {employeeData.employee_attendance_type[0].attendance.display_name}
                      </Typography>
                    ) : (
                      <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                        No tiene asignado
                      </Typography>
                    )}
                  </Box>
                </Box>

                <CustomCalendarAttendance employeeData={employeeData} />
              </TabPanel>

              <TabPanel value={value} index={6}>
                <LocationScheduleTab employeeData={employeeData} />
              </TabPanel>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
      {openTerminateModal && (
        <TerminateContractModal
          open={openTerminateModal}
          hiring={selectedHiring}
          onClose={() => setOpenTerminateModal(false)}
          onSuccess={() => {
            setOpenTerminateModal(false);
            fetchEmployee();
          }}
        />
      )}

      {openCreateContractModal && (
        <CreateContractModal
          open={openCreateContractModal}
          employeeData={employeeData}
          categories={categories}
          employeeTypes={employeeTypes}
          secretarias={secretarias}
          onClose={() => setOpenCreateContractModal(false)}
          onSuccess={() => {
            setOpenCreateContractModal(false);
            fetchEmployee();
          }}
        />
      )}
    </PageContainer>
  );
};

export default Profile;
