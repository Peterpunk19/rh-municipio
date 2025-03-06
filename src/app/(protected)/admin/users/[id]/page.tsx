"use client";

import * as React from "react";
import { Grid2 as Grid, Tabs, Tab, Box, CardContent, Divider } from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import { StatusCodes } from "http-status-codes";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PersonalTab from "../(profile)/sections/PersonalTab";
import UserProfileCard from "../(profile)/sections/UserProfileCard";
import { useParams } from "next/navigation";
import { getUserById } from "@/services/user";
import { IconUserCircle } from "@tabler/icons-react";
import TabPanel from "@/components/shared/tabs/TabPanel";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const BCrumb = [
  {
    to: "/admin/users",
    title: "Usuarios",
  },
  {
    title: "Perfil del usuario",
  },
];

const Profile = () => {
  const [value, setValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [userData, setUserData] = React.useState<any>(null);
  const { id } = useParams();

  React.useEffect(() => {
    try {
      if (id) {
        setLoading(true);
        getUserById(id as string).then((data) => {
          if (data.statusCode === StatusCodes.OK) {
            setUserData(data.responseObject);
          } else {
            setUserData(null);
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

  if (!userData && !loading) return <div>Usuario no encontrado</div>;
  if (loading) return <div>Cargando...</div>;

  return (
    !loading && (
      <Grid container spacing={3}>
        <Breadcrumb title="Perfil del usuario" items={BCrumb} />
        <BlankCard>
          <UserProfileCard userData={userData} />
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
              </Tabs>
            </Box>
            <Divider />
            <CardContent>
              <TabPanel value={value} index={0}>
                <PersonalTab userData={userData} />
              </TabPanel>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    )
  );
};

export default Profile;
