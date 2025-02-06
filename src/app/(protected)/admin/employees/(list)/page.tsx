'use client'
import React, { useEffect } from 'react';
import TableWithPagination from "@/components/tables/TableWithPagination";
import { EmployeeType } from "@/types/EmployeeType";
import { useSelector } from '@/store/hooks';
import { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";
import { useDispatch } from 'react-redux';
import { fetchEmployees } from '@/store/employees/EmployeesFiltersSlice';
import { AppDispatch } from '@/store/store';
import { headCells } from './HeadCells';

export default function Employees () {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchEmployees(''));
  }, [dispatch]);

  const columnTypeConfig: Record<string, ColumnTypeConfig> = {
    name: { renderType: 'text' },
    paternal_last_name: { renderType: 'text' },
    maternal_last_name: { renderType: 'text' },
    number_employee: { renderType: 'text' },
    actions: { renderType: 'action' }
  };

  const items: EmployeeType[] = useSelector((state) => state.filterEmployeesSlice.employees);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    useSelector((state) => state.filterEmployeesSlice.search = e.target.value);
  }
  return (
    <div>
      <h1>Empleados</h1>
      <TableWithPagination headCells={headCells} items={items} columnTypeConfig={columnTypeConfig} handleSearch={handleSearch} />
    </div>
  )
}
