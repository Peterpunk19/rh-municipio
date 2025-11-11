export interface WhereKeyConfig {
  path: string;
  field?: string;
  transform?: (value: any) => any;
}

export type WhereKey = string | WhereKeyConfig;
