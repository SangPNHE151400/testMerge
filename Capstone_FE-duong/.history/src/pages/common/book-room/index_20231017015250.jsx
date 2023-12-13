import { Scheduler } from '@aldabil/react-scheduler'
import { Box } from '@mui/material'
import ChatTopbar from '../chat/components/ChatTopbar'
const customHeader = (
  <Box display='flex'>
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
          view="day"
          events={[
            {
              event_id: 1,
              title: 'Event 1',
              start: new Date('2023/10/17 09:30'),
              end: new Date('2023/10/17 10:30')
            },
            {
              event_id: 2,
              title: 'Event 2',
              start: new Date('2021/5/4 10:00'),
              end: new Date('2021/5/4 11:00')
            }
          ]}
          day={{
            startHour: 7,
            endHour: 16,
            step: 30,
            headRenderer: () => customHeader,
          }}
          >
        </Scheduler>
      </Box>
    </>
  )
}

export default BookRoom
