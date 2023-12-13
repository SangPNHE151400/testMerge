import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import attendanceApi from '../../../services/attendanceApi'
import overtimeApi from '../../../services/overtimeApi'
import { formatDateNotTime } from '../../../utils/formatDate'
import DataTableCheckAttendance from './components/DataTable'
import userApi from '../../../services/userApi'
import useAuth from '../../../hooks/useAuth'
import EditEmpLogAttendence from './components/EditModal'
// import EditEmpLogAttendance from './components/EditModal';
// import { useFormik } from 'formik';
import { toast } from 'react-toastify'
export default function LogEmpAttendanceByIdList() {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const [isLoading, setIsLoading] = useState(false)
  const [userAttendance, setUserAttendance] = useState('')
  const [dailyLog, setDailyLog] = useState([])
  const [month, setMonth] = useState(new Date())
  const [createdDate, setCreatedDate] = useState({})
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [hireDate, setHireDate] = useState('')
  const { employee_id } = useParams()
  const [selectedOption, setSelectedOption] = useState('option1')
  const [option2Data, setOption2Data] = useState([])
  const [openLateRequest, setOpenLateRequest] = useState(false)
  const [dailyLogModal, setDailyLogModal] = useState({})
  const [listEm, setListEm] = useState([])
  const [isEvaluate, setIsEvaluate] = useState()
  const [employee, setEmployee] = useState('none')
  const userInfo = useAuth()
  useEffect(() => {
    const getListEmpByDepartment = async () => {
      try {
        let res = await userApi.getAllEmployeeByDepartmentId(userInfo?.departmentId)
        setListEm(res)
        console.log(res);
      } catch (error) {
        console.error('Error fetching employee list:', error)
      }
    }
    const fetchAllUserAttendance = async () => {
      setIsLoading(true)
      try {
        let response
        if (selectedOption === 'option1') {
          response = await attendanceApi.getAttendanceUser(
            employee,
            format(month, 'MM'),
            format(month, 'yyyy')
          )
          const { username, hireDate } = response
          setUserAttendance(response)
          setDailyLog(response?.dailyLogList)
          setUserName(username)
          setHireDate(hireDate)
        } else if (selectedOption === 'option2') {
          response = await overtimeApi.getOvertimeUser(
            employee,
            format(month, 'MM'),
            format(month, 'yyyy')
          )
          const option2DataWithId =
            response?.overTimeLogResponses.map((item, index) => ({
              ...item,
              id: index.toString()
            })) || []
          setOption2Data(option2DataWithId)
          console.log(option2DataWithId)
        }
      } catch (error) {
        if (error.response.status === 404) {
            toast.error("This account hasn't had log yet!")
          }
      } finally {
        setIsLoading(false)
      }
    }
    Promise.all([getListEmpByDepartment(), fetchAllUserAttendance()])
      .then(() => {
        console.log('Both API calls completed')
      })
      .catch((error) => {
        console.error('Error in one of the API calls:', error)
      })
  }, [userInfo?.departmentId, selectedOption, employee, month])

  const handleChangeEmployee = (e) => {
    setEmployee(e)
  }
  const handleOpenLateRequest = (params) => {
    setOpenLateRequest(true)
    console.log(params)
    setDailyLogModal(params)
  }

  const handleCloseEditLog = () => setOpenLateRequest(false)

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
  }, [currentUser])

  useEffect(() => {
    const fetchIsEvaluate = async () => {
        const response = await attendanceApi.checkEvaluateExisted(
          employee,
          format(month, 'MM'),
          format(month, 'yyyy')
        )
        if(response && response.data){
            setIsEvaluate(response.data)    
        }else if(response){
            setIsEvaluate(response)
        }
    }

    fetchIsEvaluate()
  }, [employee, month])

  console.log(isEvaluate)
  const handleOptionChange = (selectedValue) => {
    setSelectedOption(selectedValue)
  }
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
          <Box display="flex" gap={1} flex={1}>
            <GridToolbarFilterButton />
            <GridToolbarExport />
          </Box>
          {isEvaluate === false && (
            <Box mr={1}>
              <Button
                variant="contained"
                onClick={() =>
                  navigate(`/create-evaluate/${employee}/${format(month, 'yyyy-MM')}`)
                }>
                Evaluate
              </Button>
            </Box>
          )}
          <Box display="flex" alignItems="center" mr={1} width="20%">
            <FormControl sx={{ width: '280px' }}>
              <InputLabel id="demo-simple-select-label">Select Employee</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Select Employee"
                value={employee}
                onChange={(e) => handleChangeEmployee(e.target.value)}>
                {listEm.map((item, index) => (
                  <MenuItem key={index} value={item.accountId}>
                    {item?.userName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                style={{ marginLeft: '10px' }}
              />
            </LocalizationProvider>
          </Box>
          <Box display="flex" alignItems="center" gap={1} width="20%">
            <Select
              value={selectedOption}
              onChange={(e) => handleOptionChange(e.target.value)}
              style={{ flex: 1, marginLeft: '10px' }}>
              <MenuItem value="option1">Daily Log</MenuItem>
              <MenuItem value="option2">Overtime</MenuItem>
            </Select>
          </Box>
        </Box>
      </GridToolbarContainer>
    )
  }

  const columnsOption1 = [
    {
      field: 'dateDaily',
      headerName: 'Date',
      width: 280,
      colSpan: ({ row }) => {
        if (row.id === 'TOTAL') {
          return 5
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
    },
    {
      field: 'systemCheckIn',
      headerName: 'System Check Out',
      width: 170
    },
    {
      field: 'systemCheckOut',
      headerName: 'System Check In',
      width: 170
    },
    {
      field: 'totalAttendance',
      headerName: 'Total Attendance',
      width: 150,
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
      headerName: 'Total Morning',
      width: 150,
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
      headerName: 'Total Afternoon',
      width: 150,
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
      width: 187,
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
      field: 'violate',
      headerName: 'Violate',
      width: 150,
      valueGetter: ({ row }) => {
        if (row.id === 'TOTAL') {
          const violateCount = dailyLog.reduce((total, item) => total + (item.violate ? 1 : 0), 0)
          return `${violateCount}`
        }
        return row.violate ? 1 : 0
      }
    },

    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      width: 250,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        let inputDateString = params.row?.dateDaily

        let inputDate = new Date(inputDateString)

        let year = inputDate.getFullYear()
        let month = (inputDate.getMonth() + 1).toString().padStart(2, '0')
        let day = inputDate.getDate().toString().padStart(2, '0')

        let outputDateString = `${year}-${month}-${day}`

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
                <>
                  <Button
                    variant="contained"
                    onClick={() =>
                      navigate(`/emp-attendance-detail/${employee_id}/${outputDateString}`)
                    }>
                    View Log
                  </Button>
                </>
              ) : null}
              {params.row.id !== 'TOTAL' ? (
                <Button variant="contained" onClick={() => handleOpenLateRequest(params.row)}>
                  Edit
                </Button>
              ) : null}
            </Box>
          </Box>
        )
      }
    }
  ]

  const columnsOption2 = [
    {
      field: 'date',
      headerName: 'Date',
      width: 280
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
    },
    {
      field: 'totalAttendance',
      headerName: 'Total Attendance',
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
      headerName: 'Total Paid',
      flex: 1
    }
  ]

  const columns = selectedOption === 'option1' ? columnsOption1 : columnsOption2

  const rows =
    selectedOption === 'option1'
      ? [...dailyLog, { id: 'TOTAL', label: 'Total', dailyId: '12345' }]
      : [...option2Data]
  console.log(employee_id)

  return (
    <>
      <Box sx={{ marginLeft: '10px' }}>
        <DataTableCheckAttendance
          rows={rows}
          columns={columns}
          CustomToolbar={CustomToolbar}
          isLoading={isLoading}
          userName={userName}
          hireDate={hireDate}
          getRowId={(row) => row.id}
        />
        <EditEmpLogAttendence
          systemCheckIn={dailyLogModal?.systemCheckIn}
          systemCheckOut={dailyLogModal?.systemCheckOut}
          handleCloseEditLog={handleCloseEditLog}
          openEditLog={openLateRequest}
          dailyLogModal={dailyLogModal}
          userName={userName}
          date={dailyLogModal?.dateDaily}
          employeeId={employee}
        />
      </Box>
    </>
  )
}
