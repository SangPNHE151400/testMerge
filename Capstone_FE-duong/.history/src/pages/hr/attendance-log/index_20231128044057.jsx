import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import attendanceApi from "../../../services/attendanceApi";
import overtimeApi from "../../../services/overtimeApi";
import ChatTopbar from "../../common/chat/components/ChatTopbar";
import AttendanceTable from "./component/DataTable";



const ViewLogAttendance = () => {
    const currentUser = useSelector((state) => state.auth.login?.currentUser)
    console.log(currentUser);
    const { employee_id, date } = useParams();
    console.log(employee_id);
    console.log(date);
    const [loading, setIsLoading] = useState(false);
    const [month, setMonth] = useState(date);
    const [userAttendance, setUserAttendance] = useState('')
    const [dailyLog, setDailyLog] = useState([])
    const [status, setStatus] = useState(0)
    const [selectedOption, setSelectedOption] = useState('option1');
    const [overTimeData, setOverTimeDate] = useState([])

    const navigate = useNavigate()


    useEffect(() => {
        const fetchAllUserAttendance = async () => {
            setIsLoading(true);
            try {
                let response;
                response = await attendanceApi.getAttendanceUser(
                    employee_id,
                    date.split('-')[1],
                    date.split('-')[0]
                );
                setUserAttendance(response)
                console.log(response);
                setDailyLog(response?.dailyLogList)
            } catch (error) {
                console.error('Error fetching user attendance:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllUserAttendance()
    }, [])

    useEffect(() => {
        const fetchAllUserAttendance = async () => {
            setIsLoading(true);
            try {
                let response;
                if (selectedOption === 'option1') {
                    response = await attendanceApi.getAttendanceUser(
                        employee_id,
                        format(month, 'MM'),
                        format(month, 'yyyy')
                    );
                    setUserAttendance(response)
                    console.log(response);
                    setDailyLog(response?.dailyLogList)
                } else if (selectedOption === 'option2') {
                    if (month == date) {
                        response = await overtimeApi.getOvertimeUser(
                            employee_id,
                            date.split('-')[1],
                            date.split('-')[0]
                        );
                        console.log(response);
                        setOverTimeDate(response?.overTimeLogResponses)
                    } else {
                        response = await overtimeApi.getOvertimeUser(
                            employee_id,
                            format(month, 'MM'),
                            format(month, 'yyyy')
                        );
                        console.log(response);
                        setOverTimeDate(response?.overTimeLogResponses)
                    }
                }
            } catch (error) {
                console.error('Error fetching user attendance:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllUserAttendance()
    }, [selectedOption, month])

    const handleOptionChange = (selectedValue) => {
        setSelectedOption(selectedValue);
    };

    const columnOverTime = [
        {
            field: 'approveDate',
            headerName: 'Approve Date',
            width: 280
        },
        {
            field: 'checkin',
            headerName: 'Check In',
            width: 170
        },
        {
            field: 'checkout',
            headerName: 'Check Out',
            width: 150
        },
        {
            field: 'dateType',
            headerName: 'Date Type',
            width: 150
        },
        {
            field: 'systemCheckIn',
            headerName: 'System Check In',
            width: 150,
        },
        {
            field: 'systemCheckOut',
            headerName: 'System Check Out',
            width: 150,
        },
        {
            field: 'totalAttendance',
            headerName: 'Total Attendance',
            width: 150,

        },
        {
            field: 'totalPaid',
            headerName: 'Total Paid',
            width: 100,
        },
     
    ]

    const rowDaily = [...dailyLog, { id: 'TOTAL', label: 'Total', dailyId: '12345' }]

    const columnDaily = [
        {
            field: 'dateDaily',
            headerName: 'Date',
            width: 280,
            colSpan: ({ row }) => {
                if (row.id === 'TOTAL') {
                    return 5
                }
                return undefined
            },
            valueGetter: ({ value, row }) => {
                if (row.id === 'TOTAL') {
                    return row.label
                }
                return value
            }
        },
        {
            field: 'checkin',
            headerName: 'Check In',
            width: 100
        },
        {
            field: 'checkout',
            headerName: 'Check out',
            width: 100
        },
        {
            field: 'systemCheckIn',
            headerName: 'System Check In',
            width: 100
        },
        {
            field: 'systemCheckOut',
            headerName: 'System Check Out',
            width: 100
        },
        {
            field: 'totalAttendance',
            headerName: 'Total Attendance',
            width: 150,
            valueGetter: ({ row, value }) => {
                if (row.id === 'TOTAL') {
                    const totalAttendance = dailyLog.reduce((total, item) => total + item.totalAttendance, 0)
                    return `${totalAttendance.toFixed(2)}`
                }
                return value
            }
        },
        {
            field: 'morningTotal',
            headerName: 'Total Morning',
            width: 150,
            valueGetter: ({ row, value }) => {
                if (row.id === 'TOTAL') {
                    const morningTotal = dailyLog.reduce((total, item) => total + item.morningTotal, 0)
                    return `${morningTotal.toFixed(2)}`
                }
                return value
            }
        },

        {
            field: 'afternoonTotal',
            headerName: 'Total Afternoon',
            width: 150,
            valueGetter: ({ row, value }) => {
                if (row.id === 'TOTAL') {
                    const afternoonTotal = dailyLog.reduce((total, item) => total + item.afternoonTotal, 0)
                    return `${afternoonTotal.toFixed(2)}`
                }
                return value
            }
        },
        {
            field: 'permittedLeave',
            headerName: 'Permitted Leave',
            width: 150,
            valueGetter: ({ row, value }) => {
                if (row.id === 'TOTAL') {
                    const permittedLeave = dailyLog.reduce((total, item) => total + item.permittedLeave, 0)
                    return `${permittedLeave}`
                }
                return value
            }
        },
        {
            field: 'nonPermittedLeave',
            headerName: 'Non Permitted Leave',
            width: 200,
            valueGetter: ({ row, value }) => {
                if (row.id === 'TOTAL') {
                    const nonPermittedLeave = dailyLog.reduce(
                        (total, item) => total + item.nonPermittedLeave,
                        0
                    )
                    return `${nonPermittedLeave}`
                }
                return value
            }
        },
        {
            field: 'violate',
            headerName: 'Violate',
            width: 150,
            valueGetter: ({ row, value }) => {
                if (row.id === 'TOTAL' && userAttendance && userAttendance.totalAttendanceUser) {
                    return `${userAttendance.totalAttendanceUser.violateTotal}`
                }
                return value === true ? 1 : 0
            }
        },
        {
            field: 'outsideWork',
            headerName: 'Outside Work',
            width: 150,
            valueGetter: ({ row, value }) => {
                if (row.id === 'TOTAL') {
                    const outsideWork = dailyLog.reduce((total, item) => total + item.outsideWork, 0)
                    return `${outsideWork}`
                }
                return value
            }
        },
        {
            field: 'paidDay',
            headerName: 'Paid Day',
            width: 120,
            valueGetter: ({ row, value }) => {
                if (row.id === 'TOTAL') {
                    const paidDay = dailyLog.reduce((total, item) => total + item.paidDay, 0)
                    return `${paidDay.toFixed(2)}`
                }
                return value
            }
        },
        {
            field: '',
            headerName: 'Action',
            width: 120,
            renderCell: (params) => {
                let inputDateString = params.row?.dateDaily

                let inputDate = new Date(inputDateString)

                let year = inputDate.getFullYear()
                let month = (inputDate.getMonth() + 1).toString().padStart(2, '0')
                let day = inputDate.getDate().toString().padStart(2, '0')

                let outputDateString = `${year}-${month}-${day}`

                console.log(params.row);
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
                                onClick={() => navigate(`/attendance-log-detail-hr/${employee_id}/${outputDateString}`)}>
                                Detail
                            </Button>

                        </Box>
                    </Box>
                )
            }
        },

    ]

    return (
        <Box>
            <ChatTopbar />
            <Box sx={{ padding: '20px' }}>
                <Box sx={{ mb: '20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography>Account</Typography>
                            <TextField
                                sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                                InputProps={{ readOnly: true }}
                                value={userAttendance?.username}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography>Hire Date</Typography>
                            <TextField
                                sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                                value={userAttendance?.date}
                                InputProps={{ readOnly: true }}

                            />
                        </Grid>
                        <Grid item xs={6} >
                            <Typography>Department</Typography>
                            <TextField
                                sx={{ width: '100%', backgroundColor: '#f0f0f0' }}
                                InputProps={{ readOnly: true }}
                                value={userAttendance?.department}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box mt={2} display='flex' gap={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            maxDate={new Date()}
                            value={month}
                            views={['month', 'year']}
                            onChange={(newDate) => setMonth(newDate.toDate())}
                            renderInput={(props) => <TextField sx={{ width: '20%' }} {...props} />}
                        />

                    </LocalizationProvider>
                    <Box>
                        <Select
                            value={selectedOption}
                            onChange={(e) => handleOptionChange(e.target.value)}
                            style={{ flex: 1, marginRight: '5px' }}
                        >
                            <MenuItem value="option1">Daily Log</MenuItem>
                            <MenuItem value="option2">Overtime</MenuItem>
                        </Select>
                    </Box>

                </Box>

                {selectedOption == "option1" && (<>
                    <Box mt={2}>
                        <AttendanceTable
                            rows={rowDaily}
                            columns={columnDaily}
                            isLoading={loading}
                        />
                    </Box>
                </>)}
                {selectedOption == "option2" && (<>
                    <Box mt={2}>
                        <AttendanceTable
                            rows={overTimeData}
                            columns={columnOverTime}
                            isLoading={loading} />
                    </Box>
                </>)}




                <Box display='flex' justifyContent='space-between' mt={2}>
                    <Button variant='contained' onClick={() => navigate(-1)}>Back</Button>
                </Box>
            </Box>

        </Box>
    )
}

export default ViewLogAttendance
