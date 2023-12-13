import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Box, Button, Grid, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import requestApi from '../../../../services/requestApi'
import { validationSchema } from './util/validationSchema'
import dayjs from 'dayjs'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

const OvertimeRequestModal = ({ openOvertimeRequest, handleCloseOvertimeRequest, dailyLogModal }) => {
    const [from, setFrom] = useState(dayjs(new Date()))
    const [to, setTo] = useState(dayjs(new Date()))
    const [date, setDate] = useState(dayjs(new Date()))
    const [content, setContent] = useState('')
    const [topicOvertime, settopicOvertime] = useState('')
    const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
    const userId = useSelector((state) => state.auth.login?.currentUser?.accountId)
    const currentUser = useSelector((state) => state.auth.login?.currentUser)
    let inputDateString = dailyLogModal?.dateDaily
  
    let inputDate = new Date(inputDateString)
  
    let year = inputDate.getFullYear()
    let month = (inputDate.getMonth() + 1).toString().padStart(2, '0')
    let day = inputDate.getDate().toString().padStart(2, '0')
  
    let outputDateString = `${year}-${month}-${day}`
    const handleChange = (event) => {
      settopicOvertime(event.target.value)
    }
    useEffect(() => {
      const fetchReceiveIdAndDepartment = async () => {
        const response = await requestApi.getReceiveIdAndDepartment(userId)
        setReceiveIdAndDepartment(response)
      }
      fetchReceiveIdAndDepartment()
    }, [])
  
    const formik = useFormik({
      initialValues: {
        title: '',
        content: '',
        topicOvertime: ''
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        let data = {
          userId: userId,
          title: values.title,
          content: content,
          topicOvertime: topicOvertime,
          overtimeDate: date.format('YYYY-MM-DD'),
          fromTime: from.format('HH:mm:ss'),
          toTime: to.format('HH:mm:ss'),
          departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
          receivedId: receiveIdAndDepartment?.managerInfoResponse?.managerId
        }
        console.log(data)
        requestApi.requestOverTimeForm(data)
      }
    })
  return (
    <Modal
      open={openOvertimeRequest}
      onClose={handleCloseOvertimeRequest}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style}>
      <Box p={3} pl={0}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography fontWeight="700" fontSize="18px">
              Request details
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight="500">Title</Typography>
            <TextField
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
              sx={{ width: '100%' }}
              size="small"
              placeholder="Enter the request title"
            />
            {formik.touched.title && formik.errors.title && (
              <div className="error-message">{formik.errors.title}</div>
            )}
          </Grid>
          <Grid item xs={12}>
            <Select
              value={topicOvertime}
              sx={{ width: '100%' }}
              onChange={handleChange}
              displayEmpty>
              <MenuItem value="WEEKEND_AND_NORMAL_DAY">WEEKEND AND NORMAL DAY</MenuItem>
              <MenuItem value="HOLIDAY">HOLIDAY</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={4} mb={2}>
            <Typography fontWeight="500">Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={(e) => setDate(e)}
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4} mb={2}>
            <Typography fontWeight="500">From</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={from}
                onChange={(e) => setFrom(e)}
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4} mb={2}>
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
            <Typography fontWeight="500">Reason</Typography>
            <CKEditor
              data={content}
              editor={ClassicEditor}
              onChange={(event, editor) => {
                const data = editor.getData()
                setContent(data)
              }}
            />
            {/* {formik.touched.content && formik.errors.content && (
              <div className="error-message">{formik.errors.content}</div>
            )} */}
          </Grid>
        </Grid>
        <Box pt={2} display="flex" alignItems="flex-end" justifyContent="space-between">
          {currentUser?.role === 'employee' ? (
            <Link to="/request-list-employee">
              <Button type="submit" variant="contained">
                Back
              </Button>
            </Link>
          ) : currentUser?.role === 'manager' ? (
            <Link to="/request-manager-list">
              <Button type="submit" variant="contained">
                Back
              </Button>
            </Link>
          ) : currentUser?.role === 'admin' ? (
            <Link to="/request-list-admin">
              <Button type="submit" variant="contained">
                Back
              </Button>
            </Link>
          ) : currentUser?.role === 'hr' ? (
            <Link to="/request-hr-list">
              <Button type="submit" variant="contained">
                Back
              </Button>
            </Link>
          ) : (
            <></>
          )}
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </form>
    </Box>
      </Box>
    </Modal>
  )
}

export default OvertimeRequestModal
