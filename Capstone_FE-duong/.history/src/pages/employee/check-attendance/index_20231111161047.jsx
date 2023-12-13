import { useEffect, useState } from 'react'
import DataTableCheckAttendance from './components/DataTable'
import { useSelector } from 'react-redux'
import attendanceApi from '../../../services/attendanceApi'
import { GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid'
import { Box, TextField } from '@mui/material'
import { GridToolbarExport } from '@mui/x-data-grid'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { format } from 'date-fns'

export default function CheckAttendance() {
  function CustomToolbar() {
    const [isLoading, setIsLoading] = useState(false)
    const [userAttendance, setUserAttendance] = useState('')
    const [month, setMonth] = useState(new Date())
    const currentUser = useSelector((state) => state.auth.login?.currentUser)

    console.log(format(month, 'MM'))
    useEffect(() => {
      setIsLoading(true)
      const fetchAllUserAttendance = async () => {
        const response = await attendanceApi.getAttendanceUser(
          currentUser?.accountId,
          format(month, 'MM')
        )
        setUserAttendance(response)
        setIsLoading(false)
      }
      fetchAllUserAttendance()
    }, [month])

    console.log(userAttendance)
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
    )
  }

  const items = [
    { id: 1, item: 'Paperclip', quantity: 100, price: 1.99 },
    { id: 2, item: 'Paper', quantity: 10, price: 30 },
    { id: 3, item: 'Pencil', quantity: 100, price: 1.25 }
  ]

  const rows = [...items, { id: 'TOTAL', label: 'Total', total: 686.4 }]

  const columns = [
    {
      field: 'item',
      headerName: 'Item/Description',
      flex: 3,
      colSpan: ({ row }) => {
        if (row.id === 'TOTAL') {
          return 1
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
      field: 'quantity',
      headerName: 'Quantity',
      flex: 1,
      sortable: false,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const totalQuantity = items.reduce((total, item) => total + item.quantity, 0)
          return `${totalQuantity}`
        }
        return value
      }
    },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      valueGetter: ({ row, value }) => {
        if (row.id === 'TOTAL') {
          const totalQuantity = items.reduce((total, item) => total + item.price, 0)
          return `${totalQuantity.toFixed(2)}`
        }
        return value
      }
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      valueGetter: ({ row }) => {
        if (row.id === 'TOTAL') {
          return row.price * row.quantity
        }
        return row.price * row.quantity
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
