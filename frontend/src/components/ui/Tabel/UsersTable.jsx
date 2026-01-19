import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { TableVirtuoso } from "react-virtuoso";

const columns = [
  { label: "Name", dataKey: "name", minWidth: 220 },
  { label: "Email", dataKey: "email", minWidth: 320 },
  { label: "Role", dataKey: "role", minWidth: 140 },
  { label: "Status", dataKey: "isActive", minWidth: 140 },
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ width: "100%", tableLayout: "auto" }} />
  ),
  TableHead,
  TableRow,
  TableBody,
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            padding: "18px",
            minWidth: column.minWidth,
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

export default function UsersTable({ users }) {
  const navigate = useNavigate();

  function rowContent(index, row) {
    return columns.map((column) => (
      <TableCell
        key={column.dataKey}
        onClick={() => navigate(`/user/${row._id}`)}
        sx={{
          padding: "20px",
          fontSize: "0.95rem",
          cursor: "pointer",
          minWidth: column.minWidth,
        }}
      >
        {column.dataKey === "isActive"
          ? row.isActive
            ? "Active"
            : "Pending"
          : row[column.dataKey]}
      </TableCell>
    ));
  }

  return (
    <Paper sx={{ width: "100%", height: { xs: 420, md: 650 } }}>
      <TableVirtuoso
        data={users}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
