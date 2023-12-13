import { Box, LinearProgress } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import Header from '../../../../components/Header'
import { styled } from '@mui/material/styles'
const StripedDataGrid = styled(DataGrid)(() => ({
  '.late-checkin-cell .MuiDataGrid-cellContent': {
    color: 'red'
  },
  '.weekend-cell .MuiDataGrid-cellContent': {
    color: 'gray'
  }
}))
const DataTableCheckAttendance = ({ rows, columns, isLoading, CustomToolbar }) => {
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
        <StripedDataGrid
          disableRowSelectionOnClick
          slots={{ toolbar: CustomToolbar, loadingOverlay: LinearProgress }}
          showCellVerticalBorder
          showColumnVerticalBorder
          rowsPerPageOptions={[50]}
          getRowClassName={(params) =>
            { 
              console.log(params.row);
              params.row.lateCheckin === true
              ? 'late-checkin-cell'
              : params.row?.dateDaily.startsWith('Sunday') ||
                params.row.dateDaily.startsWith('Saturday')
              ? 'weekend-cell'
              : ''
            }
          }
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
