import { Scheduler } from 'smart-webcomponents-react/scheduler';
import { Box } from '@mui/material'
import ChatTopbar from '../chat/components/ChatTopbar'
const customHeader = (
  <Box height='100%' display='flex' alignItems='center' justifyContent='space-between'>
    <div>Slot 1</div>
    <div>Slot 2</div>
    <div>Slot 3</div>
  </Box>
);
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
