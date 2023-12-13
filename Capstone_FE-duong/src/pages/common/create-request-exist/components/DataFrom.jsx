import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import requestApi from '../../../../services/requestApi'
ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'bulletedList',
      'numberedList',
    ]
  },
  language: 'en'
};


const OtherRequest = ({ userId }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState('')
  const [getAllManagerDepartment, setGetAllManagerDepartment] = useState([])
  const [manager, setManager] = useState('')
  const {ticketId} = useParams()
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

  console.log(department);
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
      ticketId: ticketId,
      content: content,
      departmentId: departmentId,
    }
    console.log(data);
    setTitle('')
    setContent('')
    setDepartment('')
    requestApi.otherFormExistTicket(data)
  }

  const callApiToManager = (e, departmentId) => {
    e.preventDefault()
    let data = {
      userId: userId,
      title: title,
      ticketId: ticketId,
      content: content,
      departmentId: departmentId,
      receivedId: manager[0].accountId
    }
    console.log(data);
    setTitle('')
    setContent('')
    setDepartment('')
    requestApi.otherFormExistTicket(data)
  }

  const callApiEmployee = (e, managerId) => {
    e.preventDefault()
    let data = {
      userId: userId,
      title: title,
      ticketId: ticketId,
      content: content,
      departmentId: receiveIdAndDepartment?.managerInfoResponse?.managerDepartmentId,
      receivedId: managerId
    }
    setTitle('')
    setContent('')
    requestApi.otherFormExistTicket(data)
  }

  const handleDepartment = () => {
    if (currentUser?.role === 'admin' && role === 'manager') {
      return (
        <>
          <Typography mt={2} fontWeight="500">Department</Typography>
          <Select
            value={department}
            sx={{ width: '100%' }}
            onChange={handleChangeDepartment}
            displayEmpty>
            {
              getAllManagerDepartment.map((item) => (
                <MenuItem key={item.departmentId} value={item.departmentId} >{item.departmentName} </MenuItem>
              ))
            }  
          </Select>
        </>
      )
    }  else if (currentUser?.role === 'hr' && role === 'manager') {
      return (
        <>
          <Typography mt={2} fontWeight="500">Department</Typography>
          <Select
            required
            value={department}
            sx={{ width: '100%' }}
            onChange={handleChangeDepartment}
            displayEmpty>
             {
              getAllManagerDepartment.map((item) => (
                <MenuItem key={item.departmentId} value={item.departmentId} >{item.departmentName}</MenuItem>
              ))
            }  
          </Select>
        </>
      )
    } else if (currentUser?.role === 'security' && role === 'manager') {
      return (
        <>
          <Typography mt={2} fontWeight="500">Department</Typography>
          <Select
            value={department}
            sx={{ width: '100%' }}
            onChange={handleChangeDepartment}
            displayEmpty>
             {
              getAllManagerDepartment.map((item) => (
                <MenuItem key={item.departmentId} value={item.departmentId} >{item.departmentName} </MenuItem>
              ))
            }  
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
              <Select required value={role} sx={{ width: '100%' }} onChange={handleChange} displayEmpty>
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



export { OtherRequest }

