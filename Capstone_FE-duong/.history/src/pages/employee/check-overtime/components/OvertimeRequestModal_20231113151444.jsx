import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Box, Button, Grid, MenuItem, Modal, Select, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import requestApi from '../../../../services/requestApi'
import { validationSchema } from './util/validationSchema'
import overtimeApi from '../../../../services/overtimeApi'

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

const OvertimeRequestModal = ({ openOvertimeRequest, handleCloseOvertimeRequest }) => {
  const [from, setFrom] = useState(dayjs(new Date()))
  const [to, setTo] = useState(dayjs(new Date()))
  const [date, setDate] = useState(dayjs(new Date()))
  const [overtimeSystem, setOvertimeSystem] = useState({})
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
  const userId = useSelector((state) => state.auth.login?.currentUser?.accountId)
  useEffect(() => {
    const fetchReceiveIdAndDepartment = async () => {
      const response = await requestApi.getReceiveIdAndDepartment(userId)
      setReceiveIdAndDepartment(response)
    }
    fetchReceiveIdAndDepartment()
  }, [])
  useEffect(() => {
    const fetchOvertimeSystem = async () => {
      const response = await overtimeApi.getOvertimeSystem(userId, date.format('YYYY-MM-DD'))
      setOvertimeSystem(response)
    }
    fetchOvertimeSystem()
  }, [date])
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
        content: values.content,
        topicOvertime: values.topicOvertime,
        overtimeDate: date.format('YYYY-MM-DD'),
        fromTime: from.format('HH:mm:ss'),
        toTime: to.format('HH:mm:ss'),
        departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
        receivedId: receiveIdAndDepartment?.managerInfoResponse?.managerId
      }
      console.log(data)
      requestApi.requestOverTimeForm(data)
      handleCloseOvertimeRequest()
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
                  Overtime Request
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ mb: 1 }}>
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
                  <Typography sx={{ color: 'red' }} className="error-message">
                    {formik.errors.title}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Select
                  sx={{ width: '100%' }}
                  onChange={(e) => {
                    formik.handleChange(e)
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.topicOvertime}
                  name="topicOvertime"
                  displayEmpty>
                  <MenuItem value="WEEKEND_AND_NORMAL_DAY">WEEKEND AND NORMAL DAY</MenuItem>
                  <MenuItem value="HOLIDAY">HOLIDAY</MenuItem>
                </Select>
                {formik.touched.topicOvertime && formik.errors.topicOvertime && (
                  <Typography sx={{ color: 'red' }} className="error-message">
                    {formik.errors.topicOvertime}
                  </Typography>
                )}
              </Grid>
              {overtimeSystem?.systemCheckin === null ? (
                <Grid item xs={6} mb={2}>
                  <Typography fontWeight="500">System Check In</Typography>
                  <TextField sx={{ width: '100%' }} disabled value="0:00" />
                </Grid>
              ) : (
                <Grid item xs={6} mb={2}>
                  <Typography fontWeight="500">System Check In</Typography>
                  <TextField
                    sx={{ width: '100%' }}
                    disabled
                    value={overtimeSystem?.systemCheckin}
                  />
                </Grid>
              )}

              {overtimeSystem?.systemCheckout === null ? (
                <Grid item xs={6} mb={2}>
                  <Typography fontWeight="500">System Check Out</Typography>
                  <TextField sx={{ width: '100%' }} disabled value="0:00" />
                </Grid>
              ) : (
                <Grid item xs={6} mb={2}>
                  <Typography fontWeight="500">System Check Out</Typography>
                  <TextField
                    sx={{ width: '100%' }}
                    disabled
                    value={overtimeSystem?.systemCheckout}
                  />
                </Grid>
              )}
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
                {/* {formik.touched.content && formik.errors.content && (
              <div className="error-message">{formik.errors.content}</div>
            )} */}
              </Grid>
            </Grid>
            <Box pt={2} display="flex" alignItems="flex-end" justifyContent="flex-end">
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
