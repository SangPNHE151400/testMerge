import {
  EditingState,
  GroupingState,
  IntegratedEditing,
  IntegratedGrouping,
  ViewState
} from '@devexpress/dx-react-scheduler'
import {
  AppointmentForm,
  AppointmentTooltip,
  Appointments,
  DateNavigator,
  DayView,
  DragDropProvider,
  GroupingPanel,
  Resources,
  Scheduler,
  TodayButton,
  Toolbar
} from '@devexpress/dx-react-scheduler-material-ui'
import PersonIcon from '@mui/icons-material/Person'
import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import moment from 'moment'
import { useEffect, useState } from 'react'
import requestApi from '../../../services/requestApi'
import { useSelector } from 'react-redux'
const BoolEditor = () => {
  return null
}

const Content = ({ ...restProps }) => {
  return (
    <AppointmentTooltip.Content {...restProps}>
      <Grid container alignItems="center">
        <Grid display="flex" gap="20px" ml="20px" item xs={10}>
          <PersonIcon sx={{ color: 'blue' }} /> <Typography>sad</Typography>
        </Grid>
      </Grid>
    </AppointmentTooltip.Content>
  )
}

const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === 'multilineTextEditor') {
    return null
  }
  return <AppointmentForm.TextEditor {...props} />
}

const LabelComponent = (props) => {
  if (props.text === 'More Information') {
    return null
  }
}

const BookRoom = () => {
  const [data, setData] = useState([])
  const [room, setRoom] = useState([
    {
      text: '',
      id: 0
    }
  ])
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const [resources, setResources] = useState([
    {
      fieldName: 'roomId',
      title: 'Location',
      instances: room
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsLoading(true)
    const fetchAllRooms = async () => {
      const res = await requestApi.getAllRoom()
      const updatedData = res.map((item) => {
        return { text: item.roomName, id: parseInt(item.roomId) }
      })
      setRoom(updatedData)
      const departmentResource = {
        fieldName: 'roomId',
        title: 'Room',
        instances: updatedData
      }
      setResources([departmentResource])
      setIsLoading(false)
    }
    fetchAllRooms()
  }, [])

  useEffect(() => {
    const fetchAllBookRooms = async () => {
      const res = await requestApi.getAllBookRooms()
      const updatedData = res.map((item) => {
        return {
          id: item.id,
          startDate: item.bookingDate + ' ' + item.startDate,
          endDate: item.bookingDate + ' ' + item.endDate,
          title: item.title,
          roomId: item.roomId,
          departmentId: item.departmentId,
          content: item.content
        }
      })
      setData(updatedData)
    }
    fetchAllBookRooms()
  }, [])

  console.log(data)

  const [grouping] = useState([
    {
      resourceName: 'roomId'
    }
  ])
  const commitChanges = ({ added, changed, deleted }) => {
    setData((prevData) => {
      let newData = [...prevData]
      if (added) {
        // const startingAddedId = newData.length > 0 ? newData[newData.length - 1].id + 1 : 0
        // newData = [...newData, { id: startingAddedId, ...added }]
        // toast.success('Add sucessfully')
        // console.log(added)
        const dateStart = moment(added.startDate.toString())
        const timeStart = dateStart.format('HH:mm')
        const dateEnd = moment(added.endDate.toString())
        const timeEnd = dateEnd.format('HH:mm')
        let data = {
          userId: currentUser?.accountId,
          departmentSenderId: added.departmentId.toString(),
          roomId: added.roomId,
          title: added.title,
          content: added.content,
          bookingDate: dateStart.format('YYYY-MM-DD'),
          startTime: timeStart,
          endTime: timeEnd,
          departmentReceiverId: '9'
        }
        console.log(data)
        newData = [...newData, data]
        requestApi.createRoomBookingTicket(data)
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

  const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    const [department, setDepartment] = useState([
      {
        text: '',
        id: 0
      }
    ])

    useEffect(() => {
      const fetchAllDepartment = async () => {
        const res = await requestApi.getAllDepartment()
        const updatedData = res.map((item) => {
          return { text: item.departmentName, id: parseInt(item.departmentId) }
        })
        setDepartment(updatedData)
      }
      fetchAllDepartment()
    }, [])
    const onCustomFieldChangeContent = (nextValue) => {
      onFieldChange({ content: nextValue })
    }

    const onCustomFieldChangeDepartment = (nextValue) => {
      onFieldChange({ departmentId: nextValue })
    }

    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}>
        <AppointmentForm.Label text="Department" />
        <AppointmentForm.Select
          value={appointmentData.departmentId}
          onValueChange={onCustomFieldChangeDepartment}
          availableOptions={department}
          type="filledSelect"
        />
        <AppointmentForm.Label text="Content" />
        <AppointmentForm.TextEditor
          value={appointmentData.content}
          onValueChange={onCustomFieldChangeContent}
          placeholder="Write your content"
          type="multilineTextEditor"
        />
      </AppointmentForm.BasicLayout>
    )
  }
  return (
    <Paper sx={{ mb: 2 }}>
      {isLoading ? (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <Scheduler data={data}>
          <ViewState />
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
          <AppointmentForm
            booleanEditorComponent={BoolEditor}
            labelComponent={LabelComponent}
            textEditorComponent={TextEditor}
            basicLayoutComponent={BasicLayout}
          />
          <GroupingPanel />
          <DragDropProvider />
        </Scheduler>
      )}
    </Paper>
  )
}

export default BookRoom
