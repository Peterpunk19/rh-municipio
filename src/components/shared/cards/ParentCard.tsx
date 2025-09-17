"use client";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { Card, CardContent, Divider, Box, Grid2 as Grid, CardHeader } from "@mui/material";
import { useDispatch, useSelector } from "@/store/hooks";
import { AppState, type RootState } from "@/store/store";
import CustomSearchTableField from "@/components/customFields/CustomSearchTableField";
import IconButton from "@mui/material/IconButton";
import { IconFilter } from "@tabler/icons-react";
import Tooltip from "@mui/material/Tooltip";
import { updateFilterOpen } from "@/store/tables/FiltersSlice";
type Props = {
  entity: string;
  footer?: string | JSX.Element;
  codeModel?: JSX.Element | JSX.Element[];
  children: JSX.Element;
  showSearchBar?: boolean;
};

const ParentCard = ({ children, footer, codeModel, entity, showSearchBar: showSearchBarProp }: Props) => {
  const dispatch = useDispatch();
  const { filterOpen, showSearchBar } = useSelector(
    (state: RootState) => state.filters[entity] || { filterOpen: false, showSearchBar: true },
  );
  const enableSearchBar = typeof showSearchBarProp === "boolean" ? showSearchBarProp : showSearchBar;

  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const handleFilterClick = () => {
    dispatch(updateFilterOpen({ entity, filterOpen: !filterOpen }));
  };

  return (
    <>
      <Box
        sx={{
          pb: 2,
        }}
      >
        <Grid container spacing={3}>
          <Grid key="search-field-toolbar" size={{ xs: 12, sm: 12, lg: codeModel ? 10 : 12 }}>
            {enableSearchBar && <CustomSearchTableField entity={entity} />}
          </Grid>
          <Grid
            key="button-toolbar"
            size={{ xs: 12, sm: 12, lg: 2 }}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {codeModel}
          </Grid>
        </Grid>
      </Box>
      <Card
        sx={{
          padding: 0,
          border: !customizer.isCardShadow ? `1px solid ${borderColor}` : "none",
        }}
        elevation={customizer.isCardShadow ? 9 : 0}
        variant={!customizer.isCardShadow ? "outlined" : undefined}
      >
        <CardHeader
          sx={{
            pl: 3,
            pt: 1.5,
            pb: 1.5,
          }}
          title="Filtros"
          slotProps={{
            title: {
              sx: { fontSize: "1.5rem", fontWeight: "bold" },
            },
          }}
          action={
            <Tooltip title="Lista de filtros">
              <IconButton
                onClick={handleFilterClick}
                sx={{
                  color: filterOpen ? "primary.main" : "text.secondary",
                }}
              >
                <IconFilter size="1.2rem" />
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />

        <CardContent>{children}</CardContent>
        {footer ? (
          <>
            <Divider />
            <Box p={3}>{footer}</Box>
          </>
        ) : (
          ""
        )}
      </Card>
    </>
  );
};

export default ParentCard;
