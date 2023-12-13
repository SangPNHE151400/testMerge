import { Box, Button, TextField } from '@mui/material'
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import attendanceApi from '../../../services/attendanceApi'
import DataTableCheckAttendance from './components/DataTable'

export default function CheckAttendance() {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)

  const [isLoading, setIsLoading] = useState(false)
  const [userAttendance, setUserAttendance] = useState('')
  const [dailyLog, setDailyLog] = useState([])
  const [month, setMonth] = useState(new Date())

  useEffect(() => {
    const fetchAllUserAttendance = async () => {
      setIsLoading(true)
      try {
        const response = await attendanceApi.getAttendanceUser(
          currentUser?.accountId,
          format(month, 'MM')
        )
        console.log(response)
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
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const totalAttendance = dailyLog.reduce((total, item) => total + item.totalAttendance, 0)
          return `${totalAttendance}`
        }
        return value
      }
    },
    {
      field: 'morningTotal',
      headerName: 'Total Morning',
      width: 150,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const morningTotal = dailyLog.reduce((total, item) => total + item.morningTotal, 0)
          return `${morningTotal}`
        }
        return value
      }
    },
    {
      field: 'afternoonTotal',
      headerName: 'Total Afternoon',
      width: 150,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const afternoonTotal = dailyLog.reduce((total, item) => total + item.afternoonTotal, 0)
          return `${afternoonTotal}`
        }
        return value
      }
    },
    {
      field: 'lateCheckin',
      headerName: 'Late Check In',
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
      headerName: 'Early Checkout',
      width: 150,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL' && userAttendance && userAttendance.totalAttendanceUser) {
          return `${userAttendance.totalAttendanceUser.earlyCheckoutTotal}`
        }
        return value === true ? 1 : 0
      }
    },
    {
      field: 'permittedLeave',
      headerName: 'Permitted Leave',
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
      field: 'nonPermittedLeave',
      headerName: 'Non Permitted Leave',
      width: 200,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const nonPermittedLeave = dailyLog.reduce(
            (total, item) => total + item.nonPermittedLeave,
            0
          )
          return `${nonPermittedLeave}`
        }
        return value
      }
    },
    {
      field: 'violate',
      headerName: 'Violate',
      width: 150,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL' && userAttendance && userAttendance.totalAttendanceUser) {
          return `${userAttendance.totalAttendanceUser.violateTotal}`
        }
        return value === true ? 1 : 0
      }
    },
    {
      field: 'outsideWork',
      headerName: 'Outside Work',
      width: 150,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const outsideWork = dailyLog.reduce((total, item) => total + item.outsideWork, 0)
          return `${outsideWork}`
        }
        return value
      }
    },
    {
      field: 'paidDay',
      headerName: 'Paid Day',
      width: 120,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const paidDay = dailyLog.reduce((total, item) => total + item.paidDay, 0)
          return `${paidDay}`
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
              <Button variant="contained">
                Detail
              </Button>
              <Button variant="contained">
                Late Request
              </Button>
            </Box>
          </Box>
        )
      }
    }
  ]
  return (
    <DataTableCheckAttendance
      rows={rows}
      columns={columns}
      CustomToolbar={CustomToolbar}
      isLoading={isLoading}
    />
  )
}
