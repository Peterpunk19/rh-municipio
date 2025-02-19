"use client";
import { Grid2 as Grid, Typography } from "@mui/material";

type Props = {
  displayData: any[];
  title?: string;
};

const Tab = ({ displayData, title }: Props) => {
  return (
    <>
      <h3>{title}</h3>
      {displayData.map((item, index) => (
        <Grid container item xs={12} key={index}>
          <Grid size={3}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: "text.secondary",
                width: "100%",
                textAlign: "left",
              }}
            >
              {item.label}
            </Typography>
          </Grid>
          <Grid size={9}>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                fontWeight: 600,
                width: "100%",
                textAlign: "left",
              }}
            >
              <b>{item.value}</b>
            </Typography>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default Tab;
