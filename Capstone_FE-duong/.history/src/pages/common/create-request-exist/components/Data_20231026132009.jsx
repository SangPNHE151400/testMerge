import { Box, Grid, MenuItem, Paper, Select, TextField, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import useAuth from '../../../../hooks/useAuth'

import {
  AttendenceFrom,
  LeaveRequest,
  OtRequest,
  OtherRequest
} from './DataFrom'

const Data = () => {
  const userInfo = useAuth()
  const [selectedValue, setSelectedValue] = useState('')
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  
  const handleChange3 = (event) => {
    setSelectedValue(event.target.value)
  }
  const theme = useTheme()
  return (
    <>
      <Box bgcolor={theme.palette.bgColorPrimary.main}>
        <Box p={3}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography fontSize="18px" fontWeight="700">
                  Request creator
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight="500">Full name</Typography>
                <TextField
                  sx={{ bgcolor: '#EEEEEE', width: '100%' }}
                  size="small"
                  value={userInfo?.firstName + ' ' + userInfo?.lastName}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight="500">Email</Typography>
                <TextField
                  sx={{ bgcolor: '#EEEEEE', width: '100%' }}
                  size="small"
                  value={userInfo?.email}
                  inputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <Box p={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Grid item xs={12}>
              <Typography fontWeight="500">Service</Typography>
              {currentUser?.role === 'employee' ? (
                <Select
                  value={selectedValue}
                  onChange={handleChange3}
                  sx={{ width: '100%', height: '38px' }}
                  displayEmpty>
                  <MenuItem value="">Service Type</MenuItem>

                  <MenuItem value="leave_request">Leave Request</MenuItem>
                  <MenuItem value="ot_request">OT Request</MenuItem>
                  <MenuItem value="attendence_request">Attendence Request</MenuItem>
                  <MenuItem value="other_request">Other Request</MenuItem>
                </Select>
              ) : currentUser?.role === 'hr' ? (
                <Select
                  value={selectedValue}
                  onChange={handleChange3}
                  sx={{ width: '100%', height: '38px' }}
                  displayEmpty>
                  <MenuItem value="">Service Type</MenuItem>
                  <MenuItem value="other_request">Other Request</MenuItem>
                </Select>
              ) : currentUser?.role === 'manager' ? (
                <Select
                  value={selectedValue}
                  onChange={handleChange3}
                  sx={{ width: '100%', height: '38px' }}
                  displayEmpty>
                  <MenuItem value="">Service Type</MenuItem>

                  <MenuItem value="other_request">Other Request</MenuItem>
                </Select>
              ) : currentUser?.role === 'security' ? (
                <Select
                  value={selectedValue}
                  onChange={handleChange3}
                  sx={{ width: '100%', height: '38px' }}
                  displayEmpty>
                  <MenuItem value="">Service Type</MenuItem>

                  <MenuItem value="other_request">Other Request</MenuItem>
                </Select>
              ) : currentUser?.role === 'admin' ? (
                <Select
                  value={selectedValue}
                  onChange={handleChange3}
                  sx={{ width: '100%', height: '38px' }}
                  displayEmpty>
                  <MenuItem value="">Service Type</MenuItem>
                  <MenuItem value="attendence_request">Attendence Request</MenuItem>
                  <MenuItem value="other_request">Other Request</MenuItem>
                </Select>
              ) : (
                <></>
              )}
              {selectedValue === 'attendence_request' && <AttendenceFrom userId={currentUser.accountId}/>}
              {selectedValue === 'ot_request' && <OtRequest />}
              {selectedValue === 'leave_request' && <LeaveRequest userId={currentUser.accountId} />}
              {selectedValue === 'other_request' && <OtherRequest userId={currentUser.accountId} />}
            </Grid>
          </Paper>
        </Box>
      </Box>
    </>
  )
}

export default Data
