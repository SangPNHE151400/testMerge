import ChatIcon from '@mui/icons-material/Chat'
import { Box, FormControl, IconButton, Link } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userApi from '../services/userApi'
import AccountPopover from './AccountPopover'
import NotificationsPopover from './NotificationsPopover'

const Topbar = () => {
  const userId = useSelector((state) => state.auth.login?.currentUser?.accountId)
  const dispatch = useDispatch()
  useEffect(() => {
    userApi.getUserInfo(userId, dispatch)
  }, [])
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={2}
      height="65px"
      bgcolor="#fff">
      <FormControl sx={{ width: '400px', bgcolor: '#fff', borderRadius: '10px', px: 2 }}>
      </FormControl>
      <Box display="flex" gap="10px" alignItems="center">
        <NotificationsPopover />
        <Link href="/chat">
          <IconButton sx={{ color: 'rgb(94, 53, 177)' }} size="small">
            <ChatIcon />
          </IconButton>
        </Link>
        <AccountPopover />
        {userId && userId.role && (
          <div>
            User Role: 
          </div>
          )}
      </Box>
    </Box>
  )
}

export default Topbar
