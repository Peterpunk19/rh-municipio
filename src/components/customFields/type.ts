export interface CustomAutocompleteProps {
  field: {
    url: string;
    label: string;
    value: string | null | undefined;
  };
  initialOption?: any;
  handleChange: (event: React.SyntheticEvent<Element, Event> | null, value: any) => void;
}
