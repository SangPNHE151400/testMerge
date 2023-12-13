import ChatIcon from '@mui/icons-material/Chat'
import { Box, IconButton, Paper, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import AccountPopover from '../../../../components/AccountPopover'
import NotificationsPopover from '../../../../components/NotificationsPopover'
const ChatTopbar = () => {
  return (
    <Paper elevation={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        height="65px"
        bgcolor="#fff">
        <Link to="/manage-user" style={{ textDecoration: 'none' }}>
          <Typography fontWeight="800" color="#000" fontSize="22px" sx={{ cursor: 'pointer' }}>
            BMS
          </Typography>
        </Link>
        <Box display="flex" gap="10px" alignItems="center">
          <NotificationsPopover />
          <Link to="/chat">
            <IconButton sx={{ color: 'rgb(94, 53, 177)' }} size="small">
              <ChatIcon />
            </IconButton>
          </Link>
          <AccountPopover />
        </Box>
      </Box>
    </Paper>
  )
}

export default ChatTopbar
