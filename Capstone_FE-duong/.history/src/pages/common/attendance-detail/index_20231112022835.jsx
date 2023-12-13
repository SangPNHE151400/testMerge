import { Box, Checkbox, Divider, Paper, Typography } from '@mui/material'
import ChatTopbar from '../chat/components/ChatTopbar'
import { useEffect, useState } from 'react'
import attendanceApi from '../../../services/attendanceApi'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
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

  console.log(userAttendanceDetail)
  return (
    <>
      <ChatTopbar />
      <Box display="flex">
        <Box flex="5" display="flex">
          <Box flex="1">
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

            <Paper sx={{ margin: '50px 0px 0px 40px', p: '15px' }} elevation={4}>
              <Typography fontWeight="bold" fontSize="30px">
                Control Log{' '}
              </Typography>
              <Box sx={{ maxHeight: '275px', overflowY: 'auto' }}>
                <Box display="flex" marginTop="15px">
                  {controlLog.length > 0 ?
                    controlLog.map((item, index) => (
                      <>
                        <Box flex="1">
                          <Typography marginLeft="15px">{item?.username}</Typography>
                          <Divider />
                        </Box>
                        <Box flex="2" height="30px">
                          <Typography marginLeft="15px">{item?.log}</Typography>
                          <Divider />
                        </Box>
                      </>
                    )): <Box flex="1">
                    <Typography>No Control Log</Typography>
                  </Box>}
                </Box>
              </Box>
            </Paper>
          </Box>

          <Box flex="1">
            <Box flex="1" marginRight="40px">
              <Paper sx={{ margin: '20px 0px 0px 40px', p: '15px' }} elevation={4}>
                <Typography fontWeight="700" fontSize="30px">
                  Working Details{' '}
                </Typography>
                <Box display="flex" marginTop="10px">
                  <Box flex="1" borderRight="1px solid #999">
                    <Typography>Full Date </Typography>
                    <Typography>Check In </Typography>
                    <Typography>Check Out </Typography>
                    <Typography>Total Attendance </Typography>
                    <Typography>Inside Hours </Typography>
                    <Typography>Total Morning </Typography>
                    <Typography>Total Afternoon </Typography>
                    <Typography>Working Day </Typography>
                    <Typography>Permitted Leave </Typography>
                    <Typography>Non-permitted leave </Typography>
                    <Typography>Out-side Work </Typography>
                  </Box>
                  <Box flex="2" marginLeft="10px">
                    <Typography>Tran Thi Ngoc Anh </Typography>
                    <Typography>anh.tranngoc </Typography>
                    <Typography>Tech D1 </Typography>
                    <Typography>100</Typography>
                    <Typography>100</Typography>
                    <Typography>100</Typography>
                    <Typography>10</Typography>
                    <Typography>1</Typography>
                    <Typography>0</Typography>
                    <Typography>0</Typography>
                    <Typography>0</Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper sx={{ margin: '20px 0px 0px 40px', p: '15px' }} elevation={4}>
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
                    <Checkbox sx={{ p: 0 }} />
                    <Checkbox sx={{ p: 0 }} />
                    <Checkbox sx={{ p: 0 }} />
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AttendanceDetail
