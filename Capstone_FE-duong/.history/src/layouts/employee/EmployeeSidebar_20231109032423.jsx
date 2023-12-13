import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox'
import MenuIcon from '@mui/icons-material/Menu'
import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material'
import { getDownloadURL, ref } from 'firebase/storage'
import { useState } from 'react'
import { Menu, MenuItem, Sidebar, useProSidebar } from 'react-pro-sidebar'
import { Link } from 'react-router-dom'
import { storage } from '../../firebase/config'
import useAuth from '../../hooks/useAuth'
const EmployeeSidebar = () => {
  const { collapseSidebar, toggleSidebar, broken, collapsed } = useProSidebar()
  const [activeIndex, setActiveIndex] = useState(() => {
    const initialIndex =
      window.location.pathname === '/check-attendance'
        ? 0 : window.location.pathname === '/request-list-employee'
        ? 1 : window.location.pathname === '/notification-list-emp'
        ? 2 : window.location.pathname === '/notification-receive-emp'
         0
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
              <Typography fontWeight="800" color="#000" fontSize="22px" sx={{ cursor: 'pointer' }}>
                BMS
              </Typography>
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
          {currentUser.firstName} {currentUser.lastName}
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
            component={<Link to="/check-attendance" onClick={() => setActiveIndex(0)} />}>
            Check Attendace
          </MenuItem>
          <MenuItem
            active={activeIndex === 1}
            icon={<AppSettingsAltIcon />}
            component={<Link to="/request-list-employee" onClick={() => setActiveIndex(1)} />}>
            {' '}
            Check Your Ticket
          </MenuItem>
          {/* <SubMenu
            label="Notification"
            icon={<NotificationsIcon />}
          > */}
          {/* <MenuItem
              active={activeIndex === 2}
              icon={<ClearAllIcon />}
              component={<Link to="/notification-list-emp" onClick={() => setActiveIndex(2)} />}>
              {' '}
              All Notification
            </MenuItem> */}
            {/* <MenuItem
              active={activeIndex === 3}
              icon={<DraftsIcon />}
              component={<Link to="/notification-draft-emp" onClick={() => setActiveIndex(3)} />}>
              {' '}
              Draft
            </MenuItem> */}
            {/* <SubMenu
            label='Sent&Receive'
            icon={<UploadIcon />}> */}
            {/* <MenuItem
              active={activeIndex === 4}
              icon={<ForwardToInboxIcon />}
              component={<Link to="/notification-send-emp" onClick={() => setActiveIndex(4)} />}>
              {' '}
              Send
            </MenuItem> */}
            <MenuItem
              active={activeIndex === 5}
              icon={<MarkunreadMailboxIcon />}
              component={<Link to="/notification-receive-emp" onClick={() => setActiveIndex(5)} />}>
              {' '}
              Notifications
            </MenuItem>
            {/* </SubMenu>
           */}
            {/* <SubMenu
            label='Scheduled'
            icon={<CalendarTodayIcon/>}
            >
            <MenuItem
              active={activeIndex === 6}
              icon={<DensitySmallIcon />}
              component={<Link to="/" onClick={() => setActiveIndex(9)} />}>
              {' '}
              All
            </MenuItem> 
            <MenuItem
              active={activeIndex === 7}
              icon={<ContactMailIcon />}
              component={<Link to="/notification-schedule-emp" onClick={() => setActiveIndex(7)} />}>
              {' '}
              Personal
            </MenuItem> 
            </SubMenu> */}
            {/* </SubMenu> */}
        </Menu>
        
      </Sidebar>
    </>
  )
}

export default EmployeeSidebar
