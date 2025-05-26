import { ComponentType } from "react";

export interface PDFGeneratorProps {
  data: Record<string, any>;
  fileName?: string;
  title?: string;
  template: ComponentType<{ data: Record<string, any>; title: string }>;
  buttonProps?: any;
}
