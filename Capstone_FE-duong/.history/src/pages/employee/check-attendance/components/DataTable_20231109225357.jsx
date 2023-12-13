import { Box, LinearProgress, TextField } from '@mui/material'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton
} from '@mui/x-data-grid'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import Header from '../../../../components/Header'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

const DataTableCheckAttendance = ({ rows, columns, isLoading }) => {
  function CustomToolbar() {
    const tomorrow = dayjs().add(1, 'day')
    console.log(tomorrow);
    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" gap={1} flex={1}>
            <GridToolbarFilterButton />
            <GridToolbarExport />
          </Box>
          <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={new Date()}
              views={['month', 'year']}
              renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
            />
          </LocalizationProvider>
          </Box>
        </Box>
      </GridToolbarContainer>
    )
  }

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
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } }
          }}
          disableRowSelectionOnClick
          slots={{ toolbar: CustomToolbar, loadingOverlay: LinearProgress }}
          pageSizeOptions={[5, 10, 20, 50]}
          showCellVerticalBorder
          showColumnVerticalBorder
          getCellClassName={getCellClassName}
          loading={isLoading}
          columns={columns}
          rows={rows}
        />
      </Box>
    </>
  )
}

export default DataTableCheckAttendance
