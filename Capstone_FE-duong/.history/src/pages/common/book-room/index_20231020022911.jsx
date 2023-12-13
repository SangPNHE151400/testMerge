import {
  EditingState,
  GroupingState,
  IntegratedEditing,
  IntegratedGrouping,
  ViewState,
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
  Toolbar,
} from '@devexpress/dx-react-scheduler-material-ui'
import PersonIcon from '@mui/icons-material/Person'
import { Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import requestApi from '../../../services/requestApi'
const appointments = [
  {
    id: 0,
    title: 'Watercolor Landscape',
    roomId: 1,
    departmentId: 1,
    startDate: new Date('2023/10/17 09:30'),
    endDate: new Date('2023/10/17 10:30')
  },
  {
    id: 1,
    title: 'Watercolor Landscape',
    roomId: 2,
    departmentId: 2,
    startDate: new Date('2023/10/17 09:30'),
    endDate: new Date('2023/10/17 10:30'),
    information: 'asdasd'
  }
]
const BoolEditor = () => {
  return null;
};
const locations = [
  { text: 'Room 1', id: 1 },
  { text: 'Room 2', id: 2 },
  { text: 'Room 3', id: 3 },
]

const departments = [
  { text: 'Marketing', id: 1 },
  { text: 'Develop', id: 2 },
  { text: 'Economy', id: 3 },
]

const Content = (({
 ...restProps
}) => {
  const [receiveIdAndDepartment, setReceiveIdAndDepartment] = useState('')
  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  useEffect(() => {
    const fetchReceiveIdAndDepartment = async () => {
      const response = await requestApi.getReceiveIdAndDepartment(currentUser?.accountId)
      setReceiveIdAndDepartment(response)
    }
    fetchReceiveIdAndDepartment()
  }, [])

  console.log(receiveIdAndDepartment);
  return(
  <AppointmentTooltip.Content {...restProps}>
    <Grid container alignItems="center">
      <Grid display='flex' gap='20px' mt='10px' ml='20px' item xs={10}>
        <PersonIcon sx={{color: 'blue'}} /> <Typography>sad</Typography>
      </Grid>
    </Grid>
  </AppointmentTooltip.Content>
  )
});

const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === "multilineTextEditor") {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const LabelComponent = (props) => {
if (props.text === 'More Information') {
    return null
  }
};

const BookRoom = () => {
  
  const [data, setData] = useState(appointments)
  const [resources] = useState([
    {
      fieldName: 'roomId',
      title: 'Location',
      instances: locations
    },
    {
      fieldName: 'departmentId',
      title: 'Department',
      instances: departments
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
        console.log(added.startDate.toISOString('DD/MM/YYYY').split('T')[0]);     
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
      onFieldChange({ customField: nextValue });
    };
  
    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        {...restProps}
      >
        <AppointmentForm.Label
          text="Content"
          type="content"
        />
        <AppointmentForm.TextEditor
          value={appointmentData.customField}
          onValueChange={onCustomFieldChange}
          placeholder="Custom field"
        />
      </AppointmentForm.BasicLayout>
    );
  };
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
        <AppointmentForm booleanEditorComponent={BoolEditor} labelComponent={LabelComponent} textEditorComponent={TextEditor} />
        <GroupingPanel />
        <DragDropProvider />
      </Scheduler>
    </Paper>
  )
}

export default BookRoom
