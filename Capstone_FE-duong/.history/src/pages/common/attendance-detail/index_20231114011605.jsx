import { Box, Checkbox, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import attendanceApi from '../../../services/attendanceApi'
import ChatTopbar from '../chat/components/ChatTopbar'
const AttendanceDetail = () => {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const [isLoading, setIsLoading] = useState(false)
  const [controlLog, setControlLog] = useState([])
  const [userAttendanceDetail, setUserAttendanceDetail] = useState({})
  const { date } = useParams()
  useEffect(() => {
    const fetchUserAttendanceDetail = async () => {
      setIsLoading(true)
      try {
        const response = await attendanceApi.getAttendanceUserDetail(currentUser?.accountId, date)
        setUserAttendanceDetail(response)
        setControlLog(response?.controlLogResponse)
      } catch (error) {
        console.error('Error fetching user attendance:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAttendanceDetail()
  }, [])

  console.log(userAttendanceDetail);

  return (
    <>
      <ChatTopbar />
      <Box display="flex">
        <Box flex="5" display="flex">
          <Box width="50%">
            {isLoading ? (
              <Paper sx={{ padding: 2, m: 2 }} elevation={4}>
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress />
                </Box>
              </Paper>
            ) : (
              <Paper sx={{ margin: '20px 0px 0px 40px', p: '15px' }} elevation={4}>
                <Typography fontWeight="700" fontSize="30px">
                  Information{' '}
                </Typography>
                <Box display="flex" marginTop="10px">
                  <Box flex="1" borderRight="1px solid #999">
                    <Typography mb={1}>Employee </Typography>
                    <Typography mb={1}>Account </Typography>
                    <Typography>Department </Typography>
                  </Box>
                  <Box flex="2" marginLeft="10px">
                    <Typography mb={1}>{userAttendanceDetail?.name} </Typography>
                    <Typography mb={1}>{userAttendanceDetail?.username} </Typography>
                    <Typography>{userAttendanceDetail?.departmentName} </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            {isLoading ? (
              <Paper sx={{ padding: 2, m: 2 }} elevation={4}>
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                  <CircularProgress />
                </Box>
              </Paper>
            ) : (
              <Paper sx={{ margin: '50px 0px 0px 40px', p: '15px' }} elevation={4}>
                <Typography fontWeight="bold" fontSize="30px">
                  Control Log{' '}
                </Typography>
                <Box sx={{ maxHeight: '275px', overflowY: 'auto' }}>
                  <Box display="flex" marginTop="15px" flexDirection="column">
                    {controlLog.length > 0 ? (
                      controlLog.map((item) => (
                        <>
                          <Box display="flex" justifyContent="space-between" width="100%">
                            <Box>
                              <Typography marginLeft="15px">{item?.username}</Typography>
                            </Box>
                            <Box height="30px">
                              <Typography marginLeft="15px">{item?.log}</Typography>
                            </Box>
                          </Box>
                          <Divider sx={{mb: 2}} />
                        </>
                      ))
                    ) : (
                      <Box flex="1">
                        <Typography>No Control Log</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>

          <Box width="50%">
            <Box flex="1" marginRight="40px">
              {isLoading ? (
                <Paper sx={{ padding: 2, m: 2 }} elevation={4}>
                  <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                    <CircularProgress />
                  </Box>
                </Paper>
              ) : (
                <Paper sx={{ margin: '20px 0px 0px 40px', p: '15px' }} elevation={4}>
                  <Typography fontWeight="700" fontSize="30px">
                    Working Details{' '}
                  </Typography>
                  <Box display="flex" marginTop="10px">
                    <Box flex="1" borderRight="1px solid #999">
                      <Typography mb={1}>Full Date </Typography>
                      <Typography mb={1}>Check In </Typography>
                      <Typography mb={1}>Check Out </Typography>
                      <Typography mb={1}>Total Attendance </Typography>
                      <Typography mb={1}>Total Morning </Typography>
                      <Typography mb={1}>Total Afternoon </Typography>
                      <Typography mb={1}>Permitted Leave </Typography>
                      <Typography>Out-side Work </Typography>
                    </Box>
                    <Box flex="2" marginLeft="10px">
                      <Typography mb={1}>{userAttendanceDetail?.dateDaily} </Typography>
                      <Typography mb={1}>{userAttendanceDetail?.checkin === null ? 'none' : userAttendanceDetail?.checkin} </Typography>
                      <Typography mb={1}>{userAttendanceDetail?.checkout === null ? 'none' : userAttendanceDetail?.checkout} </Typography>
                      <Typography mb={1}>{userAttendanceDetail?.totalAttendance}</Typography>
                      <Typography mb={1}>{userAttendanceDetail?.morningTotal}</Typography>
                      <Typography mb={1}>{userAttendanceDetail?.afternoonTotal}</Typography>
                      <Typography mb={1}>{userAttendanceDetail?.permittedLeave}</Typography>
                      <Typography>{userAttendanceDetail?.outsideWork}</Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {isLoading ? (
                <Paper sx={{ padding: 2, m: 2 }} elevation={4}>
                  <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                    <CircularProgress />
                  </Box>
                </Paper>
              ) : (
                <Paper sx={{ margin: '40px 0px 0px 40px', p: '15px' }} elevation={4}>
                  <Typography fontWeight="700" fontSize="30px" mb={3}>
                    Violate{' '}
                  </Typography>
                  <Box display="flex" marginTop="10px">
                    <Box
                      mr={2}
                      pr={4}
                      display="flex"
                      flexDirection="column"
                      gap="15px"
                      borderRight="1px solid #999">
                      <Typography>Authorized late </Typography>
                      <Typography>Authorized early </Typography>
                      <Typography>Leave without notice </Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" gap="15px">
                      <Checkbox
                        sx={{ p: 0 }}
                        disabled
                        checked={userAttendanceDetail?.lateCheckin}
                      />
                      <Checkbox
                        sx={{ p: 0 }}
                        disabled
                        checked={userAttendanceDetail?.earlyCheckout}
                      />
                      <Checkbox
                        sx={{ p: 0 }}
                        disabled
                        checked={userAttendanceDetail?.nonPermittedLeave}
                      />
                    </Box>
                  </Box>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AttendanceDetail
