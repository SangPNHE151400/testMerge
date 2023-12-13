import { Box, Button, TextField } from '@mui/material'
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { formatDateNotTime } from '../../../utils/formatDate'
import DataTableCheckOvertime from './components/DataTable'
import OvertimeRequestModal from './components/OvertimeRequestModal'
import overtimeApi from '../../../services/overtimeApi'
import attendanceApi from '../../../services/attendanceApi'

export default function CheckOvertime() {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const [isLoading, setIsLoading] = useState(false)
  const [userOvertime, setUserOvertime] = useState('')
  const [overTimeLog, setOverTimeLog] = useState([])
  const [month, setMonth] = useState(new Date())
  const [openOvertimeRequest, setOpenOvertimeRequest] = useState(false)
  const [dailyLogModal, setDailyLogModal] = useState({})
  const [createdDate, setCreatedDate] = useState({})
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

  const handleOpenOvertimeRequest = (params) => {
    setOpenOvertimeRequest(true)
    setDailyLogModal(params)
  }

  const handleCloseOvertimeRequest = () => setOpenOvertimeRequest(false)
  console.log(userOvertime)
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" gap={1} flex={1}>
            <GridToolbarFilterButton />
            <GridToolbarExport />
          </Box>
          <Box display="flex" gap="15px">
            <Button
              variant="contained"
              sx={{ width: '100%' }}
              onClick={() => handleOpenOvertimeRequest()}>
              Overtime Request
            </Button>
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
      field: 'date',
      headerName: 'Date',
      width: 280
    },
    {
      field: 'checkin',
      headerName: 'Check In',
      width: 122
    },
    {
      field: 'checkout',
      headerName: 'Check out',
      width: 120
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
      headerName: 'Total Attendance (h)',
      flex: 1
    },
    {
      field: 'approveDate',
      headerName: 'Approve Date',
      flex: 1
    },
    {
      field: 'dateType',
      headerName: 'Date Type',
      flex: 1
    },
    {
      field: 'totalPaid',
      headerName: 'Total Paid (h)',
      flex: 1
    },
  ]
  return (
    <>
      <DataTableCheckOvertime
        rows={overTimeLog}
        columns={columns}
        CustomToolbar={CustomToolbar}
        isLoading={isLoading}
      />
      <OvertimeRequestModal
        handleCloseOvertimeRequest={handleCloseOvertimeRequest}
        openOvertimeRequest={openOvertimeRequest}
        dailyLogModal={dailyLogModal}
      />
    </>
  )
}
