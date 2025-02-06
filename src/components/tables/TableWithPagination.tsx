"use client";
import * as React from "react";
import { alpha, useTheme } from "@mui/material/styles";
import { format } from "date-fns";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import { useSelector, useDispatch } from "@/store/hooks";
import CustomCheckbox from "../theme-elements/CustomCheckbox";
import CustomSwitch from "../theme-elements/CustomSwitch";
import { IconDotsVertical } from "@tabler/icons-react";
import { HeadCell } from "@/interfaces/HeadCell";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";

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
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

interface TableProps<T> {
  headCells: readonly HeadCell[];
  items: T[];
  columnTypeConfig: Record<string, ColumnTypeConfig>;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const TableWithPagination = <T,>({ headCells, items, columnTypeConfig }: TableProps<T>) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("calories");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [rows, setRows] = React.useState<any>(items);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    setRows(items);
  }, [items]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(event);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: any
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n: any) => n.title);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const DynamicCell = ({ row, headCell }: { row: T; headCell: HeadCell }) => {
    const value = row[headCell.id as keyof T];
    const config = columnTypeConfig[headCell.id] || {};
  
    if (config.format) {
      return <>{config.format(value, row)}</>;
    }
  
    switch (config.renderType) {
      case "date":
        return (
          <Typography>
            {format(new Date(value as string), "E, MMM d yyyy")}
          </Typography>
        );
  
      case "boolean":
        return (
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                backgroundColor: value
                  ? 'green'
                  : 'red',
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
            <Avatar
              src={(row as any).photo}
              alt="avatar"
              sx={{ width: 56, height: 56 }}
            />
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
        return (
          <Tooltip title="Editar">
            <IconButton size="small">
              <IconDotsVertical size="1.1rem" />
            </IconButton>
          </Tooltip>
        );
  
      default:
        return headCell.numeric ? (
          <Typography align="right">{value as number}</Typography>
        ) : (
          <Typography>{value as string}</Typography>
        );
    }
  };

  return (
    <Box>
      <Box>
        <EnhancedTableToolbar
          numSelected={selected.length}
          search={search}
          handleSearch={(event: any) => handleSearch(event)}
        />
        <Paper
          variant="outlined"
          sx={{ mx: 2, mt: 1, border: `1px solid ${borderColor}` }}
        >
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={"medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={headCells}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any, index) => {
                    const isItemSelected = isSelected(row.title);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.title)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <CustomCheckbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        {headCells.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? "right" : "left"}
                            padding={
                              headCell.disablePadding ? "none" : "normal"
                            }
                          >
                            <DynamicCell row={row} headCell={headCell} />
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Registros por página"
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default TableWithPagination;
