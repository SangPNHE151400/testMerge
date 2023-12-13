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
  GroupingPanel,
  Resources,
  Scheduler,
  TodayButton,
  Toolbar
} from '@devexpress/dx-react-scheduler-material-ui'
// import Scheduler, { Resource } from 'devextreme-react/scheduler';
import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import requestApi from '../services/requestApi'

const BoolEditor = () => {
  return null
}

const Content = ({ appointmentData, ...restProps }) => {
  console.log(appointmentData)
  return (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
      <Grid mt={1} container alignItems="center">
        <Grid display="flex" gap="8px" ml="25px" item xs={10}>
          <Typography>Status: </Typography>
          <Typography color={appointmentData.bookingStatus === 'ACCEPTED' ? 'green' : 'brown'}>
            {appointmentData.bookingStatus}
          </Typography>
        </Grid>
      </Grid>
    </AppointmentTooltip.Content>
  )
}

const TextEditor = (props) => {
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
      const updatedData = res.filter((item) => {
        return !item.roomName.startsWith('Tech')
      })
      const updatedRoom = updatedData.map((item) => {
        return { text: item.roomName, id: parseInt(item.roomId) }
      })
      setRoom(updatedRoom)
      const departmentResource = {
        fieldName: 'roomId',
        title: 'Room',
        instances: updatedRoom
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
          bookingStatus: item.bookingStatus
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
  const commitChanges = async ({ added }) => {
    const dateStart = moment(added.startDate.toString())
        const timeStart = dateStart.format('HH:mm:ss')
        const dateEnd = moment(added.endDate.toString())
        const timeEnd = dateEnd.format('HH:mm:ss')

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

        let dataAdd = {
          id: currentUser?.accountId,
          startDate: dateStart.format('YYYY-MM-DD HH:mm'),
          endDate: dateEnd.format('YYYY-MM-DD HH:mm'),
          title: added.title,
          roomId: added.roomId,
          bookingStatus: 'PENDING'
        }


        const res = await requestApi.createRoomBookingTicket(data)
        console.log(res);
     setData((prevData) => {
      let newData = [...prevData]
      if (added && res === 1) {
        newData = [...newData, dataAdd]
      }
      return newData
    })
  }

  const DateEditor = ({ ...restProps }) => {
    return <AppointmentForm.DateEditor {...restProps} readOnly></AppointmentForm.DateEditor>
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
      ) : currentUser?.role === 'manager' || currentUser?.role === 'hr' ? (
        <Scheduler data={data}>
          <ViewState />
          <EditingState onCommitChanges={commitChanges} />
          <GroupingState grouping={grouping} />
          <DayView Time startDayHour={8} cellDuration={60} endDayHour={24} />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <Appointments />
          <Resources data={resources} mainResourceName="roomId" />
          <IntegratedGrouping />
          <IntegratedEditing />
          <AppointmentTooltip contentComponent={Content} />
          <AppointmentForm
            booleanEditorComponent={BoolEditor}
            labelComponent={LabelComponent}
            dateEditorComponent={DateEditor}
            textEditorComponent={TextEditor}
            basicLayoutComponent={BasicLayout}
          />
          <GroupingPanel />
        </Scheduler>
      ) : currentUser?.role === 'admin' || currentUser?.role === 'security' ? (
        <Scheduler data={data}>
          <ViewState />
          <EditingState onCommitChanges={commitChanges} />
          <GroupingState grouping={grouping} />
          <DayView Time startDayHour={8} cellDuration={60} endDayHour={24} />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <Appointments />
          <Resources data={resources} mainResourceName="roomId" />
          <IntegratedGrouping />
          <IntegratedEditing />
          <AppointmentTooltip contentComponent={Content} />
          <GroupingPanel />
        </Scheduler>
      ) : (
        <></>
      )}
    </Paper>
  )
}

export default BookRoom
