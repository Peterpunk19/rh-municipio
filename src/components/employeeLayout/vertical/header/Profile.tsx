import React, { useState } from "react";
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton } from "@mui/material";

import { Stack } from "@mui/system";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutOutlined } from "@mui/icons-material";
import { signOut } from "next-auth/react";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [closingSession, setClosingSession] = useState(false);
  const loggedUser = useCurrentUser();
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const logout = async () => {
    setClosingSession(true);
    await signOut();
  };

  return (
    <Box>
      <IconButton
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={"/images/profile/user-1.jpg"}
          alt={"ProfileImg"}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
            p: 4,
          },
        }}
      >
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar src={"/images/profile/user-1.jpg"} alt={"ProfileImg"} sx={{ width: 95, height: 95 }} />
          <Box>
            <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
              {loggedUser?.user?.name}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {loggedUser?.user?.role_display_name}
            </Typography>
            <Typography variant="subtitle2" color="textPrimary" display="flex" alignItems="center" gap={1}>
              Número de empleado: {loggedUser?.user?.number_employee}
            </Typography>
          </Box>
        </Stack>
        <Divider />

        <Box mt={2}>
          <Button onClick={() => logout()} variant="outlined" color="primary" component={Button} fullWidth>
            <LogoutOutlined style={{ marginRight: 5 }} />
            {closingSession ? "Cerrando sesión..." : "Cerrar sesión"}
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;