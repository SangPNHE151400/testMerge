import { LoadingButton } from '@mui/lab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import authApi from '../../../services/authApi'
const ResetPassword = () => {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = (e) => {
    setIsLoading(true)
    e.preventDefault()
    let data = {
        username: username
    }
    authApi.resetPassword(data)
    setIsLoading(false)
  }
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          height: '100vh'
        }}>
        <Grid container sx={{ flex: '1 1 auto' }}>
          <Grid
            xs={12}
            lg={6}
            sx={{
              backgroundColor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
            item>
            <Box
              sx={{
                backgroundColor: 'background.paper',
                flex: '1 1 auto',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center'
              }}>
              <Box
                sx={{
                  maxWidth: 550,
                  px: 3,
                  py: '100px',
                  width: '100%'
                }}>
                <div>
                  <Stack spacing={1} sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: '35px', fontWeight: '700' }}>Reset Password</Typography>
                  </Stack>
                  <form noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        type="username"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Stack>
                    <LoadingButton
                      fullWidth
                      loading={isLoading}
                      size="large"
                      sx={{
                        mt: 2,
                        bgcolor: 'rgb(99, 102, 241)',
                        p: '11px 24px',
                        borderRadius: '12px'
                      }}
                      type="submit"
                      variant="contained">
                      Submit
                    </LoadingButton>
                  </form>
                </div>
              </Box>
            </Box>
          </Grid>
          <Grid
            xs={12}
            lg={6}
            sx={{
              alignItems: 'center',
              background: 'radial-gradient(circle, rgba(9,50,121,1) 16%, rgba(0,212,255,1) 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              '& img': {
                maxWidth: '100%'
              }
            }}
            item></Grid>
        </Grid>
      </Box>
    </>
  )
}

export default ResetPassword
