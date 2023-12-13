import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useSelector } from 'react-redux'
  import { Link, useNavigate  } from 'react-router-dom'

export default function NotFoundPage() {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Typography variant="h1">404</Typography>
            <Typography variant="h6">The page you’re looking for doesn’t exist.</Typography>
            {/* {currentUser?.role === 'hr' ? (
              <Link to="/manage-user">
                <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                  Back to Dashboard
                </Button>
              </Link>
            ) : currentUser?.role === 'employee' ? (
              <Link to="/request-list-employee">
                <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                  Back to Dashboard
                </Button>
              </Link>
            ) : currentUser?.role === 'manager' ? (
              <Link to="/request-list-manager">
                <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                  Back to Dashboard
                </Button>
              </Link>
            ) : currentUser?.role === 'admin' ? (
              <Link to="/request-list-admin">
                <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                  Back to Dashboard
                </Button>
              </Link>
            ) : currentUser?.role === 'security' ? (
              <Link to="/manage-user">
                <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                  Back to Dashboard
                </Button>
              </Link>
            ) : (
              <></>
            )} */}
            <Button variant="contained" onClick={() => navigate(-1)} sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                  Back to Dashboard
                </Button>
          </Grid>
          <Grid xs={6}>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
              alt=""
              width={500}
              height={250}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
