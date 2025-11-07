"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Box,
  IconButton,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller, DefaultValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiltersConfig } from "@/interfaces/FiltersConfig";

export interface ColumnConfig<T> {
  id: string;
  header: string;
  type?: "text" | "number" | "currency" | "select" | "date";
  options?: { value: any; label: string }[];
  editable?: boolean;
  renderCell?: (row: T, isEditing: boolean, form: any) => React.ReactNode;
  validation?: any;
  width?: string | number;
  align?: "left" | "center" | "right";
}

interface EditableTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onSave: (data: T) => Promise<boolean>;
  loading?: boolean;
  defaultValues?: Partial<T>;
  validationSchema?: z.ZodSchema<any>;
  uniqueId?: string;
  filtersConfig: () => FiltersConfig[];
  entity: string;
  emptyMessage: string;
  showSearchBar?: boolean;
  total: number;
  page: number;
  limit: number;
}

export const EditableTable = <T extends Record<string, any>>({
  data,
  columns,
  onSave,
  loading = false,
  defaultValues = {},
  validationSchema,
  uniqueId = "id",
  emptyMessage,
}: EditableTableProps<T>) => {
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValuesWithId = useMemo(
    () => ({
      ...defaultValues,
      [uniqueId]: "",
    }),
    [defaultValues, uniqueId],
  );

  const resolver = validationSchema ? zodResolver(validationSchema) : undefined;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T>({
    defaultValues: defaultValuesWithId as unknown as DefaultValues<T>,
    resolver,
  });

  const handleEdit = useCallback(
    (e: React.MouseEvent, row: T) => {
      e.preventDefault();
      e.stopPropagation();
      reset(row);
      setEditingId(row[uniqueId]);
    },
    [reset, uniqueId],
  );

  const handleCancel = useCallback(() => {
    reset();
    setEditingId(null);
  }, [reset]);

  const onSubmit: SubmitHandler<T> = async (formData) => {
    setIsSubmitting(true);
    try {
      const originalRow = data.find((r) => r[uniqueId] === editingId) || ({} as T);
      const success = await onSave({ ...(originalRow as T), ...formData });
      if (success) {
        setEditingId(null);
      }
      return success;
    } catch (error) {
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEditableCell = (column: ColumnConfig<T>, value: any, row: T, isEditing: boolean) => {
    const shouldRenderAsEditable = isEditing && column.editable !== false;

    if (!shouldRenderAsEditable) {
      if (column.type === "currency") {
        return new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(Number(value) || 0);
      }
      return value;
    }

    if (column.renderCell) {
      return column.renderCell(row, true, control);
    }

    const fieldName = column.id as keyof T;
    const error = errors[fieldName];

    if (column.type === "select" && column.options) {
      return (
        <Controller
          name={fieldName as any}
          control={control}
          render={({ field }) => (
            <Select {...field} size="small" fullWidth error={!!error} sx={{ minWidth: 120 }}>
              {column.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      );
    }

    return (
      <Controller
        name={fieldName as any}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            size="small"
            fullWidth
            type={column.type === "number" || column.type === "currency" ? "number" : "text"}
            error={!!error}
            helperText={error?.message as string}
            inputProps={{
              step: column.type === "currency" ? "0.01" : undefined,
              min: 0,
            }}
          />
        )}
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit)();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  sx={{
                    fontWeight: "bold",
                    width: column.width || "auto",
                    textAlign: column.align || "left",
                  }}
                >
                  {column.header}
                </TableCell>
              ))}
              <TableCell
                sx={{
                  width: 150,
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                ACCIONES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const isEditing = editingId === row[uniqueId];
                return (
                  <TableRow key={String(row[uniqueId])} data-row-id={String(row[uniqueId])}>
                    {columns.map((column) => (
                      <TableCell
                        key={String(column.id)}
                        sx={{
                          width: column.width || "auto",
                          textAlign: column.align || "left",
                        }}
                      >
                        {isEditing && column.editable !== false
                          ? renderEditableCell(column, row[column.id as keyof T], row, true)
                          : column.renderCell
                            ? column.renderCell(row, false, control)
                            : renderEditableCell(column, row[column.id as keyof T], row, false)}
                      </TableCell>
                    ))}
                    <TableCell sx={{ textAlign: "right" }}>
                      {isEditing ? (
                        <>
                          <IconButton
                            type="submit"
                            size="small"
                            color="primary"
                            disabled={isSubmitting}
                            aria-label="Guardar cambios"
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            type="button"
                            aria-label="Cancelar edición"
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => handleEdit(e, row)}
                          disabled={!!editingId}
                          type="button"
                          aria-label="Editar fila"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </form>
  );
};
