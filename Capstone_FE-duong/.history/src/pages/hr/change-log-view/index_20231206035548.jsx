import { EditingState, ViewState } from '@devexpress/dx-react-scheduler'
import {
  AppointmentForm,
  AppointmentTooltip,
  Appointments,
  DateNavigator,
  MonthView,
  Scheduler,
  TodayButton,
  Toolbar
} from '@devexpress/dx-react-scheduler-material-ui'
import Paper from '@mui/material/Paper'
import moment from 'moment'
import { useEffect, useState } from 'react'
import holidayApi from '../../../services/holidayApi'

const ChangeLogView = () => {
  const [data, setData] = useState([])
  const BoolEditor = () => {
    return null
  }
  
  useEffect(() => {
    const fetchAllHolidays = async () => {
      const res = await holidayApi.getAllHoliday()
      const updatedData = res.map((item) => {
        return {
          id: item.holidayId,
          startDate: item.fromDate,
          endDate: item.toDate,
          title: item.title,
          content: item.content,
          username: item.username
        }
      })
      setData(updatedData)
    }
    fetchAllHolidays()
  }, [])

  console.log(data);

  const DayScaleCell = props => (
    <MonthView.DayScaleCell
      {...props}
      onClick={() => console.log(props.startDate)}
    />
  );
  const DateEditor = ({ ...restProps }) => {
    return <AppointmentForm.DateEditor style={{display: 'flex', gap: '10px'}} {...restProps}></AppointmentForm.DateEditor>
  }

  const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {

    const onCustomFieldChangeContent = (nextValue) => {
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
          onValueChange={onCustomFieldChangeContent}
          placeholder="Write your content"
          type="multilineTextEditor"
        />
      </AppointmentForm.BasicLayout>
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

    const commitChanges = async ({ added }) => {
      const dateStart = moment(added.startDate.toString())
          const timeStart = dateStart.format('HH:mm:ss')
          const dateEnd = moment(added.endDate.toString())
          const timeEnd = dateEnd.format('HH:mm:ss')
  
  
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
    return (
      <Paper>
        <Scheduler data={data} height="auto">
          <ViewState  />
          <EditingState onCommitChanges={commitChanges} />
          <MonthView dayScaleCellComponent={DayScaleCell} />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <Appointments />
          <AppointmentTooltip />
          <AppointmentForm
            readOnly={false}
            booleanEditorComponent={BoolEditor}
            labelComponent={LabelComponent}
            dateEditorComponent={DateEditor}
            textEditorComponent={TextEditor}
            basicLayoutComponent={BasicLayout}
          />
        </Scheduler>
      </Paper>
    )
  }


export default ChangeLogView
