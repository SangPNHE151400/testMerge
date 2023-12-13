import { Box, LinearProgress, Button } from "@mui/material";
import {
  DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton
} from "@mui/x-data-grid";
import notificationApi from "../../../../services/notificationApi";


const DataTableListUploadReceive = ({ rows, columns,isLoading, userId, setAllNoti }) => {
  const handleMarkAllRead = () => {
    notificationApi.markAllRead(userId)
    setAllNoti((prevNoti) =>
    prevNoti.map((noti) => {
        return {
          ...noti,
          readStatus: true
        } 
    })
  )
  }
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" gap={1}>
            <GridToolbarFilterButton />
            <GridToolbarExport />
          </Box>
          <Box display="flex" gap={1}>
            <Button onClick={handleMarkAllRead} variant="contained">Mark All Read</Button>
          </Box>
        </Box>
      </GridToolbarContainer>
    )
  }
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
          borderBottom: "none",
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
      sx={{overflowX: 'scroll'}}
        disableRowSelectionOnClick
        autoHeight  
        rows={rows}
        columns={columns}
        slots={{ toolbar: CustomToolbar, loadingOverlay: LinearProgress }}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 20, 50]}
         loading={isLoading}
        getRowId={(row) => row.notificationId}
      />
    </Box>
  );
};

export default DataTableListUploadReceive;