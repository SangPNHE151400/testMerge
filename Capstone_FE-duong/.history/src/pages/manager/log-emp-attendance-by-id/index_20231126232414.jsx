import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import { GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import attendanceApi from '../../../services/attendanceApi';
import overtimeApi from '../../../services/overtimeApi';
import { formatDateNotTime } from '../../../utils/formatDate';
import ChatTopbar from '../../common/chat/components/ChatTopbar';
import DataTableCheckAttendance from './components/DataTable';
import EditEmpLogAttendance from './components/EditModal';
import { useFormik } from 'formik';

export default function LogEmpAttendanceById() {
    const currentUser = useSelector((state) => state.auth.login?.currentUser);
    const formik = useFormik({
        initialValues: {
            content: '',
            type: '',
            manualCheckIn: new Date(),
            manualCheckOut: new Date(),
        }, });
    const [isLoading, setIsLoading] = useState(false);
    const [userAttendance, setUserAttendance] = useState('');
    const [dailyLog, setDailyLog] = useState([]);
    const [month, setMonth] = useState(new Date());
    const [openLateRequest, setOpenLateRequest] = useState(false);
    const [dailyLogModal, setDailyLogModal] = useState({});
    const [createdDate, setCreatedDate] = useState({});
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [hireDate, setHireDate] = useState('');
    const { employee_id } = useParams();
    const [selectedOption, setSelectedOption] = useState('option1');
    const [option2Data, setOption2Data] = useState([]);
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
                    const { username, hireDate } = response;
                    setUserAttendance(response);
                    setDailyLog(response?.dailyLogList);
                    setUserName(username);
                    setHireDate(hireDate);
                } else if (selectedOption === 'option2') {
                    response = await overtimeApi.getOvertimeUser(
                        employee_id,
                        format(month, 'MM'),
                        format(month, 'yyyy')
                    );
                    const option2DataWithId = response?.overTimeLogResponses.map((item, index) => ({
                        ...item,
                        id: index.toString(),
                    })) || [];
                    setOption2Data(option2DataWithId);
                    console.log(option2DataWithId);
                }
            } catch (error) {
                console.error('Error fetching user attendance:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllUserAttendance();
    }, [month, selectedOption, employee_id]);


    useEffect(() => {
        const fetchGetCreatedDate = async () => {
            try {
                const response = await attendanceApi.getCreatedDate(currentUser?.accountId);
                setCreatedDate(response);
            } catch (error) {
                console.error('Error fetching user attendance:', error);
            }
        };

        fetchGetCreatedDate();
    }, [currentUser]);

    const handleOpenLateRequest = (params) => {
        setOpenLateRequest(true);
        setDailyLogModal(params);
    };

    const handleOptionChange = (selectedValue) => {
        setSelectedOption(selectedValue);
    };

    const handleCloseEditLog = () => setOpenLateRequest(false);

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Box display="flex" gap={1} flex={1}>
                        <GridToolbarFilterButton />
                        <GridToolbarExport />
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} width="20%">
                        <Button variant="contained" onClick={() => navigate('/create-evaluate')}>
                            Evaluate
                        </Button>
                        <Select
                            value={selectedOption}
                            onChange={(e) => handleOptionChange(e.target.value)}
                            style={{ flex: 1, marginRight: '5px' }}
                        >
                            <MenuItem value="option1">Daily Log</MenuItem>
                            <MenuItem value="option2">Overtime</MenuItem>
                        </Select>
                    </Box>
                    <Box>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                maxDate={new Date()}
                                minDate={formatDateNotTime(createdDate?.createdDate)}
                                value={month}
                                views={['month', 'year']}
                                onChange={(newDate) => setMonth(newDate.toDate())}
                                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} />}
                                style={{ marginLeft: '10px' }}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>
            </GridToolbarContainer>


        );
    }

    const columnsOption1 = [
        {
            field: 'dateDaily',
            headerName: 'Date',
            width: 280,
            colSpan: ({ row }) => {
                if (row.id === 'TOTAL') {
                    return 3
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
            field: 'lateCheckin',
            headerName: 'Late Check In',
            width: 150,
            valueGetter: ({ row, value }) => {
                if (row.id === 'TOTAL' && userAttendance && userAttendance.totalAttendanceUser) {
                    return `${userAttendance.totalAttendanceUser.lateCheckinTotal}`
                }
                return value === true ? 1 : 0
            }
        },
        {
            field: 'earlyCheckout',
            headerName: 'Early Checkout',
            width: 150,
            valueGetter: ({ row, value }) => {
                if (row.id === 'TOTAL' && userAttendance && userAttendance.totalAttendanceUser) {
                    return `${userAttendance.totalAttendanceUser.earlyCheckoutTotal}`
                }
                return value === true ? 1 : 0
            }
        },
        {
            field: 'permittedLeave',
            headerName: 'Leave',
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
            field: 'action',
            headerName: 'Action',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                let inputDateString = params.row?.dateDaily

                let inputDate = new Date(inputDateString)

                let year = inputDate.getFullYear()
                let month = (inputDate.getMonth() + 1).toString().padStart(2, '0')
                let day = inputDate.getDate().toString().padStart(2, '0')

                let outputDateString = `${year}-${month}-${day}`

                return (
                    <Box
                        gap={2}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderRadius="4px"
                        width="100%"
                    >
                        <Box
                            gap={2}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            borderRadius="4px"
                            width="100%"
                        >
                            {params.row.id !== 'TOTAL' ? (
                                <>
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            navigate(`/attendance-detail/${params.row.dailyId}/${outputDateString}`)
                                        }
                                    >
                                        Detail
                                    </Button>
                                    <Button variant="contained" onClick={() => handleOpenLateRequest(params.row)}>
                                        Edit
                                    </Button>
                                </>
                            ) : null}
                        </Box>
                    </Box>
                );
            }
        }
    ];

    const columnsOption2 = [
        {
            field: 'date',
            headerName: 'Date',
            width: 280
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
            field: 'totalAttendance',
            headerName: 'Total Attendance',
            flex: 1
        },
        {
            field: 'approveDate',
            headerName: 'Approve Date',
            flex: 1
        },
        {
            field: 'dateType',
            headerName: 'Date Type',
            flex: 1
        },
        {
            field: 'totalPaid',
            headerName: 'Total Paid',
            flex: 1
        },
    ];

    const columns = selectedOption === 'option1' ? columnsOption1 : columnsOption2;

    const rows = selectedOption === 'option1'
        ? [...dailyLog, { id: 'TOTAL', label: 'Total', dailyId: '12345' }]
        : [...option2Data];


    return (
        <>
            <Box sx={{ marginLeft: '10px' }}>
                <ChatTopbar />
                <DataTableCheckAttendance
                    rows={rows}
                    columns={columns}
                    CustomToolbar={CustomToolbar}
                    isLoading={isLoading}
                    userName={userName}
                    hireDate={hireDate}
                    getRowId={(row) => row.id}
                />
                <EditEmpLogAttendance
                    handleCloseEditLog={handleCloseEditLog}
                    openEditLog={openLateRequest}
                    dailyLogModal={dailyLogModal}
                    userName={userName}
                    manualCheckIn={formik.values.manualCheckIn}
                    manualCheckOut={formik.values.manualCheckOut}
            
                />
                <Button variant="contained" onClick={() => navigate(-1)} style={{ marginLeft: '4px', marginTop: '-20px' }}>
                    Back
                </Button>
            </Box>
        </>
    );
}