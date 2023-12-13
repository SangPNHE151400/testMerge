import { Box, LinearProgress } from "@mui/material";
import {
  DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton
} from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";


const DataTableCheckAttendance = ({ rows, columns, isLoading }) => {
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" gap={1}>
            <GridToolbarFilterButton />
            <GridToolbarExport />
          </Box>
          <DatePicker value={new Date()} views={['month', 'year']} />
        </Box>
      </GridToolbarContainer>
    )
  }
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
  );
};

export default DataTableCheckAttendance;