import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "@/app/api/interfaces/Employee";

interface EmployeeAttendanceState {
  selectedEmployee: Employee | null;
}

const initialState: EmployeeAttendanceState = {
  selectedEmployee: null,
};

export const employeeAttendanceSlice = createSlice({
  name: "employeeAttendance",
  initialState,
  reducers: {
    setSelectedEmployee: (state, action: PayloadAction<Employee>) => {
      state.selectedEmployee = action.payload;
    },
  },
});

export const { setSelectedEmployee } = employeeAttendanceSlice.actions;
export default employeeAttendanceSlice.reducer;
