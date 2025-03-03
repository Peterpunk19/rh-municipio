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
import { useDebouncedCallback } from "use-debounce";
import { FiltersConfig } from "@/interfaces/FiltersConfig";
import { updateFilter } from "@/store/tables/FiltersSlice";
import { useDynamicFilters } from "../customHooks/useDinamycFilters";
import ParentCard from "@/app/components/shared/ParentCard";
import RowMenu from "./RowMenu";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array?.map((el, index) => [el, index] as [T, number]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  });

  return stabilizedThis?.map((el) => el[0]);
}

interface TableProps<T> {
  title: string;
  headCells: readonly HeadCell[];
  items: T[];
  columnTypeConfig: Record<string, ColumnTypeConfig>;
  handleSearch: (searchQuery: string) => void;
  filtersConfig: () => FiltersConfig[];
  entity: string;
  emptyMessage: string;
}
const TableWithPagination = <T,>({
  title,
  headCells,
  items,
  columnTypeConfig,
  handleSearch,
  filtersConfig,
  entity,
  emptyMessage,
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
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("id");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [search, setSearch] = React.useState("");

  const debounced = useDebouncedCallback((searchTerm: string) => {
    handleSearch(searchTerm);
  }, 400);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    debounced(value);
  };

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = items.map((n: any) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(event.target.value, 10);
    dispatch(updateLimit(newLimit));
    dispatch(updatePage(1));
  };

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, obj);
  };

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
          <Typography>
            {value === null || value === undefined ? (empty_text ? empty_text : (value as string)) : (value as string)}
          </Typography>
        );
    }
  };

  return (
    <ParentCard title={title}>
      <EnhancedTableToolbar
        numSelected={selected.length}
        search={search}
        setSearch={setSearch}
        handleSearch={(event: any) => handleSearchInput(event)}
        filters={filters.map((filter) => ({
          key: filter.key,
          label: filter.label,
          type: filter.type,
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
      <Paper variant="outlined" sx={{ mx: 2, mt: 1, border: `1px solid ${borderColor}` }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={total}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(items, getComparator(order, orderBy))?.map((row: any, index) => {
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
      </Paper>
    </ParentCard>
  );
};

export default TableWithPagination;
