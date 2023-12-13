import { Box, Button, TextField } from '@mui/material'
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import attendanceApi from '../../../services/attendanceApi'
import DataTableCheckAttendance from './components/DataTable'
import { formatDateNotTime } from '../../../utils/formatDate'
import { useNavigate } from 'react-router-dom'

export default function CheckAttendanceManager() {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)

  const [isLoading, setIsLoading] = useState(false)
  const [userAttendance, setUserAttendance] = useState('')
  const [dailyLog, setDailyLog] = useState([])
  const [month, setMonth] = useState(new Date())

  const [createdDate, setCreatedDate] = useState({})
  const navigate = useNavigate()
  useEffect(() => {
    const fetchAllUserAttendance = async () => {
      setIsLoading(true)
      try {
        const response = await attendanceApi.getAttendanceUser(
          currentUser?.accountId,
          format(month, 'MM'),
          format(month, 'yyyy')
        )
        setUserAttendance(response)
        setDailyLog(response?.dailyLogList)
      } catch (error) {
        console.error('Error fetching user attendance:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllUserAttendance()
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

  console.log(dailyLog)
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

  const rows = [...dailyLog, { id: 'TOTAL', label: 'Total', dailyId: '12345' }]
  const columns = [
    {
      field: 'dateDaily',
      headerName: 'Date',
      width: 280,
      colSpan: ({ row }) => {
        if (row.id === 'TOTAL') {
          return 3
        }
        return undefined
      },
      valueGetter: ({ value, row }) => {
        if (row.id === 'TOTAL') {
          return row.label
        }
        return value
      }
    },
    {
      field: 'checkin',
      headerName: 'Check In',
      width: 150
    },
    {
      field: 'checkout',
      headerName: 'Check out',
      width: 150
    },
    {
      field: 'totalAttendance',
      headerName: 'Total Attendance (h)',
      width: 180,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const totalAttendance = dailyLog.reduce((total, item) => total + item.totalAttendance, 0)
          return `${totalAttendance.toFixed(2)}`
        }
        return value
      }
    },
    {
      field: 'morningTotal',
      headerName: 'Total Morning (h)',
      width: 160,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const morningTotal = dailyLog.reduce((total, item) => total + item.morningTotal, 0)
          return `${morningTotal.toFixed(2)}`
        }
        return value
      }
    },
    {
      field: 'afternoonTotal',
      headerName: 'Total Afternoon (h)',
      width: 180,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const afternoonTotal = dailyLog.reduce((total, item) => total + item.afternoonTotal, 0)
          return `${afternoonTotal.toFixed(2)}`
        }
        return value
      }
    },
    {
      field: 'lateCheckin',
      headerName: 'Late Check In (s)',
      width: 150,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL' && userAttendance && userAttendance.totalAttendanceUser) {
          return `${userAttendance.totalAttendanceUser.lateCheckinTotal}`
        }
        return value === true ? 1 : 0
      }
    },
    {
      field: 'earlyCheckout',
      headerName: 'Early Checkout (s)',
      width: 170,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL' && userAttendance && userAttendance.totalAttendanceUser) {
          return `${userAttendance.totalAttendanceUser.earlyCheckoutTotal}`
        }
        return value === true ? 1 : 0
      }
    },
    {
      field: 'permittedLeave',
      headerName: 'Leave (s)',
      width: 150,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const permittedLeave = dailyLog.reduce((total, item) => total + item.permittedLeave, 0)
          return `${permittedLeave}`
        }
        return value
      }
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
                  {params.row.id !== 'TOTAL' ? (
              <Button
                variant="contained"
                sx={{ fontSize: '14px' }}
                onClick={() => navigate(`/attendance-detail/${params.row.dailyId}/${outputDateString}`)}>
                View Log
              </Button>
                 ) : null}
            </Box>
          </Box>
        )
      }
    }
  ]
  return (
    <>
      <DataTableCheckAttendance
        rows={rows}
        columns={columns}
        CustomToolbar={CustomToolbar}
        isLoading={isLoading}
      />

    </>
  )
}
