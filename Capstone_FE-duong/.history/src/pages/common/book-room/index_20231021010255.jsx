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
import { Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import moment from 'moment'
import { useEffect, useState } from 'react'
import requestApi from '../../../services/requestApi'
const appointments = [
  {
    id: 0,
    title: 'Watercolor Landscape',
    roomId: 1,
    departmentId: 1,
    startDate: '2023-10-18 09:30',
    endDate: '2023-10-18 10:30'
  },
  {
    id: 1,
    title: 'Watercolor Landscape',
    roomId: 2,
    departmentId: 2,
    startDate: '2023-10-18 09:30',
    endDate: '2023-10-18 10:30',
    information: 'asdasd'
  }
]
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
  const [data, setData] = useState(appointments)
  const [department, setDepartment] = useState([])
  const [modifiedDepartment, setModifiedDepartment] = useState([])
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


  const locations = [
    { text: 'Room 1', id: 1 },
    { text: 'Room 2', id: 2 },
    { text: 'Room 3', id: 3 }
  ]

  console.log(locations);
  console.log(department);
  const [resources] = useState([
      {
        fieldName: 'roomId',
        title: 'Location',
        instances: locations
      },
      {
        fieldName: 'departmentId',
        title: 'Department',
        instances: department
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
        // const startingAddedId = newData.length > 0 ? newData[newData.length - 1].id + 1 : 0
        // newData = [...newData, { id: startingAddedId, ...added }]
        // toast.success('Add sucessfully')
        // console.log(added)

        const dateStart = moment(added.startDate.toString())
        const timeStart = dateStart.format('HH:mm')
        const dateEnd = moment(added.endDate.toString())
        const timeEnd = dateEnd.format('HH:mm')
        let data = {
          title: added.title,
          startTime: timeStart,
          endTime: timeEnd,
          content: added.content
        }

        console.log(data)
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
    const onCustomFieldChange = (nextValue) => {
      onFieldChange({ content: nextValue })
    }

    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}>
        <AppointmentForm.Label text="Content" />
        <AppointmentForm.TextEditor
          value={appointmentData.content}
          onValueChange={onCustomFieldChange}
          placeholder="Write your content"
          type="multilineTextEditor"
        />
      </AppointmentForm.BasicLayout>
    )
  }
  return (
    <Paper sx={{ mb: 2 }}>
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
    </Paper>
  )
}

export default BookRoom
