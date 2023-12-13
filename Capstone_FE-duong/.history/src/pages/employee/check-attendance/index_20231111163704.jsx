import { Box, TextField } from '@mui/material'
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import attendanceApi from '../../../services/attendanceApi'
import DataTableCheckAttendance from './components/DataTable'

export default function CheckAttendance() {
  const currentUser = useSelector((state) => state.auth.login?.currentUser);

  const [isLoading, setIsLoading] = useState(false);
  const [userAttendance, setUserAttendance] = useState('');
  const [dailyLog, setDailyLog] = useState([]);
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    const fetchAllUserAttendance = async () => {
      setIsLoading(true);
      try {
        const response = await attendanceApi.getAttendanceUser(currentUser?.accountId, format(month, 'MM'));
        console.log(response);
        setUserAttendance(response);
        setDailyLog(response?.dailyLogList)
      } catch (error) {
        console.error('Error fetching user attendance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUserAttendance();
  }, [month]);

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
                value={month}
                views={['month', 'year']}
                onChange={(newDate) => setMonth(newDate.toDate())}
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </GridToolbarContainer>
    );
  }

  const rows = [...dailyLog, { id: 'TOTAL', label: 'Total'}]

  const columns = [
    {
      field: 'dateDaily',
      headerName: 'Date',
      width: 280,
      // colSpan: ({ row }) => {
      //   if (row.id === 'TOTAL') {
      //     return 1
      //   }
      //   return undefined
      // },
      // valueGetter: ({ value, row }) => {
      //   if (row.id === 'TOTAL') {
      //     return row.label
      //   }
      //   return value
      // }
    },
    {
      field: 'checkin',
      headerName: 'Check In',
      width: 100,
      // valueGetter: ({ row, value }) => {
      //   if (row.id === 'TOTAL') {
      //     const totalQuantity = items.reduce((total, item) => total + item.quantity, 0)
      //     return `${totalQuantity}`
      //   }
      //   return value
      // }
    },
    {
      field: 'checkout',
      headerName: 'Check out',
      width: 100,
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
    }
  ]
  return (
    <DataTableCheckAttendance
      rows={dailyLog}
      columns={columns}
      CustomToolbar={CustomToolbar}
      isLoading={isLoading}
    />
  )
}
