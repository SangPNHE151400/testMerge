import { LoadingButton } from '@mui/lab'
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
import { Link, useParams } from 'react-router-dom'
import Header from '../../../../components/Header'
import { useEffect, useState } from 'react'
import requestApi from '../../../../services/requestApi'
import axiosClient from '../../../../utils/axios-config'
import { BASE_URL } from '../../../../services/constraint'
import { toast } from 'react-toastify'

const BookListDetail = () => {
  const { ticketId } = useParams()
  const [bookRoomDetail, setBookRoomDetail] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAccept, setIsLoadingAccept] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    const fetchGetRequestDetailByAdmin = async () => {
      const response = await requestApi.getRequestDetailByAdmin(ticketId)
      setBookRoomDetail((prevDetails) => [...prevDetails, ...response])
      setIsLoading(false)
    }
    fetchGetRequestDetailByAdmin()
  }, [])

  console.log(bookRoomDetail[0]?.Detail?.object?.roomBookingRequestId)

  const handleAcceptBookRoom = async () => {
    if (bookRoomDetail) {
      let data = {
        roomBookingFormRoomId: bookRoomDetail[0]?.Detail?.object?.roomBookingRequestId
      }
      try {
        setIsLoadingAccept(true)
        await axiosClient.post(`${BASE_URL}/acceptBookRoom`, data)
        setIsLoadingAccept(false)
        toast.success('Accept book room successfully!')
      } catch (error) {
        console.log(error)
      }
    }
  }

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
                        <Typography>Title: {bookRoomDetail[0]?.Detail?.object?.title}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography textAlign="right">
                          Sender Name:{' '}
                          {bookRoomDetail[0]?.Detail?.requestMessageResponse?.senderFirstName}{' '}
                          {bookRoomDetail[0]?.Detail?.requestMessageResponse?.senderLastName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>
                          Sender Department:{' '}
                          {bookRoomDetail[0]?.Detail?.object?.senderDepartment?.departmentName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography textAlign="right">
                          Booking Date: {bookRoomDetail[0]?.Detail?.object?.bookingDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>
                          Start time: {bookRoomDetail[0]?.Detail.object?.startDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography textAlign="right">
                          End Time: {bookRoomDetail[0]?.Detail?.object?.endDate}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>
                          Room: {bookRoomDetail[0]?.Detail?.object?.roomName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Typography>
                          Content: {bookRoomDetail[0]?.Detail?.object?.content}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', py: '8px' }}>
                  <Link to="/request-list-admin">
                    <Button variant="contained" sx={{ bgcolor: 'rgb(94, 53, 177)' }}>
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Box display="flex" gap="10px">
                    <LoadingButton variant="contained" sx={{ bgcolor: 'red' }}>
                      Reject
                    </LoadingButton>
                    <LoadingButton
                      loading={isLoadingAccept}
                      onClick={handleAcceptBookRoom}
                      variant="contained"
                      sx={{ bgcolor: 'green' }}>
                      Accept
                    </LoadingButton>
                  </Box>
                </CardActions>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default BookListDetail
