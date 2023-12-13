import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../../../components/Header'
import requestApi from '../../../../services/requestApi'

const BookListDetailManager = () => {
  const { ticketId } = useParams()
  const [bookRoomDetail, setBookRoomDetail] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  useEffect(() => {
    setIsLoading(true)
    const fetchGetRequestDetailByAdmin = async () => {
      const response = await requestApi.getRequestDetailByAdmin(ticketId)
      setBookRoomDetail(response)
      setIsLoading(false)
    }
    fetchGetRequestDetailByAdmin()
  }, [])
  console.log(isLoading)
  return (
    <Box height="100vh" bgcolor="seashell">
      <Box
        className="App"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
        <Grid container>
          <Grid item xs={12}>
            <form autoComplete="off" noValidate>
              <Card>
                <CardContent>
                  <Header title="Book Room Detail" />
                  <Box sx={{ mb: 1 }}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} md={6}>
                        <Typography>Title: {bookRoomDetail[0]?.object?.title}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography textAlign="right">
                          Sender Name: {bookRoomDetail[0]?.requestMessageResponse?.senderFirstName}{' '}
                          {bookRoomDetail[0]?.requestMessageResponse?.senderLastName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>
                          Sender Department:{' '}
                          {bookRoomDetail[0]?.object?.senderDepartment?.departmentName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography textAlign="right">
                          Booking Date: {bookRoomDetail[0]?.object?.bookingDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Start time: {bookRoomDetail[0]?.object?.startDate}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography textAlign="right">
                          End Time: {bookRoomDetail[0]?.object?.endDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Typography>Room: {bookRoomDetail[0]?.object?.roomName}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>
                          Status:{' '}
                          {bookRoomDetail[0]?.requestMessageResponse?.requestTicketStatus !==
                          'CLOSED' ? (
                            <span style={{ color: 'brown' }}>Waiting</span>
                          ) : bookRoomDetail[0]?.object?.status === true ? (
                            <span style={{ color: 'green' }}>Accepted</span>
                          ) : bookRoomDetail[0]?.object?.status === false ? (
                            <span style={{ color: 'red' }}>Rejected</span>
                          ) : (
                            bookRoomDetail[0]?.requestMessageResponse?.requestTicketStatus === 'CLOSED' && (
                              <span style={{ color: 'brown' }}>Closed</span>
                            )
                          )}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={12}>
                        <Typography>Content: {bookRoomDetail[0]?.object?.content}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', py: '8px' }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate(-1)}
                    sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                    Back to Dashboard
                  </Button>
                </CardActions>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default BookListDetailManager
