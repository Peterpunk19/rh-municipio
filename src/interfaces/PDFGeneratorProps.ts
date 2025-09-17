import { ComponentType } from "react";

export interface PDFGeneratorProps {
  data: Record<string, any>;
  fileName?: string;
  title?: string;
  template: ComponentType<{ data: Record<string, any>; title?: string }>;
  buttonProps?: any;
  optionsConfig?: PDFOptionsConfig;
  buttonLabel?: string;
}

export interface PDFOption {
  label: string;
  value: string;
  fileName?: string;
  titleSuffix?: string;
}

export interface PDFOptionsConfig {
  displayMode: "dropdown" | "button";
  defaultOption?: string;
  options?: PDFOption[];
}
