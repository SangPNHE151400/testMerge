import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import securityApi from '../../../services/securityApi'
import { Avatar, Box, Divider, Typography, Button } from '@mui/material'
import ChatTopbar from '../../common/chat/components/ChatTopbar'
import { getDownloadURL, ref } from 'firebase/storage'
import { storage } from '../../../firebase/config'

const ControlLogDetail = () => {
  const { username, controlLogId } = useParams()
  console.log(username)
  console.log(controlLogId)
  const [control, setControl] = useState()
  const [AvatarImg, setAvatarImg] = useState('')

  useEffect(() => {
    const getControlLogDetail = async () => {
      let res = await securityApi.getControlLogDetail(username, controlLogId)
      setControl(res)
    }
    getControlLogDetail()
  }, [])

  const imgurl = async () => {
    const storageRef = ref(storage, `/${control?.avatar}`)
    try {
      const url = await getDownloadURL(storageRef)
      setAvatarImg(url)
    } catch (error) {
      console.error('Error getting download URL:', error)
    }
  }

  if (control && control?.avatar) {
    imgurl()
  }

  console.log(control)

  return (
    <Box>
      <ChatTopbar />
      <Box display="flex" alignItems="center" mb={3}>
        <Box flex="1" mt={3}>
          <Avatar
            src={AvatarImg}
            sx={{
              margin: 'auto',
              height: 110,
              width: 110
            }}
          />
        </Box>
        <Box flex="1" display="flex" marginTop="10px" height="80px">
          <Box flex="1" textAlign="left" borderRight="1px solid #999">
            <Typography fontSize={20}>Account: </Typography>
            <Typography fontSize={20} mt={4}>
              Role:{' '}
            </Typography>
          </Box>
          <Box flex="2" textAlign="left" marginLeft="20px">
            <Typography fontSize={20}>{control?.account}</Typography>
            <Typography fontSize={20} mt={4} sx={{ textTransform: 'capitalize' }}>
              {control?.role}{' '}
            </Typography>
          </Box>
        </Box>
        <Box flex="1" display="flex" marginTop="10px" height="80px">
          <Box flex="1" textAlign="left" borderRight="1px solid #999">
            <Typography fontSize={20}>Department </Typography>
            <Typography fontSize={20} mt={4}>
              Hire Date{' '}
            </Typography>
          </Box>
          <Box flex="2" textAlign="left" marginLeft="20px">
            <Typography fontSize={20} sx={{ textTransform: 'capitalize' }}>
              {control?.department}{' '}
            </Typography>
            <Typography fontSize={20} mt={4}>
              {control?.hireDate}{' '}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box m={5}>
        <img
          src={`data:image/png;base64, ${control?.image}`}
          style={{
            marginLeft: '100px',
            height: 180,
            width: 180
          }}
        />
        <Box display="flex" marginLeft="100px">
          <Box flex="1" display="flex" marginTop="40px" height="220px">
            <Box flex="1" textAlign="left" borderRight="1px solid #999">
              <Typography fontSize={20}>Device Id </Typography>
              <Typography fontSize={20} mt={4}>
                Device Name{' '}
              </Typography>
              <Typography fontSize={20} mt={4}>
                Date/Time{' '}
              </Typography>
              <Typography fontSize={20} mt={4}>
                Similar{' '}
              </Typography>
            </Box>
            <Box flex="2" textAlign="left" marginLeft="20px">
              <Typography fontSize={20} sx={{ textTransform: 'capitalize' }}>
                {control?.deviceId}{' '}
              </Typography>
              <Typography fontSize={20} mt={4}>
                {control?.deviceName}{' '}
              </Typography>
              <Typography fontSize={20} mt={4}>
                {control?.time}{' '}
              </Typography>
              <Typography fontSize={20} mt={4}>
                {control?.similar} %{' '}
              </Typography>
            </Box>
          </Box>

          <Box flex="1" display="flex" marginTop="40px" height="220px">
            <Box flex="1" textAlign="left" borderRight="1px solid #999">
              <Typography fontSize={20}>Operator </Typography>
              <Typography fontSize={20} mt={4}>
                Person ID{' '}
              </Typography>
              <Typography fontSize={20} mt={4}>
                Verify Status{' '}
              </Typography>
              <Typography fontSize={20} mt={4}>
                Temperature{' '}
              </Typography>
            </Box>
            <Box flex="2" textAlign="left" marginLeft="20px">
              <Typography fontSize={20} sx={{ textTransform: 'capitalize' }}>
                {control?.operator}{' '}
              </Typography>
              <Typography fontSize={20} mt={4}>
                {control?.personId}{' '}
              </Typography>
              <Typography fontSize={20} mt={4}>
                {control?.verifyStatus}{' '}
              </Typography>
              <Typography fontSize={20} mt={4}>
                {control?.temperature} <span>&deg; C</span>{' '}
              </Typography>
            </Box>
          </Box>
        </Box>
          <Button variant='contained' sx={{ml: '100px', mt: 6}}>Back</Button>
      </Box>
    </Box>
  )
}

export default ControlLogDetail
