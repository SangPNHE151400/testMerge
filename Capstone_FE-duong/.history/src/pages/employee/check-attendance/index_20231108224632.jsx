import { Box, IconButton } from "@mui/material"
import Header from "../../../components/Header"
import DataTableCheckAttendance from "./components/DataTable"
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axios-config";
import { BASE_URL } from "../../../services/constraint";
import { useSelector } from "react-redux";
import AttendanceDetailModal from "./components/AttedanceDetailModal";

import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const items = [
  { id: 1, item: 'Paperclip', quantity: 100, price: 1.99 },
  { id: 2, item: 'Paper', quantity: 10, price: 30 },
  { id: 3, item: 'Pencil', quantity: 100, price: 1.25 },
];
const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
const rows = [
  ...items,
  { id: 'TOTAL', label: 'Total', total: 686.4 },
];

const baseColumnOptions = {
  sortable: false,
  pinnable: false,
  hideable: false,
};


const columns = [
  {
    field: 'item',
    headerName: 'Item/Description',
    ...baseColumnOptions,
    flex: 3,
    colSpan: ({ row }) => {
      if ( row.id === 'TOTAL') {
        return 1;
      }
      return undefined;
    },
    valueGetter: ({ value, row }) => {
      if (row.id === 'TOTAL') {
        return row.label;
      }
      return value;
    },
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    ...baseColumnOptions,
    flex: 1,
    sortable: false,
    valueGetter: ({ row, value }) => {
      if (row.id === 'TOTAL') {
        return `${row.total}`;
      }
      return value;
    },
  },
  {
    field: 'price',
    headerName: 'Price',
    flex: 1,
    ...baseColumnOptions,
    valueGetter: ({ row, value }) => {
      if (row.id === 'TOTAL') {
        return `${row.total}`;
      }
      return value;
    },
  },
  {
    field: 'total',
    headerName: 'Total',
    flex: 1,
    ...baseColumnOptions,
    valueGetter: ({ row }) => {
      if (row.id === 'TOTAL') {
        return row.total;
      }
      return row.price * row.quantity;
    },
  },
];

const getCellClassName = ({ row, field }) => {
  if (row.id === 'SUBTOTAL' || row.id === 'TOTAL' || row.id === 'TAX') {
    if (field === 'item') {
      return 'bold';
    }
  }
  return '';
};

export default function CheckAttendance() {
  return (
    <Box
      sx={{
        width: '100%',
        '& .bold': {
          fontWeight: 600,
        },
      }}
    >
      <DataGrid
        autoHeight
        disableColumnFilter
        disableRowSelectionOnClick
        hideFooter
        showCellVerticalBorder
        showColumnVerticalBorder
        getCellClassName={getCellClassName}
        columns={columns}
        rows={rows}
      />
    </Box>
  );
}
