import { Box, Button, LinearProgress, Typography } from "@mui/material";
import {
  DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton
} from "@mui/x-data-grid";


const DataTableListChangeLog = ({ rows, columns, isLoading }) => {

  return (   
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
      }}
    >
      <DataGrid 
        disableRowSelectionOnClick
        showCellVerticalBorder
        showColumnVerticalBorder
        rows={rows}
        columns={columns}
        slots={{ loadingOverlay: LinearProgress }}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        loading={isLoading}
        getRowId={(row) => row.changeLogId}
      />
    </Box>
  );
};

export default DataTableListChangeLog;