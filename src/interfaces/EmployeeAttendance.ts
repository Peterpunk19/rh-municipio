export interface IEmployeeAttendanceDataById {
  employee: {
    number_employee: string;
    fullName: string;
    rfc: string;
    curp: string;
    category: { name: string };
  };
  organism_public: { display_name: string };
  organism_administrative: { display_name: string };
  type_attendance: { display_name: string };
  check_in: string;
  check_out: string;
  location: { display_name: string };
  description: string;
}
