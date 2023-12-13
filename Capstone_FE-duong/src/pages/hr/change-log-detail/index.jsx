import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logApi from '../../../services/logApi'
import ChatTopbar from '../../common/chat/components/ChatTopbar'

const ChangeLogDetail = () => {
  const navigate = useNavigate()
  const { employee_id, date } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [userAttendanceDetail, setUserAttendanceDetail] = useState({})

  useEffect(() => {
    const getChangeLogByEmployeeAndMonth = async () => {
      setIsLoading(true)
      let data = {
        employee_id: employee_id,
        date: date
      }
      let res = await logApi.getChangeLogDetail(data)
      setUserAttendanceDetail(res)
      setIsLoading(false)
    }
    getChangeLogByEmployeeAndMonth()
  }, [])

  return (
    <>
      {userAttendanceDetail && (
        <>
          <ChatTopbar />
          <Box display="flex">
            <Box flex="1">
              <Paper sx={{ margin: '25px 0px 0px 40px', p: '15px' }} elevation={4}>
                <Typography fontWeight="700" fontSize="25px">
                  Information{' '}
                </Typography>
                <Box display="flex" marginTop="10px">
                  <Box flex="1" borderRight="1px solid #999">
                    <Typography mb={2}>Employee </Typography>
                    <Typography mb={2}>Account </Typography>
                    <Typography mb={2}>Department </Typography>
                  </Box>
                  <Box flex="2" marginLeft="10px">
                    <Typography mb={2}>{userAttendanceDetail?.name}</Typography>
                    <Typography mb={2}>{userAttendanceDetail?.username} </Typography>
                    <Typography mb={2}>{userAttendanceDetail?.departmentName} </Typography>
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
                    Attendance Change{' '}
                  </Typography>
                  <Box display="flex" marginTop="10px">
                    <Box flex="1" borderRight="1px solid #999">
                      <Typography mb={2}>Check-in </Typography>
                      <Typography mb={2}>Check-out </Typography>
                      <Typography mb={2}>Date Change </Typography>
                      <Typography mb={2}>Change From </Typography>
                    </Box>
                    <Box flex="2" marginLeft="10px">
                      <Typography mb={2} color='red'>{userAttendanceDetail?.checkin}</Typography>
                      <Typography mb={2} color='red'>{userAttendanceDetail?.checkout} </Typography>
                      <Typography mb={2}>{userAttendanceDetail?.dateDailyChange} </Typography>
                      <Typography mb={2}>{userAttendanceDetail?.changeFrom} </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              <Paper sx={{ margin: '50px 0px 0px 40px', p: '15px' }} elevation={4}>
                <Typography fontWeight="bold" fontSize="25px">
                  Reason{' '}
                </Typography>
                <TextField
                  id="outlined-multiline-static"
                  value={userAttendanceDetail?.reason == null ? '' : userAttendanceDetail?.reason}
                  disabled
                  multiline
                  rows={4}
                  sx={{width:'100%'}}
                />
              </Paper>

              <Box sx={{ margin: '20px 0px 0px 40px' }}>
                <Button variant="contained" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </Box>
            </Box>

            <Box flex="1">
              <Box marginRight="30px">
                <Paper sx={{ margin: '25px 0px 0px 40px',height:'200px', p: '15px' }} elevation={4}>
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
                      <Typography mb={1}>{userAttendanceDetail?.dateDaily} </Typography>
                      <Typography mb={1}>{userAttendanceDetail?.checkin} </Typography>
                      <Typography mb={1}>{userAttendanceDetail?.checkout} </Typography>
                    </Box>
                  </Box>
                </Paper>

                <Paper sx={{ margin: '50px 0px 0px 40px', p: '15px' }} elevation={4}>
                  <Box flex="2" ml={3}>
                    <Typography fontWeight="700" fontSize="25px">
                      Log{' '}
                    </Typography>
                    <Box display="flex" marginTop="10px">
                      <Box flex="3" gap={3} borderRight="1px solid #999">
                        <Typography mb={1}> Outside work </Typography>
                        <Typography mb={1}>Violate </Typography>
                      </Box>
                      <Box flex="1" ml={2}>
                        <Typography mb={1} ml='5px'>{userAttendanceDetail?.outSideWork== -1? 0:1 } </Typography>
                        <Checkbox
                          checked={userAttendanceDetail?.violate}
                          disabled
                          sx={{ p: 0 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export default ChangeLogDetail
