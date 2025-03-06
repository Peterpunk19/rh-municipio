interface User {
  id: number;
  active: boolean;
  username: boolean;
  role_display_name: string;
  employee_id: number;
  name: string;
  paternal_last_name: string;
  maternal_last_name: string;
  gender_id: number;
}

interface UserPageProps {
  userData: User | null;
  onToggleStatus?: () => void;
}
