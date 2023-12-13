import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import ClearIcon from '@mui/icons-material/Clear'
import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Header from '../../../components/Header'
import { BASE_URL } from '../../../services/constraint'
import requestApi from '../../../services/requestApi'
import userApi from '../../../services/userApi'
import axiosClient from '../../../utils/axios-config'
import ChatTopbar from '../chat/components/ChatTopbar'
import notificationApi from '../../../services/notificationApi'
import { validationSchema } from '../edit-notification/util/validationSchema'
import { storage } from '../../../firebase/config'
import { getDownloadURL, ref } from 'firebase/storage'
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />
ClassicEditor.defaultConfig = {
  toolbar: {
    items: ['heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList']
  },
  language: 'en'
}

const EditNotification = () => {
  const theme = useTheme()
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const [checkedSetupTime, setCheckedSetupTime] = useState(true)
  const [setupTime, setSetupTime] = useState(dayjs(new Date()))
  const [departments, setDepartments] = useState([])
  const [departmentId, setDepartmentId] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [users, setUsers] = useState([])
  const [updateFilteredUsers, setUpdateFilteredUsers] = useState([])
  const [file, setFile] = useState([])
  const [isSave, setIsSave] = useState(true)
  const [fileImage, setFileImage] = useState({
    file: [],
    filepreview: []
  })

  const [notificationDetail, setNotificationDetail] = useState('')
  const [notificationFiles, setNotificationFiles] = useState([])
  const [notificationImages, setNotificationImages] = useState([])
  const [progress, setProgress] = useState(0)
  const {notificationId} = useParams()
  useEffect(() => {
    const fetchAllUsers = async () => {
      const response = await userApi.getAllUserByUserId(currentUser?.accountId)
      setUsers(response)
    }
    fetchAllUsers()
  }, [])
  const handleAutocompleteChange = (event, newValue) => {
    setSelectedUsers(newValue.map((option) => option.accountId))
    setUpdateFilteredUsers(newValue.map((option) => option))
  }

  const handleChangeSetupTime = (event) => {
    setCheckedSetupTime(event.target.checked)
  }

  const handleSaveDraft = (event) => {
    setIsSave(event.target.checked)
  }

  useEffect(() => {
    const fetchNotificationDetail = async () => {

        let data = {
          userId: currentUser?.accountId,
          notificationId: notificationId
        }

        const res = await notificationApi.getNotificationDetailByCreator(data)
        setNotificationDetail(res)
        setNotificationFiles(res?.notificationFiles)
        setNotificationImages(res?.notificationImages)
    
      
    }

    fetchNotificationDetail()
  }, [])

  console.log(notificationDetail); 
  const handleChangeDepartment = (event) => {
    const { name, checked } = event.target
    let updatedDepartmentId

    if (checked) {
      updatedDepartmentId = [...departmentId, name]
      const filteredSelectedUser = users.filter((user) => user.departmentId === name)
      const updateFilteredUser = filteredSelectedUser.map((item) => {
        return item.accountId
      })
      setSelectedUsers((prevSelectedUsers) => [
        ...new Set([...prevSelectedUsers, ...updateFilteredUser])
      ])
      setUpdateFilteredUsers((prevUpdateFilteredUsers) => [
        ...new Set([...prevUpdateFilteredUsers, ...filteredSelectedUser])
      ])
    } else {
      updatedDepartmentId = departmentId.filter((id) => id !== name)
      setUpdateFilteredUsers((prevUpdateFilteredUsers) =>
        prevUpdateFilteredUsers.filter((user) => user.departmentId !== name)
      )
      const filteredSelectedUser = users.filter((user) => user.departmentId !== name)
      const updateFilteredUser = filteredSelectedUser.map((item) => item.accountId)

      setSelectedUsers((prevSelectedUsers) => [
        ...prevSelectedUsers.filter((accountId) => updateFilteredUser.includes(accountId))
      ])
    }

    setDepartmentId(updatedDepartmentId)

    const filteredUser = users.filter((user) => updatedDepartmentId.includes(user.departmentId))
    setFilteredUsers(filteredUser)
  }

  useEffect(() => {
    const getAllDepartments = async () => {
      const res = await requestApi.getAllDepartment()
      setDepartments(res)
    }

    getAllDepartments()
  }, [])

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files

    if (selectedFiles.length > 0) {
      const acceptedFileTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/pdf',
        'text/csv'
      ]
      const invalidFiles = []

      for (let i = 0; i < selectedFiles.length; i++) {
        if (!acceptedFileTypes.includes(selectedFiles[i].type)) {
          invalidFiles.push(selectedFiles[i].name)
        }
      }

      if (invalidFiles.length === 0) {
        setFile([...file, ...selectedFiles])
      } else {
        toast.error(
          `Invalid file types: ${invalidFiles.join(', ')}. Please select Word, PDF, or CSV files.`
        )
      }
    }
  }

  const handleDelete = (fileToDelete) => () => {
    const updatedFiles = file.filter((file) => file !== fileToDelete)
    setFile(updatedFiles)
  }

  const handleInputImageChange = (event) => {
    if (event && event.target.files) {
      const selectedFiles = event.target.files
      const fileArray = Array.from(selectedFiles)

      const previews = fileArray.map((file) => URL.createObjectURL(file))

      setFileImage({
        file: [...fileImage.file, ...fileArray],
        filepreview: [...fileImage.filepreview, ...previews]
      })
    }
  }

  const handleDeleteImage = (index) => {
    const updatedFiles = [...fileImage.file]
    const updatedPreviews = [...fileImage.filepreview]

    updatedFiles.splice(index, 1)
    updatedPreviews.splice(index, 1)

    setFileImage({
      file: updatedFiles,
      filepreview: updatedPreviews
    })
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: notificationDetail?.title,
      priority: notificationDetail?.priority,
      isAllDepartment: notificationDetail?.sendAll === true ? 'allDepartment' : 'other',
      content: notificationDetail?.content
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (isSave) {
        let formData = new FormData()
        const data = {
          buttonStatus: 'save',
          userId: currentUser?.accountId,
          title: values.title,
          sendAllStatus: values.isAllDepartment === 'allDepartment' ? true : false,
          receiverId: values.isAllDepartment === 'allDepartment' ? [] : selectedUsers,
          priority: values.priority,
          content: values.content,
          uploadDatePlan: checkedSetupTime ? setupTime.format('YYYY-MM-DD HH:mm:ss') : null
        }
        formData.append('data', JSON.stringify(data))
        fileImage.file.forEach((file) => {
          formData.append(`image[]`, file)
        })
        file.forEach((files) => {
          formData.append(`file[]`, files)
        })
        try {
          await axiosClient.post(`${BASE_URL}/saveNewNotification`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (data) => {
              setProgress(Math.round((100 * data.loaded) / data.total))
            }
          })
          toast.success('Save draft notification successfully!!')
        } catch (error) {
          if (error.response.status === 400) {
            toast.error("You can't select upload time before current time!")
          }
        }
      } else {
        let formData = new FormData()
        const data = {
          buttonStatus: 'upload',
          userId: currentUser?.accountId,
          title: values.title,
          sendAllStatus: values.isAllDepartment === 'allDepartment' ? true : false,
          receiverId: values.isAllDepartment === 'allDepartment' ? [] : selectedUsers,
          priority: values.priority,
          content: values.content,
          uploadDatePlan: checkedSetupTime ? setupTime.format('YYYY-MM-DD HH:mm:ss') : null
        }
        formData.append('data', JSON.stringify(data))
        fileImage.file.forEach((file) => {
          formData.append(`image[]`, file)
        })
        file.forEach((files) => {
          formData.append(`file[]`, files)
        })
        try {
          await axiosClient.post(`${BASE_URL}/saveNewNotification`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (data) => {
              setProgress(Math.round((100 * data.loaded) / data.total))
            }
          })
          toast.success('Upload notification successfully!!')
        } catch (error) {
          if (error.response.status === 400) {
            toast.error("You can't select upload time before current time!")
          }
        }
      }
    }
  })

  const imgurl = async () => {
    if (notificationImages.length > 0) {
      try {
        const downloadURLPromises = notificationImages.map((item) => {
          if (item.imageFileName === 'unknown') {
            return Promise.resolve(null)
          } else {
            const storageRef = ref(storage, `/${item.imageFileName}`)
            return getDownloadURL(storageRef)
          }
        })

        const downloadURLs = await Promise.all(downloadURLPromises)
        console.log(downloadURLs)
        const updatedUsersProfile = notificationImages.map((item, index) => ({
          ...item,
          imageFileName: downloadURLs[index]
        }))
        setNotificationImages(updatedUsersProfile)
      } catch (error) {
        console.error('Error getting download URLs:', error)
      }
    }
  }

  useEffect(() => {
    imgurl()
  }, [notificationImages])

  console.log(departmentId);
  return (
    <Box bgcolor={theme.palette.bgColorPrimary.main}>
      <ChatTopbar />
      <Box
        className="App"
        sx={{
          mx: 4,
          my: 2
        }}>
        <Grid container>
          <Grid item xs={12}>
            <form noValidate onSubmit={formik.handleSubmit}>
              <Card>
                <CardContent>
                  <Header title="Create Notification" />
                  <Box sx={{ mb: 1 }}>
                    <Grid item container spacing={3}>
                      <Grid item xs={12}>
                        <Typography mb={1}>Title: </Typography>
                        <TextField
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.title}
                          fullWidth
                          label="Title"
                          type="text"
                          name="title"
                          InputLabelProps={{ shrink: true }}
                        />
                        {formik.touched.title && formik.errors.title ? (
                          <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                            {formik.errors.title}
                          </Typography>
                        ) : null}
                      </Grid>
                      <Grid item xs={7}>
                        <Typography mb={2}>Attach file: </Typography>
                        <Box mb={3} alignItems="center" gap="10px" display="flex">

                                <Chip key={index} label={item.fileName} onDelete={handleDelete(item)} />
                           
                          </Box>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography>Choose Receiver: </Typography>
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            onChange={(e) => {
                              formik.setFieldValue('isAllDepartment', e.target.value)
                            }}
                            onBlur={formik.handleBlur}
                            value={formik.values.isAllDepartment}>
                            <FormControlLabel
                              value="allDepartment"
                              control={<Radio />}
                              label="All"
                            />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                          </RadioGroup>
                        </FormControl>
                        {formik.touched.isAllDepartment && formik.errors.isAllDepartment ? (
                          <Typography sx={{ color: 'red', textAlign: 'left', fontSize: '15px' }}>
                            {formik.errors.isAllDepartment}
                          </Typography>
                        ) : null}
                      </Grid>
                      {formik.values.isAllDepartment === 'other' && (
                        <>
                          <Grid item xs={6}>
                            <FormControl component="fieldset" variant="standard">
                              <FormLabel component="legend">Department: </FormLabel>
                              <FormGroup>
                                {departments.map((item) => (
                                  <>
                                    <FormControlLabel
                                      key={item.departmentId}
                                      control={
                                        <Checkbox
                                          onChange={handleChangeDepartment}
                                          name={item.departmentId}
                                        />
                                      }
                                      label={item.departmentName}
                                    />
                                  </>
                                ))}
                              </FormGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            {filteredUsers.length > 0 && (
                              <Autocomplete
                                multiple
                                id="checkboxes-tags-demo"
                                disableCloseOnSelect
                                options={filteredUsers}
                                getOptionLabel={(option) => option.username}
                                onChange={handleAutocompleteChange}
                                value={updateFilteredUsers}
                                renderOption={(props, option, { selected }) => (
                                  <li {...props}>
                                    <Checkbox
                                      icon={icon}
                                      checkedIcon={checkedIcon}
                                      style={{ marginRight: 8 }}
                                      checked={selected}
                                    />
                                    {option.username} ({option.departmentName})
                                  </li>
                                )}
                                style={{ width: 500 }}
                                renderInput={(params) => <TextField {...params} label="User" />}
                              />
                            )}
                          </Grid>
                        </>
                      )}

                      <Grid display="flex" alignItems="center" gap="10px" item xs={12}>
                        <Typography>Priority: </Typography>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={formik.values.priority}
                                onChange={(e) => {
                                  formik.setFieldValue('priority', e.target.checked)
                                  formik.setFieldTouched('priority', true)
                                }}
                              />
                            }
                          />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography mb={2}>Attach file: </Typography>
                        <Box mb={3} alignItems="center" gap="10px" display="flex">
                          {notificationFiles.length > 0 &&
                            notificationFiles.map((item, index) => (
                              <>
                                <Chip key={index} label={item.fileName} onDelete={handleDelete(item)} />
                              </>
                            ))}
                          {notificationImages.length > 0 &&
                            notificationImages.map((item, index) => (
                              <>
                                <img width="150px" height="100px" key={index} src={item.imageFileName} />
                                <IconButton>
                                  <ClearIcon onClick={() => handleDeleteImage(index)} />
                                </IconButton>
                              </>
                            ))}
                        </Box>
                        <input
                          id="customFileInput"
                          multiple
                          type="file"
                          accept=".docx,.pdf,.csv"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                        <label
                          htmlFor="customFileInput"
                          id="customFileLabel"
                          style={{
                            padding: '10px',
                            backgroundColor: 'yellow',
                            borderRadius: '5px',
                            margin: '0px',
                            cursor: 'pointer'
                          }}>
                          Choose file
                        </label>
                        <input
                          id="customInput"
                          multiple
                          onChange={(e) => handleInputImageChange(e)}
                          type="file"
                          accept=".jpg, .png"
                          style={{ display: 'none' }}
                        />
                        <label
                          htmlFor="customInput"
                          id="customFileLabel"
                          style={{
                            padding: '10px',
                            backgroundColor: 'red',
                            borderRadius: '5px',
                            marginLeft: '10px',
                            cursor: 'pointer'
                          }}>
                          Choose Image
                        </label>
                        <Box sx={{ width: '100%', mt: 3 }}>
                          <LinearProgress value={progress} variant="determinate" />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary">{`${progress}%`}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography>Content: </Typography>
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
                      </Grid>
                      <Grid display="flex" alignItems="center" gap="5px" item xs={7}>
                        <Typography>Setup upload time: </Typography>
                        <Checkbox
                          checked={checkedSetupTime}
                          onChange={handleChangeSetupTime}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </Grid>
                      {checkedSetupTime && (
                        <Grid display="flex" alignItems="center" gap="10px" item xs={7}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              value={setupTime}
                              onChange={(e) => setSetupTime(e)}
                              renderInput={(props) => (
                                <TextField sx={{ width: '100%' }} {...props} />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                      )}
                    </Grid>
                    <Grid display="flex" alignItems="center" gap="5px" item xs={7}>
                      <Typography>Save Draft: </Typography>
                      <Checkbox
                        checked={isSave}
                        onChange={handleSaveDraft}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Grid>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', py: '8px' }}>
                  {currentUser?.role === 'hr' ? (
                    <Link to="/manage-user">
                      <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                        Back to Dashboard
                      </Button>
                    </Link>
                  ) : currentUser?.role === 'employee' ? (
                    <Link to="/request-list-employee">
                      <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                        Back to Dashboard
                      </Button>
                    </Link>
                  ) : currentUser?.role === 'manager' ? (
                    <Link to="/request-list-manager">
                      <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                        Back to Dashboard
                      </Button>
                    </Link>
                  ) : currentUser?.role === 'admin' ? (
                    <Link to="/request-list-admin">
                      <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                        Back to Dashboard
                      </Button>
                    </Link>
                  ) : currentUser?.role === 'security' ? (
                    <Link to="/manage-user">
                      <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                        Back to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <></>
                  )}
                  {isSave ? (
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      sx={{ bgcolor: 'rgb(94, 53, 177)' }}>
                      Save
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      sx={{ bgcolor: 'rgb(94, 53, 177)' }}>
                      Upload
                    </LoadingButton>
                  )}
                </CardActions>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default EditNotification
