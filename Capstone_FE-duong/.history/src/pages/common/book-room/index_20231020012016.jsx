import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import {
  ViewState,
  GroupingState,
  IntegratedGrouping,
  IntegratedEditing,
  EditingState,
  
} from '@devexpress/dx-react-scheduler'
import {
  Scheduler,
  Resources,
  Appointments,
  AppointmentTooltip,
  GroupingPanel,
  DayView,
  DragDropProvider,
  AppointmentForm,
  DateNavigator,
  Toolbar,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui'
import { toast } from 'react-toastify'
import { Grid, Typography } from '@mui/material'
import RoomIcon from '@mui/icons-material/Room';
import PersonIcon from '@mui/icons-material/Person';
const appointments = [
  {
    id: 0,
    title: 'Watercolor Landscape',
    roomId: 1,
    startDate: new Date('2023/10/17 09:30'),
    endDate: new Date('2023/10/17 10:30')
  },
  {
    id: 1,
    title: 'Watercolor Landscape',
    roomId: 2,
    startDate: new Date('2023/10/17 09:30'),
    endDate: new Date('2023/10/17 10:30'),
    information: 'asdasd'
  }
]

const locations = [
  { text: 'Room 1', id: 1 },
  { text: 'Room 2', id: 2 },
  { text: 'Room 3', id: 3 },
]

const Content = (({
 ...restProps
}) => {
  return(
  <AppointmentTooltip.Content {...restProps}>
    <Grid container alignItems="center">
      <Grid display='flex' gap='20px' mt='10px' ml='20px' item xs={10}>
        <RoomIcon /> <Typography>sad</Typography>
      </Grid>
      <Grid display='flex' gap='20px' mt='10px' ml='20px' item xs={10}>
        <PersonIcon /> <Typography>sad</Typography>
      </Grid>
    </Grid>
  </AppointmentTooltip.Content>
  )
});
const BookRoom = () => {
  
  const [data, setData] = useState(appointments)
  const [resources] = useState([
    {
      fieldName: 'roomId',
      title: 'Location',
      instances: locations
    }
  ])
  const [grouping] = useState([
    {
      resourceName: 'roomId'
    }
  ])
  
  const commitChanges = ({ added, changed, deleted }) => {
    setData((prevData) => {
      let newData = [...prevData]
      if (added) {
        const startingAddedId = newData.length > 0 ? newData[newData.length - 1].id + 1 : 0
        newData = [...newData, { id: startingAddedId, ...added }]  
        toast.success('Add sucessfully')
        console.log(added);     
      }
      if (changed) {
        newData = newData.map((appointment) =>
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
        )
      }
      if (deleted !== undefined) {
        newData = newData.filter((appointment) => appointment.id !== deleted)
      }
      return newData
    })
  }

  return (
    <Paper sx={{mb: 2}}>
      <Scheduler data={data}>
        <ViewState/>       
        <EditingState onCommitChanges={commitChanges} />
        <GroupingState grouping={grouping} />
        <DayView startDayHour={9} endDayHour={16} />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <Appointments />
        <Resources data={resources} mainResourceName="roomId" />
        <IntegratedGrouping />
        <IntegratedEditing />
        <AppointmentTooltip contentComponent={Content} showOpenButton />
        <AppointmentForm />
        <GroupingPanel />
        <DragDropProvider />
      </Scheduler>
    </Paper>
  )
}

export default BookRoom
