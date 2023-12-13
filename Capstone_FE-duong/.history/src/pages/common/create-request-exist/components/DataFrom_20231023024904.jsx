import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Box, Button, Checkbox, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { useEffect, useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import requestApi from '../../../../services/requestApi'
import dayjs from 'dayjs'
import { useParams } from 'react-router-dom'

const AttendenceFrom = ({ userId }) => {
  const [from, setFrom] = useState(dayjs(new Date()))
  const [to, setTo] = useState(dayjs(new Date()))
  const [role, setRole] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
  const {ticketId} = useParams()
  useEffect(() => {
    const fetchReceiveIdAndDepartment = async () => {
      const response = await requestApi.getReceiveIdAndDepartment(userId)
      setReceiveIdAndDepartment(response)
    }
    fetchReceiveIdAndDepartment()
  }, [])

  console.log(receiveIdAndDepartment)

  const handleCreateRequest = (e) => {
    e.preventDefault()
    if (role == 'manager') {
      let data = {
        userId: userId,
        title: title,
        content: content,
        ticketId:ticketId,
        manualDate: from.format('YYYY-MM-DD'),
        manualFirstEntry: from.format('HH:mm:ss'),
        manualLastExit: to.format('HH:mm:ss'),
        departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
        receivedId: receiveIdAndDepartment?.managerInfoResponse?.managerId
      }

      requestApi.requestAttendanceFormExistTicket(data)
      console.log(data)
    } else if (role == 'hr') {
      let data = {
        userId: userId,
        title: title,
        content: content,
        ticketId:ticketId,
        manualDate: from.format('YYYY-MM-DD'),
        manualFirstEntry: from.format('HH:mm:ss'),
        manualLastExit: to.format('HH:mm:ss'),
        departmentId: receiveIdAndDepartment?.hrDepartmentResponse?.hrDepartmentId,
        receivedId: null
      }

      requestApi.requestAttendanceFormExistTicket(data)
      console.log(data)
    }
  }

  console.log(from.format('DD/MM/YYYY'))
  return (
    <Box p={3} pl={0}>
      <form onSubmit={handleCreateRequest}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography fontWeight="700" fontSize="18px">
              Request details{' '}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight="500">Title</Typography>
            <TextField
              onChange={(e) => setTitle(e.target.value)}
              sx={{ width: '100%' }}
              size="small"
              placeholder="Enter the request title"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight="500">Position</Typography>
            <Select
              sx={{ width: '100%', height: '56px' }}
              displayEmpty
              onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="hr">HR</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6} mb={2}>
            <Typography fontWeight="500">From</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={from}
                onChange={(e) => setFrom(e)}
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} mb={2}>
            <Typography fontWeight="500">To</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={to}
                onChange={(e) => setTo(e)}
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight="500">Content</Typography>
            <CKEditor
              editor={ClassicEditor}
              onChange={(event, editor) => {
                const data = editor.getData()
                setContent(data)
              }}
            />
          </Grid>
        </Grid>
        <Box pt={2} display="flex" alignItems="flex-end" justifyContent="flex-end">
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </form>
    </Box>
  )
}


const OtRequest = () => <Box p={3}>Ot Request From</Box>

const DepartmentRequest = () => <Box p={3}>Department Request From</Box>

const LeaveRequest = ({ userId }) => {
  const [content, setContent] = useState('')
  const [dateFrom, setDateFrom] = useState(dayjs(new Date()))
  const [dateTo, setDateTo] = useState(dayjs(new Date()))
  const [checked, setChecked] = useState(false)
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState(0)
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
  const handleChangeHalfDay = (event) => {
    setChecked(event.target.checked)
  }

  useEffect(() => {
    const fetchReceiveIdAndDepartment = async () => {
      const response = await requestApi.getReceiveIdAndDepartment(userId)
      setReceiveIdAndDepartment(response)
    }
    fetchReceiveIdAndDepartment()
  }, [])

  const handleSubmitLeaveRequest = (e) => {
    e.preventDefault()
    let data = {
      userId: userId,
      title: title,
      content: content,
      fromDate: dateFrom.format('YYYY-MM-DD'),
      toDate: dateTo.format('YYYY-MM-DD'),
      halfDay: checked,
      durationEvaluation: duration,
      departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
      receivedId: receiveIdAndDepartment?.managerInfoResponse?.managerId
    }
    console.log(data)
    requestApi.requestLeaveForm(data)
  }
  return (
    <Box p={3} pl={0}>
      <form onSubmit={handleSubmitLeaveRequest}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography fontWeight="700" fontSize="20px">
              Leave Request
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight="500">Title</Typography>
            <TextField
              onChange={(e) => setTitle(e.target.value)}
              sx={{ width: '100%' }}
              size="small"
              placeholder="Enter the request title"
            />
          </Grid>

          <Grid item xs={6} mb={2}>
            <Typography fontWeight="500">From</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dateFrom}
                onChange={(e) => setDateFrom(e)}
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} mb={2}>
            <Typography fontWeight="500">To</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dateTo}
                onChange={(e) => setDateTo(e)}
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} item xs={6}>
            <Typography fontWeight="500">Duration Evaluation</Typography>
            <TextField
              onChange={(e) => setDuration(e.target.value)}
              sx={{ width: '60%' }}
              size="small"
              placeholder="Enter the duration evaluation"
              type="number"
            />
          </Grid>
          <Grid sx={{ display: 'flex', alignItems: 'center' }} item xs={12}>
            <Typography fontWeight="500">Half Day</Typography>
            <Checkbox
              sx={{ padding: '0 0 0 5px' }}
              checked={checked}
              onChange={handleChangeHalfDay}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight="500">Content</Typography>
            <CKEditor
              editor={ClassicEditor}
              onChange={(event, editor) => {
                const data = editor.getData()
                setContent(data)
              }}
            />
          </Grid>
        </Grid>
        <Box pt={2} display="flex" alignItems="flex-end" justifyContent="flex-end">
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export { AttendenceFrom, DepartmentRequest, LeaveRequest, OtRequest }
