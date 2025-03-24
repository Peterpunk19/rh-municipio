"use client";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import { format } from "date-fns";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "@/store/hooks";
import { HeadCell } from "@/interfaces/HeadCell";
import EnhancedTableHead from "./TableHeaders";
import EnhancedTableToolbar from "./TableFilters";
import { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";
import { updatePage, updateLimit } from "@/store/tables/PaginationSlice";
import { RootState } from "@/store/store";
import { FiltersConfig } from "@/interfaces/FiltersConfig";
import { updateFilter } from "@/store/tables/FiltersSlice";
import { useDynamicFilters } from "../customHooks/useDinamycFilters";
import ParentCard from "@/components/shared/cards/ParentCard";
import RowMenu from "./RowMenu";
import TableRenderCell from "./TableRenderCell";
import { getNestedValue } from "@/common/utils";

interface TableProps<T> {
  title: string;
  headCells: readonly HeadCell[];
  items: T[];
  columnTypeConfig: Record<string, ColumnTypeConfig>;
  filtersConfig: () => FiltersConfig[];
  entity: string;
  emptyMessage: string;
  createLink?: JSX.Element | JSX.Element[];
  children?: React.ReactNode;
}

const TableWithPagination = <T,>({
  headCells,
  items,
  columnTypeConfig,
  filtersConfig,
  entity,
  emptyMessage,
  createLink,
  children,
}: TableProps<T>) => {
  const dispatch = useDispatch();
  const { page, limit, total } = useSelector((state: RootState) => state.pagination);

  React.useEffect(() => {
    const maxPage = Math.ceil(total / limit);
    if (page > maxPage) {
      dispatch(updatePage(1));
    }
  }, [total, limit, page, dispatch]);

  const labelDisplayedRows = ({ from, to, count }: { from: number; to: number; count: number }) => {
    if (count === 0) return "0-0 de 0";

    const adjustedFrom = (page - 1) * limit + 1;
    const adjustedTo = Math.min(page * limit, count);

    return `${adjustedFrom}–${adjustedTo} de ${count}`;
  };
  const { values: initialValuesFromRedux } = useSelector((state: RootState) => state.filters[entity]);

  const { filters, selectedValues, handleFilterChange } = useDynamicFilters(filtersConfig(), initialValuesFromRedux);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(updateLimit(newLimit));
    dispatch(updatePage(1));
  };

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const DynamicCell = ({ row, headCell }: { row: T; headCell: HeadCell }) => {
    const value = getNestedValue(row, headCell.id);
    const config = columnTypeConfig[headCell.id] || {};
    const empty_text = headCell.empty_text;
    const redirectPath = config.redirectPath;

    if (config.format) {
      return <>{config.format(value, row)}</>;
    }

    switch (config.renderType) {
      case "date":
        return <Typography>{format(new Date(value as string), "dd/MM/yyyy")}</Typography>;

      case "boolean":
        return (
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                backgroundColor: value ? "green" : "red",
                borderRadius: "100%",
                height: "10px",
                width: "10px",
              }}
            />
            <Typography color="textSecondary" variant="subtitle2" sx={{ ml: 1 }}>
              {value ? "Activo" : "Inactivo"}
            </Typography>
          </Box>
        );

      case "currency":
        return (
          <Typography fontWeight={600} variant="h6">
            ${value as number}
          </Typography>
        );

      case "avatar":
        return (
          <Box display="flex" alignItems="center">
            <Avatar src={(row as any).photo} alt="avatar" sx={{ width: 56, height: 56 }} />
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" fontWeight="600">
                {(row as any).title}
              </Typography>
              <Typography color="textSecondary" variant="subtitle2">
                {(row as any).category}
              </Typography>
            </Box>
          </Box>
        );

      case "action":
        return <RowMenu row={row} redirectPath={redirectPath} />;

      default:
        return headCell.numeric ? (
          <Typography align="right">{value as number}</Typography>
        ) : (
          <TableRenderCell row={row} headCell={headCell} emptyText={empty_text} />
        );
    }
  };

  return (
    <Box>
      <ParentCard codeModel={createLink} entity={entity}>
        <EnhancedTableToolbar
          filters={filters.map((filter) => ({
            key: filter.key,
            label: filter.label,
            type: filter.type,
            gridSize: filter.gridSize,
            options: filter.options || [],
            value: selectedValues[filter.key],
            onChange: (value: any) => {
              dispatch(
                updateFilter({
                  entity: entity,
                  key: filter.key,
                  value: value,
                }),
              );
              handleFilterChange(filter.key, value);
            },
          }))}
          entity={entity}
        />
        {children}
        <Paper variant="outlined" sx={{ mt: 1, border: `1px solid ${borderColor}` }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
              <EnhancedTableHead headCells={headCells} />
              <TableBody>
                {items.map((row: any) => {
                  return (
                    <TableRow hover tabIndex={-1} key={row.id}>
                      {headCells.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align={headCell.numeric ? "right" : "left"}
                          padding={headCell.disablePadding ? "none" : "normal"}
                        >
                          <DynamicCell row={row} headCell={headCell} />
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}

                {emptyMessage && items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={headCells.length} style={{ width: "100%" }}>
                      <div className="w-full min-h-[200px] flex justify-center items-center">
                        <h3>{emptyMessage}</h3>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box p={2} sx={{ width: "50%" }}>
              Total: {total}
            </Box>
            <Box p={2} sx={{ width: "50%" }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total}
                rowsPerPage={limit}
                page={total === 0 ? 0 : Math.min(page - 1, Math.ceil(total / limit) - 1)}
                onPageChange={(event, newPage) => {
                  dispatch(updatePage(newPage + 1));
                }}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Registros por página"
                labelDisplayedRows={labelDisplayedRows}
              />
            </Box>
          </Box>
        </Paper>
      </ParentCard>
    </Box>
  );
};

export default TableWithPagination;
