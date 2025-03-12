"use client";
import React from "react";
import { Grid2 as Grid, Typography, Box, Breadcrumbs, Theme } from "@mui/material";
import Link from "next/link";

import { IconChevronRight } from "@tabler/icons-react";

interface BreadCrumbType {
  subtitle?: string;
  items?: any[];
  title: string;
}

const Breadcrumb = ({ subtitle, items, title }: BreadCrumbType) => (
  <Grid
    container
    sx={{
      p: "5px 5px 5px",
      position: "relative",
      overflow: "hidden",
      width: "100%",
    }}
  >
    <Grid
      mb={1}
      size={{
        xs: 12,
        sm: 6,
        lg: 8,
      }}
    >
      <Breadcrumbs
        separator={<IconChevronRight size="10" style={{ margin: "0 5px" }} />}
        sx={{ alignItems: "center", mt: items ? "10px" : "" }}
        aria-label="breadcrumb"
      >
        {items
          ? items.map((item) => (
              <div key={item.title}>
                {item.to ? (
                  <Link href={item.to} passHref>
                    <Typography color="textDisabled">{item.title}</Typography>
                  </Link>
                ) : (
                  <Typography color="textPrimary">{item.title}</Typography>
                )}
              </div>
            ))
          : ""}
      </Breadcrumbs>
      <Typography variant="h3" mt={1}>
        {title}
      </Typography>
      <Typography color="textSecondary" variant="h6" fontWeight={400} mt={0.8} mb={0}>
        {subtitle}
      </Typography>
    </Grid>
  </Grid>
);

export default Breadcrumb;
