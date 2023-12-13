import ChatIcon from '@mui/icons-material/Chat'
import { Box, Divider, IconButton, Typography, Link } from '@mui/material'
import AccountPopover from '../../../../components/AccountPopover'
import NotificationsPopover from '../../../../components/NotificationsPopover'

const ChatTopbar = () => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={2}
        height="65px"
        bgcolor="#fff" 
        >
          <Typography fontWeight="800" color="#000" fontSize="22px" sx={{ cursor: 'pointer' }}>
            BMS
          </Typography>

        <Box display="flex" gap="10px" alignItems="center">
          <NotificationsPopover />
          <Link href="/chat">
            <IconButton sx={{ color: 'rgb(94, 53, 177)' }} size="small">
              <ChatIcon />
            </IconButton>
          </Link>
          <AccountPopover />
        </Box>
      </Box>
      <Divider/>
    </>
  )
}

export default ChatTopbar
