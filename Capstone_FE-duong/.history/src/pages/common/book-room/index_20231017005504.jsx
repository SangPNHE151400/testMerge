import { Box } from '@mui/material'
import ChatTopbar from '../chat/components/ChatTopbar'
import { Scheduler } from '@aldabil/react-scheduler'
const customResourceHeader = ({ resource }) => {
  return (
    <div>
      {resource === 'Slot 1' && <div>Slot 1</div>}
      {resource === 'Slot 2' && <div>Slot 2</div>}
      {resource === 'Slot 3' && <div>Slot 3</div>}
    </div>
  );
};
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
              start: new Date('2021/5/2 09:30'),
              end: new Date('2021/5/2 10:30')
            },
            {
              event_id: 2,
              title: 'Event 2',
              start: new Date('2021/5/4 10:00'),
              end: new Date('2021/5/4 11:00')
            }
          ]}
          resourceHeaderComponent={customResourceHeader}
        />
      </Box>
    </>
  )
}

export default BookRoom
