import PageContainer from "@/app/components/container/PageContainer";
import { Box, Button, CardContent, Divider, Grid2 as Grid, Stack, Typography } from "@mui/material";
import BlankCard from "@/app/components/shared/BlankCard";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Faq = () => {
  return (
    <PageContainer title="FAQ" description="this is FAQ">
      <Grid container spacing={3} justifyContent="center">
        <Grid
          size={{
            xs: 12,
            sm: 12,
            lg: 4,
            xl: 3,
          }}
        >
          <BlankCard>
            <CardContent sx={{ p: "32px" }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h4" fontSize="20px" fontWeight={600}>
                  Administrador
                </Typography>
              </Box>

              <Typography fontSize="13px" mb={4}>
                Use for single end product which end users can’t be charged for.
              </Typography>
              <Divider />
              <Stack my={4} gap="12px">
                <Box display="flex" alignItems="center" gap="8px">
                  <Image src="/images/frontend-pages/icons/icon-check.svg" alt="circle" width={20} height={20} />
                  <Typography fontSize="14px" fontWeight={500}>
                    Full source code
                  </Typography>
                </Box>
              </Stack>
              <Button component={Link} href="/help-center/admin/articles" fullWidth variant="contained" size="large">
                Entrar
              </Button>
            </CardContent>
          </BlankCard>
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 12,
            lg: 4,
            xl: 3,
          }}
        >
          <BlankCard>
            <CardContent sx={{ p: "32px" }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h4" fontSize="20px" fontWeight={600}>
                  Empleado
                </Typography>
              </Box>

              <Typography fontSize="13px" mb={4}>
                Use for single end product which end users can’t be charged for.
              </Typography>
              <Divider />
              <Stack my={4} gap="12px">
                <Box display="flex" alignItems="center" gap="8px">
                  <Image src="/images/frontend-pages/icons/icon-check.svg" alt="circle" width={20} height={20} />
                  <Typography fontSize="14px" fontWeight={500}>
                    Full source code
                  </Typography>
                </Box>
              </Stack>
              <Button fullWidth variant="contained" size="large">
                Entrar
              </Button>
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Faq;
