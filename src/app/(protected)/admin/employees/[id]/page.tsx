"use client";

import * as React from "react";
import { Grid2 as Grid, Tabs, Tab, Box, CardContent, Divider } from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import { IconArticle, IconBell, IconUserCircle } from "@tabler/icons-react";
import { StatusCodes } from "http-status-codes";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";

import PersonalTab from "../(profile)/sections/PersonalTab";
import AddressTab from "../(profile)/sections/AddressTab";
import HiringTab from "../(profile)/sections/HiringTab";
import EmployeeProfileCard from "../(profile)/sections/EmployeeProfileCard";
import { useParams } from "next/navigation";
import { getEmployeeById } from "@/services/employees";

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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const BCrumb = [
  {
    to: "/admin/employees",
    title: "Empleados",
  },
  {
    title: "Perfil del empleado",
  },
];
const Profile = () => {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [employeeData, setEmployeeData] = React.useState<any>(null);
  const { id } = useParams();

  React.useEffect(() => {
    try {
      if (id) {
        setLoading(true);
        getEmployeeById(id as string).then((data) => {
          if (data.statusCode === StatusCodes.OK) {
            setEmployeeData(data.responseObject);
          } else {
            setEmployeeData(null);
          }
          setLoading(false);
        });
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }, [id]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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
            <Box sx={{ maxWidth: { xs: 440, sm: 600 } }}>
              <Tabs value={value} onChange={handleChange} scrollButtons="auto" aria-label="profile tabs">
                <Tab
                  iconPosition="start"
                  icon={<IconUserCircle size="22" />}
                  label="Datos personales"
                  {...a11yProps(0)}
                />

                <Tab iconPosition="start" icon={<IconBell size="22" />} label="Datos de domicilio" {...a11yProps(1)} />
                <Tab
                  iconPosition="start"
                  icon={<IconArticle size="22" />}
                  label="Datos de contratación"
                  {...a11yProps(2)}
                />
              </Tabs>
            </Box>
            <Divider />
            <CardContent>
              <TabPanel value={value} index={0}>
                <PersonalTab employeeData={employeeData} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <AddressTab employeeData={employeeData} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <HiringTab employeeData={employeeData} />
              </TabPanel>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    )
  );
};

export default Profile;
