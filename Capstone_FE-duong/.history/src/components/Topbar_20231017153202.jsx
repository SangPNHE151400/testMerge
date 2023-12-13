import { Box, FormControl, IconButton, InputAdornment, TextField } from '@mui/material'
import AccountPopover from './AccountPopover'
import NotificationsPopover from './NotificationsPopover'
import SearchIcon from '@mui/icons-material/Search'
import ChatIcon from '@mui/icons-material/Chat'
import { Link } from 'react-router-dom'
const Topbar = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={2}
      height="65px"
      bgcolor="#fff">
      <FormControl sx={{ width: '400px', bgcolor: '#fff', borderRadius: '10px', px: 2 }}>
        <TextField
          size="small"
          variant="outlined"
          sx={{ color: '#000', borderRadius: '10px', input: { color: '#000' }, width: '100%' }}
          placeholder="Search..."
          InputProps={{
            style: {
              borderRadius: '10px'
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#000' }} />
              </InputAdornment>
            )
          }}
        />
      </FormControl>
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
  )
}

export default Topbar
