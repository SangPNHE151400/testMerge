import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Box, Button, Checkbox, Grid, Modal, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import requestApi from '../../../../services/requestApi'
import { validationSchema } from './util/validationSchema'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4
}

const AttendanceRequestModal = ({ openAttendanceRequest, handleCloseAttendanceRequest }) => {
    const [from, setFrom] = useState(dayjs(new Date()))
    const [to, setTo] = useState(dayjs(new Date()))
    const [date, setDate] = useState(dayjs(new Date()))
    const [content, setContent] = useState('')
    const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
    const userId = useSelector((state) => state.auth.login?.currentUser?.accountId)
    const currentUser = useSelector((state) => state.auth.login?.currentUser)
    const [isFrom, setIsFrom] = useState(true)
    const [isTo, setIsTo] = useState(true)
    const currentDate = new Date();
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    useEffect(() => {
      const fetchReceiveIdAndDepartment = async () => {
        const response = await requestApi.getReceiveIdAndDepartment(userId)
        setReceiveIdAndDepartment(response)
      }
      fetchReceiveIdAndDepartment()
    }, [])
  
    const handleChangeFrom = (event) => {
      setIsFrom(event.target.checked)
    }
  
    const handleChangeTo = (event) => {
      setIsTo(event.target.checked)
    }
  
    const formik = useFormik({
      initialValues: {
        title: '',
        content: ''
      },
      validationSchema: validationSchema,
      onSubmit: (values) => {
        let data = {
          userId: userId,
          title: values.title,
          content: content,
          manualDate: date.format('YYYY-MM-DD'),
          manualFirstEntry: isFrom ? from.format('HH:mm:ss') : null,
          manualLastExit: isTo ? to.format('HH:mm:ss') : null,
          departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
          receivedId: receiveIdAndDepartment?.managerInfoResponse?.managerId
        }
        console.log(data)
        requestApi.requestAttendanceForm(data)
      }
    })
  return (
    <Modal
      open={openAttendanceRequest}
      onClose={handleCloseAttendanceRequest}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style}>
      <Box p={3} pl={0}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography fontWeight="700" fontSize="18px">
                Attendance Request
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
            <Grid item xs={4} mb={2}>
              <Typography fontWeight="500">Date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={date}
                  onChange={(date) => {
                    setDate(date);
               
                  }}
                  renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
                  minDate={firstDayOfMonth}
                  maxDate={lastDayOfMonth}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4} mb={2}>
              <Box display="flex" gap="5px">
                <Typography fontWeight="500">From</Typography>
                <Checkbox sx={{ p: 0 }} checked={isFrom} onChange={handleChangeFrom} />
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  disabled={isFrom ? false : true}
                  value={from}
                  onChange={(e) => setFrom(e)}
                  renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4} mb={2}>
              <Box display="flex" gap="5px">
                <Typography fontWeight="500">To</Typography>
                <Checkbox sx={{ p: 0 }} checked={isTo} onChange={handleChangeTo} />
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  disabled={isTo ? false : true}
                  value={to}
                  onChange={(e) => setTo(e)}
                  renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight="500">Content</Typography>
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


export default AttendanceRequestModal
