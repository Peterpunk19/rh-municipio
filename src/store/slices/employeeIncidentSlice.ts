import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Employee } from "@/app/api/interfaces/Employee";

interface EmployeeIncidentState {
  selectedEmployee: Employee | null;
}

const initialState: EmployeeIncidentState = {
  selectedEmployee: null,
};

export const employeeIncidentSlice = createSlice({
  name: "employeeIncident",
  initialState,
  reducers: {
    setSelectedEmployee: (state, action: PayloadAction<Employee>) => {
      state.selectedEmployee = action.payload;
    },
  },
});

export const { setSelectedEmployee } = employeeIncidentSlice.actions;
export default employeeIncidentSlice.reducer;
