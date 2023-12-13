import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Box, Button, Checkbox, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import requestApi from '../../../../services/requestApi'
import { validationSchema } from '../util/validationSchema'

ClassicEditor.defaultConfig = {
  toolbar: {
    items: ['heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList']
  },
  language: 'en'
}
const AttendenceFrom = ({ userId }) => {
  const [from, setFrom] = useState(dayjs(new Date()))
  const [to, setTo] = useState(dayjs(new Date()))
  const [date, setDate] = useState(dayjs(new Date()))
  const [content, setContent] = useState('')
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
  const currentUser = useSelector((state) => state.auth.login?.currentUser)

  useEffect(() => {
    const fetchReceiveIdAndDepartment = async () => {
      const response = await requestApi.getReceiveIdAndDepartment(userId)
      setReceiveIdAndDepartment(response)
    }
    fetchReceiveIdAndDepartment()
  }, [])

  // const handleCreateRequest = (e) => {
  //   e.preventDefault();
  //   let data = {
  //     userId: userId,
  //     title: title,
  //     content: content,
  //     manualDate: from.format('YYYY-MM-DD'),
  //     manualFirstEntry: from.format('HH:mm:ss'),
  //     manualLastExit: to.format('HH:mm:ss'),
  //     departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
  //     receivedId: receiveIdAndDepartment?.managerInfoResponse?.managerId
  //   };
  //   requestApi.requestAttendanceForm(data);
  //   setTitle('');
  //   setContent('');
  //   console.log(data);
  // };

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
        manualDate: from.format('YYYY-MM-DD'),
        manualFirstEntry: from.format('HH:mm:ss'),
        manualLastExit: to.format('HH:mm:ss'),
        departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
        receivedId: receiveIdAndDepartment?.managerInfoResponse?.managerId
      }
      console.log(data)
      requestApi.requestAttendanceForm(data)
    }
  })
  return (
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
          <Box display='flex' gap='5px'>
              <Typography fontWeight="500">From</Typography>
              <Checkbox sx={{p: 0}} />
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={from}
                onChange={(e) => setFrom(e)}
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4} mb={2}>
            <Box display='flex' gap='5px'>
              <Typography fontWeight="500">To</Typography>
              <Checkbox sx={{p: 0}} />
            </Box>
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
  )
}

const OtFrom = () => {
  const [from, setFrom] = useState(dayjs(new Date()))
  const [to, setTo] = useState(dayjs(new Date()))
  const [date, setDate] = useState(dayjs(new Date()))
  const [content, setContent] = useState('')
  const [topicOvertime, settopicOvertime] = useState('')
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
  const userId = useSelector((state) => state.auth.login?.currentUser?.accountId)
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
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
  )
}

const OtherRequest = ({ userId }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState()
  const [getAllManagerDepartment, setGetAllManagerDepartment] = useState([])
  const [manager, setManager] = useState('')
  const handleChange = (event) => {
    setRole(event.target.value)
  }
  const handleChangeDepartment = (event) => {
    setDepartment(event.target.value)
  }

  useEffect(() => {
    const fetchReceiveIdAndDepartment = async () => {
      const response = await requestApi.getReceiveIdAndDepartment(userId)
      setReceiveIdAndDepartment(response)
      console.log(response)
    }
    fetchReceiveIdAndDepartment()
  }, [])

  useEffect(() => {
    const fetchAllManagerDepartment = async () => {
      const response = await requestApi.getAllManagerDepartment()
      setGetAllManagerDepartment(response)
    }
    fetchAllManagerDepartment()
  }, [])

  console.log(department)
  const handleCreateRequest = (e) => {
    if (currentUser?.role === 'employee' && role === 'manager') {
      callApiEmployee(e, receiveIdAndDepartment?.managerInfoResponse?.managerId)
    } else if (currentUser?.role === 'employee' && role === 'hr') {
      callApiOther(e, 3)
    } else if (currentUser?.role === 'employee' && role === 'security') {
      callApiOther(e, 10)
    } else if (currentUser?.role === 'employee' && role === 'admin') {
      callApiOther(e, 9)
    } else if (currentUser?.role === 'manager' && role === 'admin') {
      callApiOther(e, 9)
    } else if (currentUser?.role === 'manager' && role === 'security') {
      callApiOther(e, 10)
    } else if (currentUser?.role === 'manager' && role === 'hr') {
      callApiOther(e, 3)
    } else if (currentUser?.role === 'hr' && role === 'admin') {
      callApiOther(e, 9)
    } else if (currentUser?.role === 'hr' && role === 'security') {
      callApiOther(e, 10)
    } else if (currentUser?.role === 'hr' && role === 'manager') {
      callApiToManager(e, department)
    } else if (currentUser?.role === 'security' && role === 'admin') {
      callApiOther(e, 9)
    } else if (currentUser?.role === 'security' && role === 'hr') {
      callApiOther(e, 3)
    } else if (currentUser?.role === 'security' && role === 'manager') {
      callApiToManager(e, department)
    } else if (currentUser?.role === 'admin' && role === 'security') {
      callApiOther(e, 10)
    } else if (currentUser?.role === 'admin' && role === 'hr') {
      callApiOther(e, 3)
    } else if (currentUser?.role === 'admin' && role === 'manager') {
      callApiToManager(e, department)
    }
  }

  useEffect(() => {
    if (getAllManagerDepartment.length !== 0) {
      const getManagerByDepartment = async () => {
        let res = await requestApi.getManagerByDepartment(department)
        setManager(res)
      }
      getManagerByDepartment()
    }
  }, [department])

  const callApiOther = (e, departmentId) => {
    e.preventDefault()
    let data = {
      userId: userId,
      title: title,
      content: content,
      departmentId: departmentId
    }
    console.log(data)
    setTitle('')
    setContent('')
    setDepartment('')
    requestApi.requestOtherForm(data)
  }

  const callApiToManager = (e, departmentId) => {
    e.preventDefault()
    let data = {
      userId: userId,
      title: title,
      content: content,
      departmentId: departmentId,
      receivedId: manager[0].accountId
    }
    console.log(data)
    setTitle('')
    setContent('')
    setDepartment('')
    requestApi.requestOtherForm(data)
  }

  const callApiEmployee = (e, managerId) => {
    e.preventDefault()
    let data = {
      userId: userId,
      title: title,
      content: content,
      departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
      receivedId: managerId
    }
    setTitle('')
    setContent('')
    requestApi.requestOtherForm(data)
  }

  // const formik = useFormik({
  //   initialValues: {
  //     title: '',
  //   },
  //   validationSchema: validationSchema,
  //   onSubmit: (values) => {
  //     let data = {
  //       userId: userId,
  //       title: title,
  //       content: content,
  //       departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
  //       receivedId: managerId
  //     };
  //     console.log(data);
  //     if (currentUser?.role === 'employee' && role === 'manager') {
  //       callApiEmployee(e, receiveIdAndDepartment?.managerInfoResponse?.managerId)
  //     } else if (currentUser?.role === 'employee' && role === 'hr') {
  //       callApiOther(e, 3)
  //     } else if (currentUser?.role === 'employee' && role === 'security') {
  //       callApiOther(e, 10)
  //     } else if (currentUser?.role === 'employee' && role === 'admin') {
  //       callApiOther(e, 9)
  //     } else if (currentUser?.role === 'manager' && role === 'admin') {
  //       callApiOther(e, 9)
  //     } else if (currentUser?.role === 'manager' && role === 'security') {
  //       callApiOther(e, 10)
  //     } else if (currentUser?.role === 'manager' && role === 'hr') {
  //       callApiOther(e, 3)
  //     } else if (currentUser?.role === 'hr' && role === 'admin') {
  //       callApiOther(e, 9)
  //     } else if (currentUser?.role === 'hr' && role === 'security') {
  //       callApiOther(e, 10)
  //     } else if (currentUser?.role === 'hr' && role === 'manager') {
  //       callApiToManager(e, department)
  //     } else if (currentUser?.role === 'security' && role === 'admin') {
  //       callApiOther(e, 9)
  //     } else if (currentUser?.role === 'security' && role === 'hr') {
  //       callApiOther(e, 3)
  //     } else if (currentUser?.role === 'security' && role === 'manager') {
  //       callApiToManager(e, department)
  //     } else if (currentUser?.role === 'admin' && role === 'security') {
  //       callApiOther(e, 10)
  //     } else if (currentUser?.role === 'admin' && role === 'hr') {
  //       callApiOther(e, 3)
  //     } else if (currentUser?.role === 'admin' && role === 'manager') {
  //       callApiToManager(e, department)
  //     }
  //   },
  // });

  const handleDepartment = () => {
    if (currentUser?.role === 'admin' && role === 'manager') {
      return (
        <>
          <Typography mt={2} fontWeight="500">
            Department
          </Typography>
          <Select
            value={department}
            sx={{ width: '100%' }}
            onChange={handleChangeDepartment}
            displayEmpty>
            {getAllManagerDepartment.map((item) => (
              <MenuItem key={item.departmentId} value={item.departmentId}>
                {item.departmentName}{' '}
              </MenuItem>
            ))}
          </Select>
        </>
      )
    } else if (currentUser?.role === 'hr' && role === 'manager') {
      return (
        <>
          <Typography mt={2} fontWeight="500">
            Department
          </Typography>
          <Select
            value={department}
            sx={{ width: '100%' }}
            onChange={handleChangeDepartment}
            displayEmpty>
            {getAllManagerDepartment.map((item) => (
              <MenuItem key={item.departmentId} value={item.departmentId}>
                {item.departmentName}
              </MenuItem>
            ))}
          </Select>
        </>
      )
    } else if (currentUser?.role === 'security' && role === 'manager') {
      return (
        <>
          <Typography mt={2} fontWeight="500">
            Department
          </Typography>
          <Select
            value={department}
            sx={{ width: '100%' }}
            onChange={handleChangeDepartment}
            displayEmpty>
            {getAllManagerDepartment.map((item) => (
              <MenuItem key={item.departmentId} value={item.departmentId}>
                {item.departmentName}{' '}
              </MenuItem>
            ))}
          </Select>
        </>
      )
    }
  }

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
              value={title}
              sx={{ width: '100%' }}
              size="small"
              placeholder="Enter the request title"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight="500">Position</Typography>
            {currentUser?.role === 'employee' ? (
              <Select value={role} sx={{ width: '100%' }} onChange={handleChange} displayEmpty>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
                <MenuItem value="security">Security</MenuItem>
              </Select>
            ) : currentUser?.role === 'hr' ? (
              <Select value={role} sx={{ width: '100%' }} onChange={handleChange} displayEmpty>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="security">Security</MenuItem>
              </Select>
            ) : currentUser?.role === 'admin' ? (
              <Select value={role} sx={{ width: '100%' }} onChange={handleChange} displayEmpty>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
                <MenuItem value="security">Security</MenuItem>
              </Select>
            ) : currentUser?.role === 'manager' ? (
              <Select value={role} sx={{ width: '100%' }} onChange={handleChange} displayEmpty>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
                <MenuItem value="security">Security</MenuItem>
              </Select>
            ) : currentUser?.role === 'security' ? (
              <Select value={role} sx={{ width: '100%' }} onChange={handleChange} displayEmpty>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
              </Select>
            ) : (
              <></>
            )}

            {handleDepartment()}
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
            <Link to="/request-manager-list'">
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
  )
}

const LateRequest = () => {
  const [date, setDate] = useState(dayjs(new Date()))
  const [content, setContent] = useState('')
  const [lateType, setLateType] = useState('')
  const [lateDuration, setLateDuration] = useState('')
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
  const userId = useSelector((state) => state.auth.login?.currentUser?.accountId)
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const handleChange = (event) => {
    setLateType(event.target.value)
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
      lateType: '',
      lateDuration: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let data = {
        userId: userId,
        title: values.title,
        content: content,
        lateType: lateType,
        lateDuration: lateDuration,
        requestDate: date.format('YYYY-MM-DD'),
        departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
        receivedId: receiveIdAndDepartment?.managerInfoResponse?.managerId
      }
      requestApi.requestLateForm(data)
    }
  })

  return (
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
            Type
            <Select value={lateType} sx={{ width: '100%' }} onChange={handleChange} displayEmpty>
              <MenuItem value="LATE_MORNING">MORNING</MenuItem>
              <MenuItem value="LATE_AFTERNOON">AFTERNOON</MenuItem>
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
            <Typography fontWeight="500">Duration</Typography>
            <TextField
              value={lateDuration}
              onChange={(e) => {
                const inputValue = parseInt(e.target.value, 10)
                if (inputValue > 90) {
                  setLateDuration(90)
                } else if (inputValue < 0) {
                  setLateDuration(0)
                } else {
                  setLateDuration(inputValue)
                }
              }}
              sx={{ width: '100%' }}
              type="number"
            />
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
  )
}

const LeaveRequest = ({ userId }) => {
  const [content, setContent] = useState('')
  const [dateFrom, setDateFrom] = useState(dayjs(new Date()))
  const [dateTo, setDateTo] = useState(dayjs(new Date()))
  const [checked, setChecked] = useState(false)
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
  const currentUser = useSelector((state) => state.auth.login?.currentUser)

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

  const formik = useFormik({
    initialValues: {
      title: '',
      durationEvaluation: 0
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (dateFrom.format('YYYY-MM-DD') === dateTo.format('YYYY-MM-DD')) {
        let data = {
          userId: userId,
          title: values.title,
          content: content,
          fromDate: dateFrom.format('YYYY-MM-DD'),
          toDate: dateTo.format('YYYY-MM-DD'),
          halfDay: checked,
          durationEvaluation: values.durationEvaluation,
          departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
          receivedId: receiveIdAndDepartment?.managerInfoResponse?.managerId
        }
        console.log(data)
        requestApi.requestLeaveForm(data)
      } else {
        let data = {
          userId: userId,
          title: values.title,
          content: content,
          fromDate: dateFrom.format('YYYY-MM-DD'),
          toDate: dateTo.format('YYYY-MM-DD'),
          halfDay: false,
          durationEvaluation: 0,
          departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
          receivedId: receiveIdAndDepartment?.managerInfoResponse?.managerId
        }
        console.log(data)
        requestApi.requestLeaveForm(data)
      }
    }
  })

  console.log(dateFrom.format('YYYY-MM-DD'))
  console.log(dateTo.format('YYYY-MM-DD'))
  return (
    <Box p={3} pl={0}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography fontWeight="700" fontSize="20px">
              Leave Request
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
          {dateFrom.format('YYYY-MM-DD') === dateTo.format('YYYY-MM-DD') && (
            <>
              <Grid sx={{ display: 'flex', alignItems: 'center', gap: '10px' }} item xs={6}>
                <Typography fontWeight="500">Duration Evaluation (h)</Typography>
                <TextField
                  name="durationEvaluation"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={checked ? 4 : formik.values.durationEvaluation}
                  sx={{ width: '60%' }}
                  size="small"
                  type="number"
                  disabled={checked}
                />
                {formik.touched.durationEvaluation && formik.errors.durationEvaluation && (
                  <div className="error-message">{formik.errors.durationEvaluation}</div>
                )}
              </Grid>
              <Grid sx={{ display: 'flex', alignItems: 'center' }} item xs={12}>
                <Typography fontWeight="500">Half Day</Typography>
                <Checkbox
                  sx={{ padding: '0 0 0 5px' }}
                  checked={checked}
                  onChange={handleChangeHalfDay}
                />
              </Grid>
            </>
          )}
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
            <Link to="/request-manager-list'">
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
  )
}

export { AttendenceFrom, LeaveRequest, OtFrom, OtherRequest, LateRequest }
