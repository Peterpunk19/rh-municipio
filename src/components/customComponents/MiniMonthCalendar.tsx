import { Box, Typography } from "@mui/material";

type MiniMonthCalendarProps = {
  year: number;
  month: number;
  selectedDates: string[];
  onToggleDate?: (date: string) => void;
};

export const MiniMonthCalendar = ({
                                    year,
                                    month,
                                    selectedDates,
                                    onToggleDate
                                  }: MiniMonthCalendarProps) => {
  const firstDay = new Date(year, month, 1, 12);
  const lastDay = new Date(year, month + 1, 0, 12);

  const daysInMonth = lastDay.getDate();
  const startWeekDay = firstDay.getDay(); // 0 = domingo

  const isInteractive = Boolean(onToggleDate);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        p: 1.5,
        backgroundColor: "background.paper",
        minHeight: 230,
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight={600}
        textAlign="center"
        mb={1}
      >
        {firstDay
          .toLocaleDateString("es-MX", {
            month: "long",
            year: "numeric",
          })
          .toUpperCase()}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 0.5,
          justifyItems: "center",
        }}
      >
        {/* offset */}
        {Array.from({ length: startWeekDay }).map((_, i) => (
          <Box key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = new Date(year, month, day, 12)
            .toISOString()
            .split("T")[0];
          const selected = selectedDates.includes(iso);

          return (
            <Box
              key={iso}
              onClick={isInteractive ? () => onToggleDate?.(iso) : undefined}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: selected ? "primary.main" : "transparent",
                color: selected ? "primary.contrastText" : "text.secondary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                cursor: isInteractive ? "pointer" : "default",
                transition: "all 0.15s ease",

                "&:hover": isInteractive
                  ? {
                    bgcolor: selected ? "primary.dark" : "action.hover",
                  }
                  : undefined,
              }}
            >
              {day}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
