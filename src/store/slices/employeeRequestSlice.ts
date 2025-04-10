import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Employee } from '@/app/api/interfaces/Employee';
import type { JobScheduleEmployee } from '@/app/api/interfaces/JobScheduleEmployee';

interface EmployeeRequestState {
  selectedEmployee: Employee | null;
  jobSchedule: JobScheduleEmployee | null;
  // ... existing state properties ...
}

const initialState: EmployeeRequestState = {
  selectedEmployee: null,
  jobSchedule: null,
  // ... existing initial state ...
};

export const employeeRequestSlice = createSlice({
  name: 'employeeRequest',
  initialState,
  reducers: {
    setSelectedEmployee: (state, action: PayloadAction<Employee>) => {
      state.selectedEmployee = action.payload;
    },
    setJobSchedule: (state, action: PayloadAction<JobScheduleEmployee>) => {
      state.jobSchedule = action.payload;
    },
    // ... existing reducers ...
  },
});

export const { setSelectedEmployee, setJobSchedule } = employeeRequestSlice.actions;
export default employeeRequestSlice.reducer; 