import { useState, useEffect } from 'react';
import AdapterDayjs from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import GridToolbarContainer from '@mui/x-data-grid-pro/GridToolbarContainer';
import GridToolbarFilterButton from '@mui/x-data-grid-pro/GridToolbarFilterButton';
import GridToolbarExport from '@mui/x-data-grid-pro/GridToolbarExport';
import DataTableCheckAttendance from './DataTableCheckAttendance'; 
import { useSelector } from 'react-redux'; 
import attendanceApi from 'your-attendance-api-library'; 
import { format } from 'date-fns';

export default function CheckAttendance() {
  const currentUser = useSelector((state) => state.auth.login?.currentUser);

  const [isLoading, setIsLoading] = useState(false);
  const [userAttendance, setUserAttendance] = useState('');
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    const fetchAllUserAttendance = async () => {
      setIsLoading(true);
      try {
        const response = await attendanceApi.getAttendanceUser(currentUser?.accountId, format(month, 'MM'));
        setUserAttendance(response);
      } catch (error) {
        console.error('Error fetching user attendance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUserAttendance();
  }, [month, currentUser]);

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box display="flex" gap={1} flex={1}>
            <GridToolbarFilterButton />
            <GridToolbarExport />
          </Box>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={month}
                views={['month', 'year']}
                onChange={(newDate) => setMonth(newDate.toDate())}
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
              />
            </LocalizationProvider>
          </Box>
        </Box>
      </GridToolbarContainer>
    );
  }

  const items = [
    // ... your items
  ];

  const rows = [...items, { id: 'TOTAL', label: 'Total', total: 686.4 }];

  const columns = [
    // ... your columns
  ];

  return (
    <DataTableCheckAttendance
      rows={rows}
      columns={columns}
      CustomToolbar={CustomToolbar}
      isLoading={isLoading}
      userAttendance={userAttendance}
    />
  );
}
