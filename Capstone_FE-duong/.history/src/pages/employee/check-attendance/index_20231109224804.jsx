
import DataTableCheckAttendance from './components/DataTable'


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



export default function CheckAttendance() {
  return (
    <DataTableCheckAttendance rows={rows} columns={columns} />
  )
}
