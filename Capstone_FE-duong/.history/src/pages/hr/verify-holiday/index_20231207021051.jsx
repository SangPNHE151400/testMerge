import { LoadingButton } from '@mui/lab'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  TextField
} from '@mui/material'
import { useFormik } from 'formik'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/Header'
import userApi from '../../../services/userApi'
import { validationSchema } from './util/validationSchema'
import { useEffect } from 'react'

const VerifyHoliday = () => {
  const isLoading = useSelector((state) => state.user.changePassword?.isFetching)
  const accountId = useSelector((state) => state.auth.login?.currentUser?.accountId)
  const navigate = useNavigate()
  // console.log(accountId)

  useEffect(() => {
    const getCode = () => {
      
    }
    getCode()
  },[])

  const formik = useFormik({
    initialValues: {
      verify: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let data = {
        accountId: accountId,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      }
      userApi.changePassword(data)
    }
  })
  return (
    <Box height="100vh" bgcolor="seashell">
      <Box
        className="App"
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px'
        }}>
        <Grid container>
          <Grid item xs={12}>
            <form onSubmit={formik.handleSubmit} autoComplete="off" noValidate>
              <Card>
                <CardContent>
                  <Header title="Verify Code Holiday" />
                  <Box sx={{ mb: 1, mt: 3 }}>
                    <Grid item container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Verify Code"
                          type="text"
                          name="Verify Code"                          
                        />
                        
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
                  <LoadingButton
                    type="submit"
                    loading={isLoading}
                    variant="contained"
                    sx={{ bgcolor: 'rgb(94, 53, 177)' }}>
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

export default VerifyHoliday
