import { Box, Checkbox, CircularProgress, Divider, Paper, Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import attendanceApi from '../../../services/attendanceApi'
import ChatTopbar from '../chat/components/ChatTopbar'
const AttendanceDetail = () => {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const [isLoading, setIsLoading] = useState(false)
  const [controlLog, setControlLog] = useState([])
  const [userAttendanceDetail, setUserAttendanceDetail] = useState({})
  const { date } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUserAttendanceDetail = async () => {
      setIsLoading(true)
      try {
        const response = await attendanceApi.getAttendanceUserDetail(currentUser?.accountId, date)
        if (response && response.controlLogResponse) {
          setUserAttendanceDetail(response)
          setControlLog(response?.controlLogResponse)
        } else {
          console.error('Invalid response structure:', response)
        }
      } catch (error) {
        console.error('Error fetching user attendance:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAttendanceDetail()
  }, [])

  console.log(userAttendanceDetail)

  const handleExportUserAttendance = async () => {
    const res = await attendanceApi.exportAttendanceUserDetail(currentUser?.accountId, date)
    console.log(res);
    // Assuming 'res' is raw binary data
    const arrayBuffer = new Uint8Array(res).buffer;

    // Create a Blob from the array buffer
    const blob = new Blob([res], { type: 'application/pdf' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'User_Report.pdf';

    // Append the link to the document and trigger the click event
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Remove the link from the document
    document.body.removeChild(downloadLink);
  }
  return (
    <>
      <ChatTopbar />
      <Box ml='40px' mt={3}>
        <Button onClick={handleExportUserAttendance} variant="contained" sx={{bgcolor: 'yellow', color: '#000'}}>Export</Button>
      </Box>
      <Box>
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
                            <Box>
                              <Typography marginLeft="15px">
                                {userAttendanceDetail?.name}
                              </Typography>
                            </Box>
                            <Box height="30px">
                              <Typography marginLeft="15px">{item?.log}</Typography>
                            </Box>
                          </Box>
                          <Divider sx={{ mb: 2 }} />
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
            <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 3, ml: '40px' }}>
              Back
            </Button>
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
                      {currentUser?.role === 'employee' && (
                        <>
                          <Typography mb={1}>Permitted Leave </Typography>
                          <Typography mb={1}>Non Permitted Leave </Typography>
                          <Typography>Out-side Work </Typography>
                        </>
                      )}
                    </Box>
                    <Box flex="2" marginLeft="10px">
                      <Typography mb={1}>{userAttendanceDetail?.dateDaily} </Typography>
                      <Typography mb={1}>
                        {userAttendanceDetail?.checkin === null
                          ? 'none'
                          : userAttendanceDetail?.checkin}{' '}
                      </Typography>
                      <Typography mb={1}>
                        {userAttendanceDetail?.checkout === null
                          ? 'none'
                          : userAttendanceDetail?.checkout}{' '}
                      </Typography>
                      <Typography mb={1}>{userAttendanceDetail?.totalAttendance}</Typography>
                      <Typography mb={1}>{userAttendanceDetail?.morningTotal}</Typography>
                      <Typography mb={1}>{userAttendanceDetail?.afternoonTotal}</Typography>
                      {currentUser?.role === 'employee' && (
                        <>
                          <Typography mb={1}>{userAttendanceDetail?.permittedLeave}</Typography>
                          <Typography mb={1}>{userAttendanceDetail?.nonPermittedLeave}</Typography>
                          <Typography>{userAttendanceDetail?.outsideWork}</Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </Paper>
              )}

              {currentUser?.role === 'employee' && !isLoading ? (
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
                        checked={userAttendanceDetail?.leaveWithoutNotice}
                      />
                    </Box>
                  </Box>
                </Paper>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AttendanceDetail
