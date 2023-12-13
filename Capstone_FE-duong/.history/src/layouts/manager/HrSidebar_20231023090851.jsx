import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material';
import { getDownloadURL, ref } from 'firebase/storage';
import { useState } from 'react';
import { Menu, MenuItem, Sidebar, useProSidebar } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { storage } from '../../firebase/config';
import useAuth from '../../hooks/useAuth';
const ManagerSidebar = () => {
  const { collapseSidebar, toggleSidebar, broken, collapsed } = useProSidebar()
  const [activeIndex, setActiveIndex] = useState(() => {
    const initialIndex =
     window.location.pathname === '/request-list-manager'
        ? 0 : window.location.pathname === '/book-room'
        ? 1
        :0
    return initialIndex
  })
  const [userProfileImage, setUserProfileImage] = useState('')
  const currentUser = useAuth()
  const imgurl = async () => {
    const storageRef = ref(storage, `/${currentUser.image}`)
    try {
      const url = await getDownloadURL(storageRef)
      setUserProfileImage(url)
    } catch (error) {
      console.error('Error getting download URL:', error)
    }
  }
  if (currentUser && currentUser.image) {
    imgurl()
  }
  return (
    <>
      <Sidebar
        style={{
          height: '100%',
          top: 'auto',
          border: 0
        }}
        breakPoint="md"
        backgroundColor="#fff">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          ml="15px"
          height="65px">
          {!collapsed ? (
            <Link to="/manage-user" style={{ textDecoration: 'none' }}>
              <Typography fontWeight="800" color="#000" fontSize="22px" sx={{ cursor: 'pointer' }}>
                BMS
              </Typography>
            </Link>
          ) : null}
          <IconButton
            onClick={() => {
              broken ? toggleSidebar() : collapseSidebar()
            }}
            sx={{ color: 'rgb(94, 53, 177)' }}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box height="60px" bgcolor="white" display="flex" alignItems="center" ml="20px" gap="20px">
          <Avatar
            sx={{
              cursor: 'pointer',
              height: 40,
              width: 40
            }}
            src={`${userProfileImage}`}
          />
          <Typography fontSize="15px" fontWeight="600">
            {currentUser.firstName}
          </Typography>
        </Box>
        <Divider />
        {/* <Box mb="25px">
          <Box display="flex" justifyContent="center" alignItems="center">
            {!collapsed ? (
              <img
                alt="profile-user"
                width="100px"
                height="100px"
                src={USERICON}
                style={{
                  cursor: 'pointer',
                  borderRadius: '50%',
                  marginBottom: '20px'
                }}
              />
            ) : null}
          </Box>
          <Box textAlign="center">
            {!collapsed ? (
              <Typography
                color="#000"
                sx={{ m: '10px 0 10px 0', fontSize: '20px', fontWeight: '700' }}>
                Ed Roh
              </Typography>
            ) : null}
            {!collapsed ? (
              <Typography variant="h5" color="#000">
                VP Fancy Admin
              </Typography>
            ) : null}
          </Box>
        </Box> */}
        <Menu
          menuItemStyles={{
            button: ({ active }) => {
              return {
                backgroundColor: active ? 'rgb(237, 231, 246)' : undefined,
                color: '#000',
                '&:hover': {
                  backgroundColor: 'rgb(237, 231, 246)',
                  color: 'rgb(94, 53, 177)',
                  borderRadius: '10px'
                }
              }
            }
          }}>

          <MenuItem
            active={activeIndex === 0}
            icon={<AssignmentTurnedInIcon />}
            component={<Link to="/request-list-manager" onClick={() => setActiveIndex(0)} />}>
            {' '}
            Ticket Management
          </MenuItem>
          <MenuItem
            active={activeIndex === 1}
            icon={<AssignmentTurnedInIcon />}
            component={<Link to="/book-room" onClick={() => setActiveIndex(1)} />}>
            {' '}
            Book room
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  )
}
export default ManagerSidebar
