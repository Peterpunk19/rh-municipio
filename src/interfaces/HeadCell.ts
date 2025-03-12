export interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  concatValues?: any[];
  numeric: boolean;
  empty_text?: string;
  children?: HeadCell[];
}
