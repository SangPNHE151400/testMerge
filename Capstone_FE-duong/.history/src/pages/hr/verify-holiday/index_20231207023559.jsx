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
import { jwtDecode } from 'jwt-decode'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/Header'
import holidayApi from '../../../services/holidayApi'
import { toast } from 'react-toastify'
const VerifyHoliday = () => {
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const decoded = jwtDecode(currentUser?.jwtToken)
  const navigate = useNavigate()
  // console.log(accountId)
  const [code, setCode] = useState('')
  const [codeType, setCodeType] = useState('')
  useEffect(() => {
    const getCode = async () => {
      let data = {
        userName: decoded.sub
      }
      const res = await holidayApi.verifyCode(data)
      setCode(res);
    }
    getCode()
  },[])

  const handleVerifySubmit = () => {
    if(codeType === code){
      navigate('/change-log-view')
    }else{
      toast.error('Code wrong, please try again!!')
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
          transform: 'translate(-50%, -50%)',
          width: '800px'
        }}>
        <Grid container>
          <Grid item xs={12}>
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
                          value={codeType}
                          onChange={(e) => setCodeType(e.target.value)}                      
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
                    variant="contained"
                    sx={{ bgcolor: 'rgb(94, 53, 177)' }}
                    onClick={handleVerifySubmit}
                    >
                    Save
                  </LoadingButton>
                </CardActions>
              </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default VerifyHoliday
