"use client";

import * as React from "react";
import { redirect } from "next/navigation";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconDotsVertical } from "@tabler/icons-react";

const RowMenu = ({ row, redirectPath }: { row: any; redirectPath?: string }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack direction="row">
      <Tooltip title="Acciones">
        <IconButton size="small" onClick={handleClick}>
          <IconDotsVertical size="1.1rem" />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => redirect(`${redirectPath}${row.id}`)}>Ver</MenuItem>
        <MenuItem onClick={() => redirect(`${redirectPath}/edit/${row.id}`)}>Editar</MenuItem>
      </Menu>
    </Stack>
  );
};

export default RowMenu;
