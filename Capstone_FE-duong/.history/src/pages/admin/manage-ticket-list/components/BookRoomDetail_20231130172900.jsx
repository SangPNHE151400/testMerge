import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  Modal,
  Typography
} from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../../../../components/Header'
import { useEffect, useState } from 'react'
import requestApi from '../../../../services/requestApi'
import axiosClient from '../../../../utils/axios-config'
import { BASE_URL } from '../../../../services/constraint'
import { toast } from 'react-toastify'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 2
}
const BookListDetail = () => {
  const { ticketId } = useParams()
  const [bookRoomDetail, setBookRoomDetail] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAccept, setIsLoadingAccept] = useState(false)
  const [contentReason, setContentReason] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  console.log(isLoading);
  useEffect(() => {
    setIsLoading(true)
    const fetchGetRequestDetailByAdmin = async () => {
      const response = await requestApi.getRequestDetailByAdmin(ticketId)
      setBookRoomDetail(response)
      setIsLoading(false)
    }
    fetchGetRequestDetailByAdmin()
  }, [])

  console.log(bookRoomDetail)

  const handleAcceptBookRoom = async () => {
    if (bookRoomDetail) {
      let data = {
        roomBookingFormRoomId: bookRoomDetail[0]?.object?.roomBookingRequestId,
        content: ''
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

  const handleRejectRequest = () => {
    let data = {
      roomBookingFormRoomId: bookRoomDetail[0]?.object?.roomBookingRequestId,
      content: contentReason
    }
    console.log(data)
    requestApi.rejectBookRoomRequest(data)
    navigate('/manage-list-admin')
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
                          Status: {
                            bookRoomDetail[0]?.requestMessageResponse?.requestTicketStatus !== 'CLOSED' ?
                            <span style={{ color: 'brown' }}>Waiting</span> :
                          bookRoomDetail[0]?.object?.status === true ? (
                            <span style={{ color: 'green' }}>Accepted</span>
                          ) : bookRoomDetail[0]?.object?.status === false ? (
                            <span style={{ color: 'red' }}>Rejected</span>
                          ) : (
                            bookRoomDetail[0]?.requestMessageResponse?.requestTicketStatus === 'CLOSED' && (
                              <span style={{ color: 'brown' }}>Closed</span>
                            )
                          )
                          }
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
                  <Link to="/manage-list-admin">
                    <Button variant="contained" sx={{ bgcolor: 'rgb(94, 53, 177)' }}>
                      Back to Dashboard
                    </Button>
                  </Link>
                  <Box display="flex" gap="10px">
                    {bookRoomDetail[0]?.requestMessageResponse?.requestTicketStatus != 'CLOSED' ? (
                      <Box display="flex" gap="10px" justifyContent="flex-end">
                        <Button onClick={handleOpen} variant="contained" sx={{ bgcolor: 'red' }}>
                          Reject
                        </Button>
                        <LoadingButton
                          loading={isLoadingAccept}
                          onClick={handleAcceptBookRoom}
                          variant="contained"
                          sx={{ bgcolor: 'green' }}>
                          Accept
                        </LoadingButton>
                      </Box>
                    ) : (
                      <></>
                    )}
                  </Box>
                </CardActions>
              </Card>
            </form>
          </Grid>
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Box sx={style} display="flex" flexDirection="column">
            <Typography fontSize="20px" fontWeight="700" mb={2}>
              Reason reject
            </Typography>
            <textarea
              value={contentReason}
              onChange={(e) => setContentReason(e.target.value)}
              style={{ width: '100%' }}
              rows={6}
            />
            <Button
              onClick={handleRejectRequest}
              variant="contained"
              sx={{ alignSelf: 'flex-end', mt: 2 }}>
              Save
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  )
}

export default BookListDetail
