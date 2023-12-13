import { Box, Button, TextField } from '@mui/material'
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { formatDateNotTime } from '../../../utils/formatDate'
import DataTableCheckOvertime from './components/DataTable'
import LateRequestModal from './components/LateRequestModal'
import overtimeApi from '../../../services/overtimeApi'
import attendanceApi from '../../../services/attendanceApi'

export default function CheckOvertime() {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const [isLoading, setIsLoading] = useState(false)
  const [userOvertime, setUserOvertime] = useState('')
  const [overTimeLog, setOverTimeLog] = useState([])
  const [month, setMonth] = useState(new Date())
  const [openLateRequest, setOpenLateRequest] = useState(false)
  const [dailyLogModal, setDailyLogModal] = useState({})
  const [createdDate, setCreatedDate] = useState({})
  const navigate = useNavigate()
  useEffect(() => {
    const fetchAllUserOvertime = async () => {
      setIsLoading(true)
      try {
        const response = await overtimeApi.getOvertimeUser(
          currentUser?.accountId,
          format(month, 'MM'),
          format(month, 'yyyy')
        )
        setUserOvertime(response)
        setOverTimeLog(response?.overTimeLogResponses)
      } catch (error) {
        console.error('Error fetching user Overtime:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllUserOvertime()
  }, [month])

  useEffect(() => {
    const fetchGetCreatedDate = async () => {
      try {
        const response = await attendanceApi.getCreatedDate(currentUser?.accountId)
        setCreatedDate(response)
      } catch (error) {
        console.error('Error fetching user attendance:', error)
      }
    }

    fetchGetCreatedDate()
  }, [])

  console.log(formatDateNotTime(createdDate?.createdDate))

  const handleOpenLateRequest = (params) => {
    setOpenLateRequest(true)
    setDailyLogModal(params)
  }

  const handleCloseLateRequest = () => setOpenLateRequest(false)
  console.log(userOvertime)
  function CustomToolbar() {
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
                maxDate={new Date()}
                minDate={formatDateNotTime(createdDate?.createdDate)}
                value={month}
                views={['month', 'year']}
                onChange={(newDate) => setMonth(newDate.toDate())}
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </GridToolbarContainer>
    )
  }

  const columns = [
    {
      field: 'dateDaily',
      headerName: 'Date',
      width: 280,
    },
    {
      field: 'checkin',
      headerName: 'Check In',
      width: 100
    },
    {
      field: 'checkout',
      headerName: 'Check out',
      width: 100
      // valueGetter: ({ row, value }) => {
      //   if (row.id === 'TOTAL') {
      //     const totalQuantity = items.reduce((total, item) => total + item.price, 0)
      //     return `${totalQuantity.toFixed(2)}`
      //   }
      //   return value
      // }
    },
    {
      field: 'totalAttendance',
      headerName: 'Total Attendance',
      width: 150,
     
    },
    {
      field: 'morningTotal',
      headerName: 'Total Morning',
      width: 150,
     
    },
    {
      field: 'afternoonTotal',
      headerName: 'Total Afternoon',
      width: 150,
      
    },
    {
      field: 'lateCheckin',
      headerName: 'Late Check In',
      width: 150,
      
    },
    {
      field: 'earlyCheckout',
      headerName: 'Early Checkout',
      width: 150,
      
    },
    {
      field: 'permittedLeave',
      headerName: 'Permitted Leave',
      width: 150,
      
    },
    {
      field: 'nonPermittedLeave',
      headerName: 'Non Permitted Leave',
      width: 200,
      
    },
    {
      field: 'violate',
      headerName: 'Violate',
      width: 150,
      
    },
    {
      field: 'outsideWork',
      headerName: 'Outside Work',
      width: 150,
     
    },
    {
      field: 'paidDay',
      headerName: 'Paid Day',
      width: 120,
     
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      width: 300,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        let inputDateString = params.row?.dateDaily

        let inputDate = new Date(inputDateString)

        let year = inputDate.getFullYear()
        let month = (inputDate.getMonth() + 1).toString().padStart(2, '0')
        let day = inputDate.getDate().toString().padStart(2, '0')

        let outputDateString = `${year}-${month}-${day}`

        console.log(params.row);
        return (
          <Box
            gap={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderRadius="4px"
            width="100%">
            <Box
              gap={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="4px"
              width="100%">
              <Button
                variant="contained"
                onClick={() => navigate(`/attendance-detail/${params.row.dailyId}/${outputDateString}`)}>
                Detail
              </Button>
              {params.row.lateCheckin === true && (
                <Button variant="contained" onClick={() => handleOpenLateRequest(params.row)}>
                  Late Request
                </Button>
              )}
            </Box>
          </Box>
        )
      }
    }
  ]
  return (
    <>
      <DataTableCheckOvertime
        rows={overTimeLog}
        columns={columns}
        CustomToolbar={CustomToolbar}
        isLoading={isLoading}
      />
      <LateRequestModal
        handleCloseLateRequest={handleCloseLateRequest}
        openLateRequest={openLateRequest}
        dailyLogModal={dailyLogModal}
      />
    </>
  )
}
