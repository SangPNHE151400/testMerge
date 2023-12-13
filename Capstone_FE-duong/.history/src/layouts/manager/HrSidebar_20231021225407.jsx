import DashboardIcon from '@mui/icons-material/Dashboard'
import MenuIcon from '@mui/icons-material/Menu'
import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material'
import { Menu, MenuItem, Sidebar, useProSidebar } from 'react-pro-sidebar'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { getDownloadURL, ref } from 'firebase/storage'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { storage } from '../../firebase/config'
import useAuth from '../../hooks/useAuth'
const HrSidebar = () => {
  const { collapseSidebar, toggleSidebar, broken, collapsed } = useProSidebar()
  const [activeIndex, setActiveIndex] = useState(() => {
    const initialIndex =
      window.location.pathname === '/manage-user'
        ? 0
        : window.location.pathname === '/manage-profile'
        ? 1
        : window.location.pathname === '/request-list'
        ? 2
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
            icon={<DashboardIcon />}
            component={<Link to="/manage-user" onClick={() => setActiveIndex(0)} />}>
            {' '}
            Manage User
          </MenuItem>
          <MenuItem
            active={activeIndex === 1}
            icon={<DashboardIcon />}
            component={<Link to="/manage-profile" onClick={() => setActiveIndex(1)} />}>
            {' '}
            Manage Profile
          </MenuItem>
          <MenuItem
            active={activeIndex === 1}
            icon={<AssignmentTurnedInIcon />}
            component={<Link to="/request-list" onClick={() => setActiveIndex(2)} />}>
            {' '}
            Ticket Management
          </MenuItem>
        </Menu>
      </Sidebar>
    </>
  )
}
export default HrSidebar
