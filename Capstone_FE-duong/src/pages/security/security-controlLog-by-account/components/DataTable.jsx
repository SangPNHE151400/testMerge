import { Box, LinearProgress } from "@mui/material";
import {
  DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton
} from "@mui/x-data-grid";


const DataTableManageLog = ({ rows, columns, isLoading }) => {
  
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" gap={1}>
            <GridToolbarFilterButton />
            <GridToolbarExport />
          </Box>
        </Box>
      </GridToolbarContainer>
    )
  }
  return (   
    <Box 
      sx={{
        height: '700px', 

        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
           padding: '8px',
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
           height: '590px'
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
      }}
    >
      <DataGrid 
        disableRowSelectionOnClick
        showCellVerticalBorder
        showColumnVerticalBorder
        rows={rows}
        columns={columns}
        loading={isLoading}
        slots={{ toolbar: CustomToolbar, loadingOverlay: LinearProgress }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          
        }}
        pageSizeOptions={[5, 10, 15]}
        // loading={isLoading}
        getRowId={(row) => row.controlLogId}
      />
      
    </Box>
  );
};

export default DataTableManageLog;