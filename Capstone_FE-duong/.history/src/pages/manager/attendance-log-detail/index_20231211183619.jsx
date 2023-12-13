import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logApi from '../../../services/logApi'
import ChatTopbar from '../../common/chat/components/ChatTopbar'
const AttendanceLogDetail = () => {
  const navigate = useNavigate()
  const { employee_id, date, logId } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [controlLog, setControlLog] = useState([])
  const [userAttendanceDetail, setUserAttendanceDetail] = useState({})
  console.log(logId)
  useEffect(() => {
    const getChangeLogByEmployeeAndMonth = async () => {
      setIsLoading(true)
      let res = await logApi.getChangeLogDetail(employee_id, date, logId)
      setUserAttendanceDetail(res)
      setControlLog(res.controlLogResponse)
      setIsLoading(false)
    }
    getChangeLogByEmployeeAndMonth()
  }, [])

  const handleExportLogDetail = async () => {
    const res = await logApi.exportChangeLogReportDetail(employee_id, date, logId)
    console.log(res);
    const base64Data = res?.file
    if (!base64Data) {
      return
    }

    const binaryData = atob(base64Data)
    const byteNumbers = new Array(binaryData.length)
    for (let i = 0; i < binaryData.length; i++) {
      byteNumbers[i] = binaryData.charCodeAt(i)
    }
    const uint8Array = new Uint8Array(byteNumbers)

    const blob = new Blob([uint8Array], {
      type: res?.fileContentType
    })

    const blobUrl = URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = blobUrl
    downloadLink.download = res?.fileName
    downloadLink.click()
  }

  console.log(userAttendanceDetail)
  console.log(userAttendanceDetail?.violate)
  return (
    <>
      {userAttendanceDetail && (
        <>
          <ChatTopbar />
          <Box ml="40px" mt={2}>
            <Button
              onClick={handleExportLogDetail}
              variant="contained"
              sx={{ bgcolor: 'yellow', color: '#000' }}>
              Export
            </Button>
          </Box>
          <Box display="flex">
            <Box flex="1.8">
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
                    Control Log{' '}
                  </Typography>
                  <Box sx={{ height: '300px', overflowY: 'auto' }}>
                    <Box display="flex" marginTop="15px" flexDirection="column">
                      {controlLog.length != 0 ? (
                        <>
                          {controlLog.map((item) => (
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
                          ))}
                        </>
                      ) : (
                        <>
                          <Box display="flex" justifyContent="space-between" width="100%">
                            <Typography marginLeft="15px">No Control Log</Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </Paper>
              )}

              <Box sx={{ margin: '20px 0px 0px 40px' }}>
                <Button variant="contained" onClick={() => navigate('/log-management')}>
                  Back
                </Button>
              </Box>
            </Box>

            <Box flex="3">
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

                  <Box display="flex" mt={3}>
                    <Box flex="3">
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
                          <Typography mb={1}>
                            {userAttendanceDetail?.checkinChange === null
                              ? 'none'
                              : userAttendanceDetail?.checkinChange}{' '}
                          </Typography>
                          <Typography mb={1}>
                            {userAttendanceDetail?.checkoutChange === null
                              ? 'none'
                              : userAttendanceDetail?.checkoutChange}{' '}
                          </Typography>
                          <Typography mb={1}>{userAttendanceDetail?.dateDailyChange} </Typography>
                          <Typography mb={1}>
                            {userAttendanceDetail?.changeFrom === 'manager'
                              ? 'Manager Edit'
                              : 'Employee Request'}{' '}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
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
                          <Typography mb={1}>
                            {userAttendanceDetail?.outSideWork === -1
                              ? 'none'
                              : userAttendanceDetail?.outSideWork}{' '}
                          </Typography>
                          <Checkbox
                            checked={userAttendanceDetail?.violate}
                            disabled
                            sx={{ p: 0 }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
                <Paper sx={{ margin: '28px 0px 0px 40px', p: '15px' }} elevation={4}>
                  <Typography fontWeight="700" fontSize="25px" mb={3}>
                    Reason{' '}
                  </Typography>
                  <Typography dangerouslySetInnerHTML={{ __html: userAttendanceDetail?.reason == null ? 'None' : userAttendanceDetail?.reason }}>
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  )
}

export default AttendanceLogDetail
