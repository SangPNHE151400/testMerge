import { Box, LinearProgress } from '@mui/material'
import {
  DataGrid
} from '@mui/x-data-grid'
import Header from '../../../../components/Header'

const DataTableCheckAttendance = ({ rows, columns, isLoading, CustomToolbar }) => {
  
  const getCellClassName = ({ row, field }) => {
    if (row.id === 'SUBTOTAL' || row.id === 'TOTAL' || row.id === 'TAX') {
      if (field === 'item') {
        return 'bold'
      }
    }
    return ''
  }
  return (
    <>
      <Header title="Check attendance" />
      <Box
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none'
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none'
          },
          '& .name-column--cell': {
            color: '#94e2cd'
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgb(248, 249, 250)',
            color: '#000'
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: '#fff'
            // height: '420px'
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid rgba(224, 224, 224, 1)',
            backgroundColor: '#fff'
          },
          '& .MuiCheckbox-root': {
            color: `"#b7ebde" !important`
          },
          '& .MuiDataGrid-cellContent': {
            color: '#000'
          },
          '& .MuiButton-textPrimary': {
            color: '#000'
          },
          '& .MuiDataGrid-toolbarContainer': {
            marginBottom: '10px',
            justifyContent: 'flex-start'
          },
          // "& .MuiButtonBase-root ": {
          //   bgcolor: "#fff",
          //   color: '#000'
          // },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: '700'
          }
        }}>
        <DataGrid
          disableRowSelectionOnClick
          slots={{ toolbar: CustomToolbar, loadingOverlay: LinearProgress }}
          showCellVerticalBorder
          showColumnVerticalBorder
          getCellClassName={getCellClassName}
          loading={isLoading}
          columns={columns}
          rows={rows}
          getRowId={(row) => row.dailyId}
        />
      </Box>
    </>
  )
}

export default DataTableCheckAttendance
