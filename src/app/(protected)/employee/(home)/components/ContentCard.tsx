"use client";

import { CardContent, CardContentProps } from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";

interface ContentCardProps extends CardContentProps {
  children: React.ReactNode;
  maxHeight?: string;
}

export const ContentCard = ({ children, maxHeight = "calc(100vh - 140px)", ...props }: ContentCardProps) => (
  <BlankCard>
    <CardContent
      sx={{
        maxHeight,
        overflowY: "auto",
        p: 2,
      }}
      {...props}
    >
      {children}
    </CardContent>
  </BlankCard>
);
