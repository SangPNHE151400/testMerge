import { Box, Checkbox, Divider, Paper, Typography } from '@mui/material'
import ChatTopbar from '../chat/components/ChatTopbar'

const AttendanceDetail = () => {
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
                  <Typography mb={1}>Tran Thi Ngoc Anh </Typography>
                  <Typography mb={1}>anh.tranngoc </Typography>
                  <Typography>Tech D1 </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ margin: '50px 0px 0px 40px', p: '15px' }} elevation={4}>
              <Typography fontWeight="bold" fontSize="30px">
                Control Log{' '}
              </Typography>
              <Box sx={{ maxHeight: '275px', overflowY: 'auto' }}>
                <Box display="flex" marginTop="15px">
                  <Box flex="1">
                    <Typography marginLeft="15px">anh.trangngoc</Typography>
                    <Divider />
                  </Box>
                  <Box flex="2" height="30px">
                    <Typography marginLeft="15px">11-1-2023 8:50:00</Typography>
                    <Divider />
                  </Box>
                </Box>
                <Box display="flex" marginTop="15px">
                  <Box flex="1">
                    <Typography marginLeft="15px">anh.trangngoc</Typography>
                    <Divider />
                  </Box>
                  <Box flex="2" height="30px">
                    <Typography marginLeft="15px">11-1-2023 8:50:00</Typography>
                    <Divider />
                  </Box>
                </Box>
                <Box display="flex" marginTop="15px">
                  <Box flex="1">
                    <Typography marginLeft="15px">anh.trangngoc</Typography>
                    <Divider />
                  </Box>
                  <Box flex="2" height="30px">
                    <Typography marginLeft="15px">11-1-2023 8:50:00</Typography>
                    <Divider />
                  </Box>
                </Box>
                <Box display="flex" marginTop="15px">
                  <Box flex="1">
                    <Typography marginLeft="15px">anh.trangngoc</Typography>
                    <Divider />
                  </Box>
                  <Box flex="2" height="30px">
                    <Typography marginLeft="15px">11-1-2023 8:50:00</Typography>
                    <Divider />
                  </Box>
                </Box>
                <Box display="flex" marginTop="15px">
                  <Box flex="1">
                    <Typography marginLeft="15px">anh.trangngoc</Typography>
                    <Divider />
                  </Box>
                  <Box flex="2" height="30px">
                    <Typography marginLeft="15px">11-1-2023 8:50:00</Typography>
                    <Divider />
                  </Box>
                </Box>
                <Box display="flex" marginTop="15px">
                  <Box flex="1">
                    <Typography marginLeft="15px">anh.trangngoc</Typography>
                    <Divider />
                  </Box>
                  <Box flex="2" height="30px">
                    <Typography marginLeft="15px">11-1-2023 8:50:00</Typography>
                    <Divider />
                  </Box>
                </Box>
                <Box display="flex" marginTop="15px">
                  <Box flex="1">
                    <Typography marginLeft="15px">anh.trangngoc</Typography>
                    <Divider />
                  </Box>
                  <Box flex="2" height="30px">
                    <Typography marginLeft="15px">11-1-2023 8:50:00</Typography>
                    <Divider />
                  </Box>
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
