
import { useEffect, useState } from 'react'
import DataTableCheckAttendance from './components/DataTable'
import { useSelector } from 'react-redux'
import attendanceApi from '../../../services/attendanceApi'
import { GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid'
import { Box, TextField } from '@mui/material'
import { GridToolbarExport } from '@mui/x-data-grid'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { DatePicker } from '@mui/lab'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

export default function CheckAttendance() {

  function CustomToolbar() {
    const tomorrow = dayjs()
    console.log(tomorrow);
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
              minDate={tomorrow}
              value={new Date()}
              views={['month', 'year']}
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
  const [isLoading, setIsLoading] = useState(false)
  const [userAttendacen, setUserAttendance] = useState('')
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  useEffect(() => {
    setIsLoading(true)
    const fetchAllUser = async () => {
      const response = await attendanceApi.getAttendanceUser(currentUser?.accountId, )
      setUserAttendance(response)
      setIsLoading(false)
    }
    fetchAllUser()
  }, [])
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
    <DataTableCheckAttendance rows={rows} columns={columns} CustomToolbar={CustomToolbar} />
  )
}
