import { Box, IconButton } from "@mui/material"
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DataTableCheckAttendance2 from "./components/DataTable";
import { useEffect } from "react";
import axiosClient from "../../../utils/axios-config";
import { BASE_URL } from "../../../services/constraint";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const CheckAttendance2 = () => {
    
    const [attendance, setAttendance] = useState('')
    const userId = useSelector((state) => state.auth.login?.currentUser?.accountId)
    useEffect(() => {
        try {
            const res = axiosClient.get(`${BASE_URL}/getAttendanceUser`, {
                params: {
                    user_id: userId
                }
            })
            setAttendance(res)
        } catch (error) {
            if(error.response.status === 400){
                toast.error('Error')
            }
        }
    }, [])
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
    <DataTableCheckAttendance2 rows={attendance} columns={columns} />
  )
}

export default CheckAttendance2