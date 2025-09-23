"use client";

import * as React from "react";
import { redirect } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";

const EmployeeProfileCard = ({ employeeData }: EmployeePageProps) => {
  const DEFAULT_IMAGE_MALE: string = "/images/profile/user-1.jpg";
  const DEFAULT_IMAGE_FEMALE: string = "/images/profile/user-10.jpg";
  const REDIRECT_TO_EDIT = "/admin/employees/edit/";
  const FULL_NAME = `${employeeData.name} ${employeeData.paternal_last_name} ${employeeData.maternal_last_name}`;

  return (
    <Box display={"flex"} alignItems="center" gap="10px" p={3} width={"100%"}>
      <Avatar
        alt={`${employeeData.name} ${employeeData.paternal_last_name} ${employeeData.maternal_last_name}`}
        src={employeeData.gender_id === 1 ? DEFAULT_IMAGE_FEMALE : DEFAULT_IMAGE_MALE}
        sx={{ width: 84, height: 84 }}
      />
      <Box sx={{ display: "flex", marginLeft: "15px", flexDirection: "column" }}>
        <Typography variant="body1" fontWeight={600}>
          {FULL_NAME}
        </Typography>
        <Typography variant="body2">{employeeData?.employee_ascriptions[0]?.category?.display_name}</Typography>
        <Typography variant="body2">{employeeData?.employee_ascriptions[0]?.direccion?.display_name}</Typography>
        <Typography variant="body2">
          {employeeData?.employee_ascriptions[0]?.direccion?.secretaria?.display_name}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => redirect(`${REDIRECT_TO_EDIT}${employeeData.id}?name=${FULL_NAME}`)}
        startIcon={<EditIcon width={18} />}
        sx={{ ml: "auto" }}
      >
        Editar
      </Button>
    </Box>
  );
};

export default EmployeeProfileCard;
