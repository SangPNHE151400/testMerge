import { Box, CircularProgress, Grid, Modal, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import axiosClient from '../../../../utils/axios-config'
import { BASE_URL } from '../../../../services/constraint'

const AttendanceDetailModal = ({ open, handleClose, date, userId }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 2
  }

  const [attendanceDetail, setAttendanceDetail] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    try {
      setIsLoading(true)
      const fetchAttendanceDetail = async () => {
        const response = await axiosClient.get(`${BASE_URL}/getAttendanceUserDetail`, {
          params: {
            user_id: userId,
            date: date
          }
        })
        setAttendanceDetail(response)
        setIsLoading(false)
      }
      fetchAttendanceDetail()
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }, [date])

  console.log(attendanceDetail)
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description">
      <Box sx={{ ...style, width: 500 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography textAlign="center" fontSize="25px" fontWeight="800" mb={3}>
              User Attendance Detail ({attendanceDetail.date})
            </Typography>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <Typography>
                  Morning Total: {attendanceDetail.dailyDetailResponse?.morning_total}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography textAlign="right">
                  Afternoon Total: {attendanceDetail.dailyDetailResponse?.afternoonTotal}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  Inside Time: {attendanceDetail.dailyDetailResponse?.insideTime}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography textAlign="right">
                  Outside Time: {attendanceDetail.dailyDetailResponse?.outsideTime}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>Date type: {attendanceDetail.dailyDetailResponse?.dateType}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography textAlign="right">
                  Total Time: {attendanceDetail.dailyDetailResponse?.totalTime}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontSize="20px" fontWeight="700">
                  Over Time Detail:
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  Start Time: {attendanceDetail.overTimeDetailResponse?.startTime}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography textAlign="right">
                  End Time: {attendanceDetail.overTimeDetailResponse?.endTime}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography>
                  Date type: {attendanceDetail.overTimeDetailResponse?.dateType}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  Description: {attendanceDetail.overTimeDetailResponse?.description}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Modal>
  )
}

export default AttendanceDetailModal
