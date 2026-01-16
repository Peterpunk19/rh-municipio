import { Typography, Box } from "@mui/material";

export function InfoItem({
                           label,
                           value,
                         }: {
  label: string;
  value?: React.ReactNode;
}) {
  if (!value) return null;

  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="subtitle1" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
