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

const appointments = [
  {
    id: 0,
    title: 'Watercolor Landscape',
    roomId: 1,
    startDate: new Date(2017, 4, 28, 9, 30),
    endDate: new Date(2017, 4, 28, 9, 30)
  },
  {
    id: 1,
    title: 'Watercolor Landscape',
    roomId: 2,
    startDate: new Date(2017, 4, 28, 9, 30),
    endDate: new Date(2017, 4, 28, 9, 30)
  }
]

const locations = [
  { text: 'Room 1', id: 1 },
  { text: 'Room 2', id: 2 },
  { text: 'Room 3', id: 3 }
]

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
    <Paper>
      <Scheduler data={data}>
        <EditingState onCommitChanges={commitChanges} />
        <GroupingState grouping={grouping} />
        <ViewState defaultCurrentDate="2023-10-17" />       
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <DayView startDayHour={9} endDayHour={16} />
        <Appointments />
        <Resources data={resources} mainResourceName="roomId" />
        <IntegratedGrouping />
        <IntegratedEditing />
        <AppointmentTooltip showOpenButton />
        <AppointmentForm />
        <GroupingPanel />
        <DragDropProvider />
      </Scheduler>
    </Paper>
  )
}

export default BookRoom
