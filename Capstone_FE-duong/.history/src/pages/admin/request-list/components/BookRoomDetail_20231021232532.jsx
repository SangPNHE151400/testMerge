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
import { Link } from 'react-router-dom'
import Header from '../../../../components/Header'

const BookListDetail = () => {
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
                  <Header title="Change Password" subtitle="Update Password" />
                  <Box sx={{ mb: 1 }}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12} md={6}>
                        <Typography>Morning Total:</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography textAlign="right">Afternoon Total:</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography>Inside Time:</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography textAlign="right">Outside Time:</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', py: '8px' }}>
                  <Link to="/admin">
                    <Button variant="contained" sx={{ bgcolor: 'rgb(94, 53, 177)' }}>
                      Back to Dashboard
                    </Button>
                  </Link>
                  <LoadingButton variant="contained" sx={{ bgcolor: 'rgb(94, 53, 177)' }}>
                    Save
                  </LoadingButton>
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
