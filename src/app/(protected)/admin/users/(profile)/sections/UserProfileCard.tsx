"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";

const UserProfileCard = ({ userData, onToggleStatus }: UserPageProps) => {
  const DEFAULT_IMAGE_MALE: string = "/images/profile/user-1.jpg";
  const DEFAULT_IMAGE_FEMALE: string = "/images/profile/user-10.jpg";
  return (
    <Box display={"flex"} alignItems="center" gap="10px" p={3} width={"100%"}>
      <Avatar
        alt={`${userData?.name} ${userData?.paternal_last_name} ${userData?.maternal_last_name}`}
        src={userData?.gender_id === 1 ? DEFAULT_IMAGE_FEMALE : DEFAULT_IMAGE_MALE}
        sx={{ width: 84, height: 84 }}
      />
      <Box sx={{ display: "flex", marginLeft: "15px", flexDirection: "column" }}>
        <Typography variant="body1" fontWeight={600}>
          {userData?.employee_id !== null
            ? `${userData?.name || ""} ${userData?.paternal_last_name || ""} ${userData?.maternal_last_name || ""}`.trim()
            : userData.username}
        </Typography>
        <Typography variant="body2">{userData?.role_display_name}</Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
        <Button variant="contained" color="primary" startIcon={<EditIcon width={18} />}>
          Editar
        </Button>
        <Button onClick={onToggleStatus} variant="contained" color={userData?.active ? "success" : "error"}>
          {userData?.active ? "Activo" : "Inactivo"}
        </Button>
      </Box>
    </Box>
  );
};

export default UserProfileCard;
