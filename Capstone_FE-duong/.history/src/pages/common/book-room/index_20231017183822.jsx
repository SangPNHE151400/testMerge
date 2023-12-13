import { Scheduler } from 'smart-webcomponents-react/scheduler';
import { Box } from '@mui/material'
import ChatTopbar from '../chat/components/ChatTopbar'
const BookRoom = () => {
  return (
    <>
      <ChatTopbar />
      <Box>
        <Scheduler 
          view="timelineDay"
          >
            
        </Scheduler>
      </Box>
    </>
  )
}

export default BookRoom
