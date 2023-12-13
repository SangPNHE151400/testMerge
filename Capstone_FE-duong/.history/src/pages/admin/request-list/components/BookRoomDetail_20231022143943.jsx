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

const BookListDetail = () => {
 const {ticketId} = useParams()  
 const [bookRoomDetail, setBookRoomDetail] = useState('') 
 const [isLoading, setIsLoading] = useState(false)
 useEffect(() => {
  setIsLoading(true)
  const fetchGetRequestDetailByAdmin = async () => {
    const response = await requestApi.getRequestDetailByAdmin(ticketId)
    setBookRoomDetail(response)
    setIsLoading(false)
  }
  fetchGetRequestDetailByAdmin()
}, [])

console.log(bookRoomDetail);
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
                  <Header title="Book Room Detail"/>
                  <Box sx={{ mb: 1 }}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} md={6}>
                        <Typography>Title: {ticketId}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography textAlign="right">Sender Name:</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Sender Department:</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography textAlign="right">Booking Date:</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Start time:</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography textAlign="right">End Time:</Typography>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Typography>Content:</Typography>
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
                  <Box display='flex' gap='10px'>
                  <LoadingButton variant="contained" sx={{ bgcolor: 'red' }}>
                    Reject
                  </LoadingButton>
                  <LoadingButton variant="contained" sx={{ bgcolor: 'green' }}>
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
