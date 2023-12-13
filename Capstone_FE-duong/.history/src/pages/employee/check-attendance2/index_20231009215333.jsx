import { Box, IconButton } from "@mui/material"
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const CheckAttendance2 = () => {
    const columns = [
        {
          field: 'date',
          headerName: 'Date',
          cellClassName: 'name-column--cell',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'firstEntry',
          headerName: 'First Entry',
          cellClassName: 'name-column--cell',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'lastExit',
          headerName: 'Last Exit',
          cellClassName: 'name-column--cell',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'totalTime',
          headerName: 'Total Time',
          cellClassName: 'name-column--cell',
          headerAlign: 'center',
          align: 'center',
          flex: 1
        },
        {
          field: 'action',
          headerName: 'Action',
          headerAlign: 'center',
          align: 'center',
          flex: 1,
          renderCell: (params) => {
            return (
              <Box
                margin="0 auto"
                p="5px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius="4px">
                <IconButton>
                  <RemoveRedEyeIcon sx={{ color: 'rgb(0, 150, 255)' }} />
                </IconButton>
              </Box>
            )
          }
        }
      ]  
  return (
    <div>CheckAttendance2</div>
  )
}

export default CheckAttendance2