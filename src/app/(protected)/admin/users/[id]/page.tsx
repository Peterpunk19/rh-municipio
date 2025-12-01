"use client";

import * as React from "react";
import {
  Grid2 as Grid,
  Tabs,
  Tab,
  Box,
  CardContent,
  Divider,
  Button,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import { StatusCodes } from "http-status-codes";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import PersonalTab from "../(profile)/sections/PersonalTab";
import SecurityTab from "../(profile)/sections/SecurityTab";
import UserProfileCard from "../(profile)/sections/UserProfileCard";
import { redirect, useParams } from "next/navigation";
import { changeStatusUser, getUserById } from "@/services/user";
import { IconUserCircle, IconLock } from "@tabler/icons-react";
import TabPanel from "@/components/shared/tabs/TabPanel";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { logger } from "@/lib/logger";

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
  const [userData, setUserData] = React.useState<User | null>(null);
  const { id } = useParams();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isChangeStatus, setIsChangeStatus] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isDisplayedAlert, setIsDisplayedAlert] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");

  React.useEffect(() => {
    try {
      if (id) {
        setLoading(true);
        getUserById(id as string).then((data) => {
          if (data.statusCode === StatusCodes.OK) {
            setUserData(data.responseObject);
          } else {
            setUserData(null);
            redirect("/admin/users");
          }
          setLoading(false);
        });
      }
    } catch (error: any) {
      logger.error({ error: error.message, stack: error.stack });
      setLoading(false);
      redirect("/admin/users");
    }
  }, [id]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!userData && !loading) return <div>Usuario no encontrado</div>;
  if (loading) return <div>Cargando...</div>;

  const handleToggleStatus = () => {
    setOpenDialog(true);
  };

  const handleCancel = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    setIsChangeStatus(true);
    try {
      if (userData) {
        const response = await changeStatusUser({ user_id: userData.id });
        if (response.success) {
          setIsSuccess(true);
          setIsDisplayedAlert(true);
          setResponseMessage(response.message);
          setUserData((previousUser) => {
            if (previousUser) {
              return {
                ...previousUser,
                active: !previousUser.active,
              };
            }
            return previousUser;
          });
        } else {
          setIsSuccess(false);
          setIsDisplayedAlert(true);
          setResponseMessage(response.message);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsChangeStatus(false);
      setOpenDialog(false);
    }
  };

  return (
    !loading && (
      <Grid container spacing={3}>
        <Breadcrumb title="Perfil del usuario" items={BCrumb} />
        <BlankCard>
          <Snackbar
            open={isDisplayedAlert}
            autoHideDuration={3000}
            onClose={() => setIsDisplayedAlert(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => setIsDisplayedAlert(false)}
              severity={isSuccess ? "success" : "error"}
              variant="filled"
            >
              <Typography variant="body1" fontWeight={600}>
                {responseMessage}
              </Typography>
            </Alert>
          </Snackbar>
          <UserProfileCard userData={userData} onToggleStatus={handleToggleStatus} />
        </BlankCard>
        <Grid size={12}>
          <BlankCard>
            <Box sx={{ maxWidth: { xs: 440, sm: 600 } }}>
              <Tabs value={value} onChange={handleChange} scrollButtons="auto" aria-label="profile tabs">
                <Tab
                  iconPosition="start"
                  icon={<IconUserCircle size="22" />}
                  label="Datos Personales"
                  {...a11yProps(0)}
                />
                <Tab
                  iconPosition="start"
                  icon={<IconLock size="22" />}
                  label="Seguridad"
                  {...a11yProps(1)}
                />
              </Tabs>
            </Box>
            <Divider />
            <CardContent>
              <TabPanel value={value} index={0}>
                <PersonalTab userData={userData} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <SecurityTab userData={userData} />
              </TabPanel>
            </CardContent>
          </BlankCard>
        </Grid>

        <Dialog open={openDialog} maxWidth="md" disableEscapeKeyDown>
          <DialogTitle id="alert-dialog-title" variant="h5">
            {"Cambio de estatus del usuario"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Está seguro que desea cambiar el estado del usuario de {userData?.active ? "activo" : "inactivo"} a{" "}
              {userData?.active ? "inactivo" : "activo"}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleConfirm} autoFocus disabled={isChangeStatus}>
              Continuar
            </Button>
            <Button color="error" onClick={handleCancel} disabled={isChangeStatus}>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    )
  );
};

export default Profile;
