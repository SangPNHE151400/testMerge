import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  Divider,
  TableHead
} from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import attendanceApi from '../../../services/attendanceApi'
import overtimeApi from '../../../services/overtimeApi'
import ChatTopbar from '../../common/chat/components/ChatTopbar'
import EvaluateTable from './component/DataTable'
import { validationSchema } from './util/validationSchema'
ClassicEditor.defaultConfig = {
  toolbar: {
    items: ['heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList']
  },
  language: 'en'
}
const UpdateEvaluate = () => {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  console.log(currentUser)
  const [loading, setIsLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [userAttendance, setUserAttendance] = useState('')
  const [dailyLog, setDailyLog] = useState([])
  const [status, setStatus] = useState('')
  const [selectedOption, setSelectedOption] = useState('option1')
  const { employee_id, date } = useParams()
  const [overTimeData, setOverTimeDate] = useState([])
  const [userEvaluate, setUserEvaluate] = useState({})
  console.log(employee_id)
  console.log(date)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAllUserAttendance = async () => {
      setIsLoading(true)
      try {
        let response
        if (selectedOption === 'option1') {
          response = await attendanceApi.getAttendanceUser(
            employee_id,
            date.split('-')[1],
            date.split('-')[0]
          )
          setUserAttendance(response)
          console.log(response)
          setDailyLog(response?.dailyLogList)
        } else if (selectedOption === 'option2') {
          response = await overtimeApi.getOvertimeUser(
            employee_id,
            date.split('-')[1],
            date.split('-')[0]
          )
          console.log(response)
          setOverTimeDate(response?.overTimeLogResponses)
        }
      } catch (error) {
        console.error('Error fetching user attendance:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllUserAttendance()
  }, [selectedOption])

  useEffect(() => {
    const fetchUserEvaluate = async () => {
      setIsLoading(true)
      try {
        const data = {
          userId: employee_id,
          month: date.split('-')[1],
          year: date.split('-')[0]
        }
        const response = await attendanceApi.getIndividualEvaluate(data)
        setUserEvaluate(response)
        console.log(response)
        setStatus(response.evaluateEnum)
      } catch (error) {
        console.error('Error fetching user attendance:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserEvaluate()
  }, [])

  const handleOptionChange = (selectedValue) => {
    setSelectedOption(selectedValue)
  }

  console.log(userEvaluate?.note)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      content: userEvaluate?.note
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let data = {
        evaluateId: userEvaluate?.evaluateId,
        note: values.content,
        rate: status
      }
      console.log(data)
      attendanceApi.updateEvaluate(data)
      navigate(-1)
    }
  })

  const columnOverTime = [
    {
      field: 'approveDate',
      headerName: 'Approve Date',
      flex: 1
    },
    {
      field: 'checkin',
      headerName: 'Check In',
      flex: 1
    },
    {
      field: 'checkout',
      headerName: 'Check Out',
      flex: 1
    },
    {
      field: 'dateType',
      headerName: 'Date Type',
      flex: 1
    },
    {
      field: 'systemCheckIn',
      headerName: 'System Check In',
      flex: 1
    },
    {
      field: 'systemCheckOut',
      headerName: 'System Check Out',
      flex: 1
    },
    {
      field: 'totalAttendance',
      headerName: 'Total Attendance',
      flex: 1
    },
    {
      field: 'totalPaid',
      headerName: 'Total Paid',
      flex: 1
    }
  ]

  const columnDaily = [
    {
      field: 'dateDaily',
      headerName: 'Date',
      width: 280
    },
    {
      field: 'totalAttendance',
      headerName: 'Total Attendance',
      width: 170
    },
    {
      field: 'morningTotal',
      headerName: 'Total Morning',
      flex: 1
    },
    {
      field: 'afternoonTotal',
      headerName: 'Total Afternoon',
      flex: 1
    },
    {
      field: 'lateCheckin',
      headerName: 'Late Check In',
      valueGetter: ({ value }) => {
        return value === true ? 1 : 0
      },
      width: 150
    },
    {
      field: 'earlyCheckout',
      headerName: 'Early Check Out',
      valueGetter: ({ value }) => {
        return value === true ? 1 : 0
      },
      width: 150
    },
    {
      field: 'permittedLeave',
      headerName: 'Permitted Leave',
      flex: 1
    },
    {
      field: 'nonPermittedLeave',
      headerName: 'Non Permitted Leave',
      width: 200
    },
    {
      field: 'violate',
      headerName: 'Violate',
      valueGetter: ({ value }) => {
        return value === true ? 1 : 0
      },
      flex: 1
    },
    {
      field: 'paidDay',
      headerName: 'Paid Day',
      flex: 1
    }
  ]

  const handleChange = (e) => {
    setStatus(e)
  }

  return (
    <Box>
      <ChatTopbar />
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ padding: '20px' }}>
          <Box sx={{ mb: '20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Account</Typography>
                <TextField
                  sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                  InputProps={{ readOnly: true }}
                  value={userAttendance?.username}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>Hire Date</Typography>
                <TextField
                  sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                  value={userAttendance?.date}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography>Department</Typography>
                <TextField
                  sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                  InputProps={{ readOnly: true }}
                  value={userAttendance?.department}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={1}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { border: 1, padding: '8px' } }}>
                  <TableCell component="th" scope="row"></TableCell>
                    <TableCell sx={{fontSize: 16, fontWeight: 700}} align="center">Total Attendance</TableCell>
                    <TableCell sx={{fontSize: 16, fontWeight: 700}} align="center">Morning Total</TableCell>
                    <TableCell sx={{fontSize: 16, fontWeight: 700}} align="center">Afternoon Total</TableCell>
                    <TableCell sx={{fontSize: 16, fontWeight: 700}} align="center">Late Checkin Total</TableCell>
                    <TableCell sx={{fontSize: 16, fontWeight: 700}} align="center">Early Checkout Total</TableCell>
                    <TableCell sx={{fontSize: 16, fontWeight: 700}} align="center">Permitted Leave</TableCell>
                    <TableCell sx={{fontSize: 16, fontWeight: 700}} align="center">Non Permitted Leave</TableCell>
                    <TableCell sx={{fontSize: 16, fontWeight: 700}} align="center">Violate Total</TableCell>
                    <TableCell sx={{fontSize: 16, fontWeight: 700}} align="center">Paid Day</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ '&:last-child td, &:last-child th': { border: 1, padding: '8px' } }}>
                    <TableCell component="th" scope="row">
                      Total
                    </TableCell>
                    <TableCell align="center">
                      {userAttendance?.totalAttendanceUser?.totalAttendance}
                    </TableCell>
                    <TableCell align="center">
                      {userAttendance?.totalAttendanceUser?.morningTotal.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {userAttendance?.totalAttendanceUser?.afternoonTotal}
                    </TableCell>
                    <TableCell align="center">
                      {userAttendance?.totalAttendanceUser?.lateCheckinTotal}
                    </TableCell>
                    <TableCell align="center">
                      {userAttendance?.totalAttendanceUser?.earlyCheckoutTotal}
                    </TableCell>
                    <TableCell align="center">
                      {userAttendance?.totalAttendanceUser?.permittedLeave}
                    </TableCell>
                    <TableCell align="center">
                      {userAttendance?.totalAttendanceUser?.nonPermittedLeave.toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      {userAttendance?.totalAttendanceUser?.violateTotal}
                    </TableCell>
                    <TableCell align="center">
                      {userAttendance?.totalAttendanceUser?.paidDay.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box mt={2}>
            <Button variant="contained" onClick={() => setShow(show ? false : true)}>
              {show ? <>Hide Detail</> : <>Show Detail</>}
            </Button>
          </Box>
          {show && (
            <Select
              value={selectedOption}
              onChange={(e) => handleOptionChange(e.target.value)}
              style={{ flex: 1, marginRight: '5px', marginTop: '15px' }}>
              <MenuItem value="option1">Daily Log</MenuItem>
              <MenuItem value="option2">Overtime</MenuItem>
            </Select>
          )}
          {show && selectedOption == 'option1' && (
            <Box mt={2}>
              <EvaluateTable rows={dailyLog} columns={columnDaily} isLoading={loading} />
            </Box>
          )}
          {show && selectedOption == 'option2' && (
            <Box mt={2}>
              <EvaluateTable rows={overTimeData} columns={columnOverTime} isLoading={loading} />
            </Box>
          )}

          <Box display="flex" gap={3} alignItems="center" mt={3}>
            <Typography>Evaluate of Manager : </Typography>
            <FormControl sx={{ width: '200px' }}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Status"
                onChange={(e) => handleChange(e.target.value)}>
                <MenuItem value="GOOD">GOOD</MenuItem>
                <MenuItem value="NORMAL">NORMAL</MenuItem>
                <MenuItem value="BAD">BAD</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mt={2}>
            <Typography fontWeight="500">Note</Typography>
            <CKEditor
              editor={ClassicEditor}
              data={formik.values.content}
              onChange={(event, editor) => {
                const data = editor.getData()
                formik.setFieldValue('content', data)
              }}
            />
            {formik.touched.content && formik.errors.content ? (
              <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                {formik.errors.content}
              </Typography>
            ) : null}
          </Box>
          {userEvaluate?.hrNote !== null && (
            <Box mt={3}>
              <Divider />
              <Box display="flex" alignItems="center" gap="5px" mt={2} fontSize="18px">
                Status:{' '}
                <Typography color="red" fontSize="16px">
                  Reject
                </Typography>
              </Box>
              <TextField
                sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                InputProps={{ readOnly: true }}
                multiline
                rows={3}
                value={`${userEvaluate.hrNote}`}
              />
            </Box>
          )}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button variant="contained" type="submit">
              Send
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  )
}

export default UpdateEvaluate
