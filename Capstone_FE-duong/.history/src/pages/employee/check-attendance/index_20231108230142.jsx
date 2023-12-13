import { Box, Button, IconButton, Typography } from '@mui/material'
import Header from '../../../components/Header'
import DataTableCheckAttendance from './components/DataTable'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { useEffect, useState } from 'react'
import axiosClient from '../../../utils/axios-config'
import { BASE_URL } from '../../../services/constraint'
import { useSelector } from 'react-redux'
import AttendanceDetailModal from './components/AttedanceDetailModal'

import * as React from 'react'
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'


const items = [
  { id: 1, item: 'Paperclip', quantity: 100, price: 1.99 },
  { id: 2, item: 'Paper', quantity: 10, price: 30 },
  { id: 3, item: 'Pencil', quantity: 100, price: 1.25 }
]

const rows = [...items, { id: 'TOTAL', label: 'Total', total: 686.4 }]

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" gap={1}>
            <GridToolbarFilterButton />
            <GridToolbarExport />
          </Box>
          <Button sx={{bgcolor: 'rgb(0, 0, 255)'}} variant="contained">
            <Typography>Report</Typography>
          </Button>
        </Box>
      </GridToolbarContainer>
    )
  }

const columns = [
  {
    field: 'item',
    headerName: 'Item/Description',
    flex: 3,
    colSpan: ({ row }) => {
      if (row.id === 'TOTAL') {
        return 1
      }
      return undefined
    },
    valueGetter: ({ value, row }) => {
      if (row.id === 'TOTAL') {
        return row.label
      }
      return value
    }
  },
  {
    field: 'quantity',
    headerName: 'Quantity',
    flex: 1,
    sortable: false,
    valueGetter: ({ row, value }) => {
      if (row.id === 'TOTAL') {
        const totalQuantity = items.reduce((total, item) => total + item.quantity, 0)
        return `${totalQuantity}`
      }
      return value
    }
  },
  {
    field: 'price',
    headerName: 'Price',
    flex: 1,
    valueGetter: ({ row, value }) => {
      if (row.id === 'TOTAL') {
        const totalQuantity = items.reduce((total, item) => total + item.price, 0)
        return `${totalQuantity.toFixed(2)}`
      }
      return value
    }
  },
  {
    field: 'total',
    headerName: 'Total',
    flex: 1,
    valueGetter: ({ row }) => {
      if (row.id === 'TOTAL') {
        return row.total
      }
      return row.price * row.quantity
    }
  }
]

const getCellClassName = ({ row, field }) => {
  if (row.id === 'SUBTOTAL' || row.id === 'TOTAL' || row.id === 'TAX') {
    if (field === 'item') {
      return 'bold'
    }
  }
  return ''
}

export default function CheckAttendance() {
  return (
    <>
    <Header title='Check attendance' />
    <Box
    sx={{
      "& .MuiDataGrid-root": {
        border: "none",
      },
      "& .MuiDataGrid-cell": {
        borderBottom: "none",
      },
      "& .name-column--cell": {
        color: "#94e2cd",
        
      },
      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: "rgb(248, 249, 250)",       
        color: "#000",
      },
      "& .MuiDataGrid-virtualScroller": {
        backgroundColor: "#fff",
        // height: '420px'
      },
      "& .MuiDataGrid-footerContainer": {
        borderTop: "1px solid rgba(224, 224, 224, 1)",
        backgroundColor: "#fff",
      },
      "& .MuiCheckbox-root": {
        color: `"#b7ebde" !important`,
      },
      "& .MuiDataGrid-cellContent": {
        color: "#000",
      },
      "& .MuiButton-textPrimary": {
        color: "#000",
      },
      "& .MuiDataGrid-toolbarContainer": {
        marginBottom: "10px",
        justifyContent: "flex-start",
      },
      // "& .MuiButtonBase-root ": {
      //   bgcolor: "#fff",
      //   color: '#000'
      // },
      "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: "700",
      },
    }}>
      <DataGrid
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        disableRowSelectionOnClick
        slots={{ toolbar: CustomToolbar }}
        pageSizeOptions={[5, 10, 20, 50]}
        showCellVerticalBorder
        showColumnVerticalBorder
        getCellClassName={getCellClassName}
        columns={columns}
        rows={rows}
      />
    </Box>
    </>
  )
}
