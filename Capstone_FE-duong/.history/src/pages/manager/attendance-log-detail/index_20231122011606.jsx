import { Box, Button, Checkbox, CircularProgress, Divider, Input, Paper, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import attendanceApi from '../../../services/attendanceApi'
import ChatTopbar from '../../common/chat/components/ChatTopbar'
import useAuth from '../../../hooks/useAuth'
import logApi from '../../../services/logApi'
import { useNavigate } from 'react-router-dom'
const AttendanceLogDetail = () => {
  const navigate = useNavigate()
  const { employee_id, date } = useParams();
  const [isLoading, setIsLoading] = useState(false)
  const [controlLog, setControlLog] = useState([])
  const [userAttendanceDetail, setUserAttendanceDetail] = useState({})

  useEffect(() => {
    const getChangeLogByEmployeeAndMonth = async () => {
      setIsLoading(true);
      let data = {
        employee_id: employee_id,
        date: date
      }
      let res = await logApi.getChangeLogDetail(data);
      setUserAttendanceDetail(res)
      setControlLog(res.controlLogResponse)
      setIsLoading(false)
    }
    getChangeLogByEmployeeAndMonth();
  }, [])

  console.log(userAttendanceDetail)
  console.log(controlLog)
  return (
    <>
      {userAttendanceDetail && (<>
        <ChatTopbar />
        <Box display="flex">
          <Box flex='1.8'>
            <Paper sx={{ margin: '25px 0px 0px 40px', p: '15px' }} elevation={4}>
              <Typography fontWeight="700" fontSize="25px">
                Information{' '}
              </Typography>
              <Box display="flex" marginTop="10px">
                <Box flex="1" borderRight="1px solid #999">
                  <Typography mb={1}>Employee </Typography>
                  <Typography mb={1}>Account </Typography>
                  <Typography>Department </Typography>
                </Box>
                <Box flex="2" marginLeft="10px">
                  <Typography mb={1}>{userAttendanceDetail?.name}</Typography>
                  <Typography mb={1}>{userAttendanceDetail?.username}  </Typography>
                  <Typography mb={1}>{userAttendanceDetail?.departmentName}  </Typography>

                </Box>
              </Box>
            </Paper>

            {isLoading ? (
              <Paper sx={{ padding: 2, m: 2 }} elevation={4}>
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress />
                </Box>
              </Paper>
            ) : (
              <Paper sx={{ margin: '50px 0px 0px 40px', p: '15px' }} elevation={4}>
                <Typography fontWeight="bold" fontSize="25px">
                  Control Log{' '}
                </Typography>
                <Box sx={{ height: '300px', overflowY: 'auto' }}>
                  <Box display="flex" marginTop="15px" flexDirection="column">
                    {controlLog.length != 0 ? (<>
                      {
                        controlLog.map((item, index) => (
                          <>
                            <Box display="flex" justifyContent="space-between" width="100%">
                              <Box>
                                <Typography marginLeft="15px">{item?.username}</Typography>
                              </Box>
                              <Box height="30px">
                                <Typography marginLeft="15px">{item?.log}</Typography>
                              </Box>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                          </>
                        ))
                      }
                    </>) : (<>
                      <Box display="flex" justifyContent="space-between" width="100%">

                        <Typography marginLeft="15px">No Control Log</Typography>
                      </Box>
                    </>)}


                  </Box>
                </Box>
              </Paper>
            )}



            <Box sx={{ margin: '20px 0px 0px 40px' }}>
              <Button variant='contained' onClick={()=>navigate("/log-management")}>Back</Button>
            </Box>
          </Box>

          <Box flex='3'>
            <Box marginRight="30px">
              <Paper sx={{ margin: '25px 0px 0px 40px', p: '15px' }} elevation={4}>
                <Typography fontWeight="700" fontSize="25px">
                  System log{' '}
                </Typography>
                <Box display="flex" marginTop="10px">
                  <Box flex="1" gap={3} borderRight="1px solid #999">
                    <Typography mb={1}> Date </Typography>
                    <Typography mb={1}>Check-In </Typography>
                    <Typography mb={1}>Check-out</Typography>
                  </Box>
                  <Box flex="3" ml={2}>
                    <Typography mb={1}> {date} </Typography>
                    <Typography mb={1}>{userAttendanceDetail?.checkin} </Typography>
                    <Typography mb={1}>{userAttendanceDetail?.checkout} </Typography>
                  </Box>
                </Box>

                <Box display='flex' mt={3}>
                  <Box flex='3'>
                    <Typography fontWeight="700" fontSize="25px">
                      Attendance Change{' '}
                    </Typography>
                    <Box display="flex" marginTop="10px">
                      <Box flex="1" gap={3} borderRight="1px solid #999">
                        <Typography mb={1}>Check-In </Typography>
                        <Typography mb={1}>Check-out</Typography>
                        <Typography mb={1}>Date change</Typography>
                        <Typography mb={1}>Change from</Typography>
                      </Box>
                      <Box flex="1" ml={1}>
                      <Typography mb={1}>{userAttendanceDetail?.checkinChange} </Typography>
                    <Typography mb={1}>{userAttendanceDetail?.checkoutChange} </Typography>
                    <Typography mb={1}>{userAttendanceDetail?.dateDailyChange} </Typography>
                    <Typography mb={1}>{userAttendanceDetail?.changeFrom} </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box flex='2' ml={3} >
                    <Typography fontWeight="700" fontSize="25px">
                      Log{' '}
                    </Typography>
                    <Box display="flex" marginTop="10px">
                      <Box flex="3" gap={3} borderRight="1px solid #999">
                        <Typography mb={1}> Outside work </Typography>
                        <Typography mb={1}>Violate </Typography>
                      </Box>
                      <Box flex="1" ml={2}>
                        <Typography mb={1}>{userAttendanceDetail?.outSideWork} </Typography>
                        <Checkbox checked={userAttendanceDetail?.violate} disabled sx={{ p: 0 }} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>
              <Paper sx={{ margin: '50px 0px 0px 40px', p: '15px' }} elevation={4}>
                <Typography fontWeight="700" fontSize="25px" mb={3}>
                  Reason : {' '}
                </Typography>
                <TextField
                  value={userAttendanceDetail?.reason == null ? "" : userAttendanceDetail?.reason}
                  id="outlined-multiline-static"
                  multiline
                  rows={4}
                  disabled
                  sx={{ width: '100%' }}
                  defaultValue="Default Value"
                />
              </Paper>
          
            </Box>
          </Box>
        </Box>
      </>)}


    </>
  )
}

export default AttendanceLogDetail
