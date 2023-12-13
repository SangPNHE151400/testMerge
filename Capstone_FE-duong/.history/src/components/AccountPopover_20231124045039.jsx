import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import PasswordIcon from '@mui/icons-material/Password'
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Typography
} from '@mui/material'
import { getDownloadURL, ref } from 'firebase/storage'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { storage } from '../firebase/config'
import useAuth from '../hooks/useAuth'
import { logOutSuccess } from '../redux/authSlice'
const AccountPopover = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(null)
  const dispatch = useDispatch()
  const handleOpen = (event) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }

  const handleLogout = () => {
    dispatch(logOutSuccess())
    localStorage.clear()
    navigate('/login')
    toast.success('Logout successfully!');
  }

  const [userProfileImage, setUserProfileImage] = useState("")
  const currentUser = useAuth()
  // const imgurl = async () => {
  //   const storageRef = ref(storage, `/${currentUser.image}`);
  //   try {
  //     const url = await getDownloadURL(storageRef);
  //     setUserProfileImage(url);
  //   } catch (error) {
  //     console.error('Error getting download URL:', error);
  //   }
  // };

  // if (currentUser && currentUser.image) {
  //   imgurl();
  // }
  return (
    <>
      <IconButton sx={{ color: 'rgb(94, 53, 177)' }} onClick={handleOpen} size="small">
        <Avatar
          sx={{
            cursor: 'pointer',
            height: 40,
            width: 40
          }}
          src={`${userProfileImage}`}
        />
      </IconButton>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 230,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <MenuItem onClick={() => navigate('/profile')}>
          <Box display="flex" gap={1.5} alignItems="center">
            <AccountCircleIcon sx={{ height: '30px', width: '30px' }} />{' '}
            <Typography>Profile</Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => navigate('/change-password')}>
          <Box display="flex" gap={1.5} alignItems="center">
            <PasswordIcon sx={{ height: '30px', width: '30px' }} />{' '}
            <Typography>Change Password</Typography>
          </Box>
        </MenuItem>
        <Divider sx={{m: '0 !important'}} />
        <MenuItem onClick={handleLogout}>
          <Box display="flex" gap={1.5} alignItems="center">
            <LogoutIcon sx={{ height: '30px', width: '30px' }} /> <Typography>Logout</Typography>
          </Box>
        </MenuItem>
      </Popover>
    </>
  )
}

export default AccountPopover
