"use client";
import React from "react";
import { Card, CardContent, Typography, Box, Button, Grid2 } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import Link from "next/link";
import { catalogs, type Catalog } from "./_config";

const title = "Catálogos del Sistema";

const BCrumb = [
  {
    to: "/admin",
    title: "Inicio",
  },
  {
    title: "Catálogos",
  },
];

export default function Catalogs() {
  return (
    <PageContainer title={title} description={title}>
      <Breadcrumb title={title} items={BCrumb} />
      <Box>
        <Typography variant="body1" mb={4} color="textSecondary">
          Sección de referencia general que proporciona contexto sobre la información que se gestiona y utiliza en los
          diferentes módulos del sistema.
        </Typography>
        <Grid2 container spacing={3}>
          {Object.values(catalogs).map((catalog: Catalog) => {
            const Icon = catalog.icon;
            return (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={catalog.href}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        sx={{
                          backgroundColor: `${catalog.color}.light`,
                          borderRadius: "50%",
                          p: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        <Icon size={24} />
                      </Box>
                      <Typography variant="h6" component="div">
                        {catalog.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {catalog.description}
                    </Typography>
                    <Link href={catalog.href} passHref style={{ textDecoration: "none" }}>
                      <Button variant="outlined" color={catalog.color as any} fullWidth size="small">
                        Ver Catálogo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid2>
            );
          })}
        </Grid2>
      </Box>
    </PageContainer>
  );
}
