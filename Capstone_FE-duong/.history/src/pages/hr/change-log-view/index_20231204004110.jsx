import { useState } from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  MonthView,
  Toolbar,
  DateNavigator,
  Appointments,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';


const ChangeLogView = () => {
    const [data, setData] = useState(appointments);

    return (
      <Paper>
        <Scheduler data={data}>
          <ViewState defaultCurrentDate="2018-07-27" />
          <MonthView />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <Appointments />
        </Scheduler>
      </Paper>
    );
}

export default ChangeLogView