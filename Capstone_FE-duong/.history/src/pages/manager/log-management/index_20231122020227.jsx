import { Box, Button, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import useAuth from '../../../hooks/useAuth'
import userApi from '../../../services/userApi'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import logApi from '../../../services/logApi'
import formatDate from '../../../utils/formatDate'
import DataTableListChangeLog from './component/DataTable'

const LogManagement = () => {
  const navigate = useNavigate()
  const userInfo = useAuth()
  const [listLog, setListLog] = useState([])
  const [listEm, setListEm] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [employee, setEmployee] = useState()
  const [month, setMonth] = useState(new Date())

  useEffect(() => {
    const getListEmpByDepartment = async () => {
      let res = await userApi.getAllEmployeeByDepartmentId(userInfo?.departmentId)
      setListEm(res)
    }
    getListEmpByDepartment()
  }, [])
  console.log(listEm);
  console.log(userInfo);
  const handleChangeEmployee = (e) => {
    setEmployee(e)
  }

  const handleSearchLog = async () => {
    setIsLoading(true)
    let data = {
      employeeId: employee.accountId,
      month: format(month, 'MM')
    }
    let res = await logApi.getChangeLogByEmployeeAndMonth(data)
    setListLog(res)
    setIsLoading(false)
  }

  console.log(listLog)

  const columns = [
    {
      field: 'Account',
      headerName: 'Account',
      width: 150,
      renderCell: () => {
        return <Typography>{employee?.userName}</Typography>
      }
    },
    {
      field: 'Name',
      headerName: 'Name',
      width: 150,
      renderCell: () => {
        return (
          <Typography>
            {employee?.firstName} {employee?.lastName}
          </Typography>
        )
      }
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 150
    },
    {
      field: 'changeLogId',
      headerName: 'Attendance Log',
      width: 150,
      renderCell: (params) => {
        return <Box>{params.row?.checkin || params.row?.checkout === '' ? 0 : 1}</Box>
      }
    },
    {
      field: 'violate',
      headerName: 'Violate',
      width: 150,
      renderCell: (params) => {
        return <Box>{params.row?.violate ? 1 : 0}</Box>
      }
    },
    {
      field: 'outsideWork',
      headerName: 'Outside Work',
      width: 150,
      renderCell: (params) => {
        return <Box>{params.row?.outsideWork === -1 ? '' : params.row?.outsideWork}</Box>
      }
    },
    {
      field: 'createdDate',
      headerName: 'Save at',
      width: 180,
      renderCell: (params) => {
        return <Box>{formatDate(params.row?.createdDate)}</Box>
      }
    },
    {
      field: 'changeType',
      headerName: 'Save from',
      width: 150,
      renderCell: (params) => {
        return <Box>{params.row?.changeType == 'FROM_EDIT' ? 'Personal Edit' : 'Request'}</Box>
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      width: 150,
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
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/attendance-log-detail/${employee.accountId}/${params.row.date}`)
                }>
                Detail
              </Button>
            </Box>
          </Box>
        )
      }
    }
  ]

  return (
    <>
      <Box display="flex" alignItems="center" gap={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            maxDate={new Date()}
            value={month}
            views={['month', 'year']}
            onChange={(newDate) => setMonth(newDate.toDate())}
            renderInput={(props) => <TextField sx={{ width: '20%' }} {...props} />}
          />
        </LocalizationProvider>
        <Box>
          {listEm.length >= 0 && (
            <>
              <FormControl sx={{ width: '150px' }}>
                <Select onChange={(e) => handleChangeEmployee(e.target.value)}>
                  {listEm.map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item?.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>
        <Box>
          <Button variant="outlined" onClick={() => handleSearchLog()}>
            Search
          </Button>
        </Box>
      </Box>
      {listLog.length != 0 ? (
        <>
          <Box mt={3}>
            <DataTableListChangeLog rows={listLog} columns={columns} isLoading={isLoading} />
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default LogManagement
