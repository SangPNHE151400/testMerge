
import { useEffect, useState } from 'react'
import DataTableCheckAttendance from './components/DataTable'
import { useSelector } from 'react-redux'
import attendanceApi from '../../../services/attendanceApi'

export default function CheckAttendance() {
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
    <DataTableCheckAttendance rows={rows} columns={columns} />
  )
}
