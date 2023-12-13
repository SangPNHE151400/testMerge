import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material'
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import securityApi from '../../../services/securityApi'
import DataTableControlLog from './component/DataTable'

const ControlLogSecurity = () => {
  const navigate = useNavigate()
  const [month, setMonth] = useState(new Date())
  const [firstTime, setFirstTime] = useState(new Date())
  const [lastTime, setLastTime] = useState(new Date())
  const [listDevice, setListDevice] = useState([])
  const [device, setDevice] = useState('')
  const [listControl, setListControl] = useState([])

  useEffect(() => {
    const listAllDevice = async () => {
      try {
        const response = await securityApi.listAllDevice()
        setListDevice(response)
      } catch (error) {
        console.log('')
      }
    }
    listAllDevice()
  }, [])


  const handleChangeDevice = (e) => {
    setDevice(e.target.value)
  }
  console.log(listControl)
  const handleSearch = async () => {
    if (device !== '') {
      let data = {
        date: format(month, 'yyyy-MM-dd'),
        startTime: format(firstTime, 'HH:mm:ss'),
        endTime: format(lastTime, 'HH:mm:ss'),
        deviceId: device
      }
      console.log(data)
      try {
        const response = await securityApi.getListControlLogByDayAndDevice(data)
        setListControl(response)
      } catch (error) {
        if (error.response.status === 400) {
          toast.error('End time must be greater than start time')
        }
      }
    } else {
      toast.error('Please select device ')
    }
  }

  const columns = [
    {
      headerName: 'Image',
      flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <img
    //         src={`data:image/png;base64, ${params.row?.image}`}
    //         style={{
    //           marginLeft: '100px',
    //           height: 180,
    //           width: 180
    //         }}
    //       />
    //     )
    //   }
    },
    {
      field: 'username',
      headerName: 'Account',
      flex: 1
    },
    {
      headerName: 'Name',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography>
              {params?.row?.firstName} {params?.row?.lastName}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'department',
      headerName: 'Department',
      flex: 1
    },
    {
      field: 'timeRecord',
      headerName: 'Time record',
      flex: 1
    },
    {
      field: 'verifyType',
      headerName: 'Verify Type',
      flex: 1
    },
    {
      field: 'room',
      headerName: 'Room',
      flex: 1
    },

    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        return (
          <Box
            gap={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderRadius="4px"
            width="100%">
            <Box
              gap={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="4px"
              width="100%">
              <Button
                variant="contained"
                sx={{ fontSize: '14px' }}
                onClick={() =>
                  navigate(
                    `/control-log-detail-security/${params.row.username}/${params.row.controlLogId}`
                  )
                }>
                View Log
              </Button>
            </Box>
          </Box>
        )
      }
    }
  ]

  console.log(listControl)

  return (
    <Box m={3}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          maxDate={new Date()}
          // minDate={formatDateNotTime(createdDate?.createdDate)}
          value={month}
          views={['day', 'month', 'year']}
          onChange={(newDate) => setMonth(newDate.toDate())}
          renderInput={(props) => <TextField sx={{ width: '20%' }} {...props} />}
        />
      </LocalizationProvider>

      <Box mt={3} display="flex" gap={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            // ampm={false}
            // minDate={formatDateNotTime(createdDate?.createdDate)}
            value={firstTime}
            views={['hours', 'minutes', 'seconds']}
            onChange={(newTime) => setFirstTime(newTime.toDate())}
            renderInput={(props) => <TextField sx={{ width: '20%' }} {...props} />}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            // ampm={false}
            // minDate={formatDateNotTime(createdDate?.createdDate)}
            value={lastTime}
            views={['hours', 'minutes', 'seconds']}
            onChange={(e) => setLastTime(e.toDate())}
            renderInput={(props) => <TextField sx={{ width: '20%' }} {...props} />}
          />
        </LocalizationProvider>

        {listDevice && (
          <>
            <FormControl sx={{ width: '30%' }}>
              <InputLabel id="demo-simple-select-label">Device</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={device}
                label="Device"
                onChange={(e) => handleChangeDevice(e)}>
                {listDevice.map((item, index) => (
                  <MenuItem key={index} value={item?.deviceId}>
                    {item?.deviceName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        <Button variant="contained" sx={{ width: '10%' }} onClick={(e) => handleSearch(e)}>
          Search
        </Button>
      </Box>
      <Box mt={3}>
        <DataTableControlLog rows={listControl} columns={columns} />
      </Box>
    </Box>
  )
}

export default ControlLogSecurity
