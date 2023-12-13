import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import MenuIcon from '@mui/icons-material/Menu'
import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material'
import { useState } from 'react'
import { Menu, MenuItem, Sidebar, useProSidebar } from 'react-pro-sidebar'
import { Link } from 'react-router-dom'
import AVATAR from '../../assets/images/user.png'
const AdminSidebar = () => {
  const { collapseSidebar, toggleSidebar, broken, collapsed } = useProSidebar()
  const [activeIndex, setActiveIndex] = useState(() => { 
    const initialIndex = 
      window.location.pathname === '/request-list-admin' ? 0 
      : window.location.pathname === 'manage-list-admin' ? 1 : 
      window.location.pathname === '/admin/profile' ? 4 : 
      window.location.pathname === '/admin/change-password' ? 5  
          : 0; 
    return initialIndex; 
  });
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
            <Link to="/request-list-adminr" style={{ textDecoration: 'none' }}>
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
        <Box height="60px" bgcolor="white" display='flex' alignItems='center' ml="20px" gap='20px'>
        <Avatar
              sx={{
                cursor: 'pointer',
                height: 40,
                width: 40
              }}
              src={AVATAR}
            />
              <Typography fontSize='15px' fontWeight='600'>Cristiano Ronaldo</Typography>
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
              component={<Link to="/request-list-admin" onClick={() => setActiveIndex(0)} />}>
              Check Your Ticket
            </MenuItem>
            <MenuItem active={activeIndex === 2} icon={<AppSettingsAltIcon />} component={<Link to="/admin/device-config"  onClick={() => setActiveIndex(2)} />}>
              {' '}
              Device Config{' '}
            </MenuItem>
          </Menu>
          

      </Sidebar>
    </>
  )
}

export default AdminSidebar
