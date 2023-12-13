import {
    Box,
    Button,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import userApi from '../../../services/userApi';
import logApi from '../../../services/logApi';
import DataTableListChangeLog from './component/DataTable';
import formatDate from '../../../utils/formatDate';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import requestApi from '../../../services/requestApi';

const EvaluateManagement = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [month, setMonth] = useState(new Date());
    const [listLog, setListLog] = useState([]);
    const [listEmployees, setListEmployees] = useState([]);
    const [listmanager, setListmanager] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [getAllManagerDepartment, setGetAllManagerDepartment] = useState([])
    const navigate = useNavigate()
    const userInfo = useAuth();

    useEffect(() => {
        const getListEmpByDepartment = async () => {
            try {
                if (!userInfo || !userInfo.departmentId) {
                    return;
                }
                const response = await userApi.getAllEmployeeByDepartmentId(userInfo.departmentId);
                setListEmployees(response || []);
                console.log(listEmployees);
            } catch (error) {
                console.error('Error fetching employee list:', error);
            }

        };

        getListEmpByDepartment();
    }, [userInfo?.departmentId]);



    useEffect(() => {
        const fetchAllMDepartment = async () => {
            const response = await requestApi.getAllManagerDepartment()
            setGetAllManagerDepartment(response)
        }
        fetchAllMDepartment()
    }, [])



    const getManagerByDepartment = async () => {
        try {
            if (!selectedDepartment) {
                console.error('Selected department is missing.');
                return;
            }
            const response = await userApi.getManagerByDepartment(selectedDepartment);
            setListmanager(response || []);
            console.log(response);
        } catch (error) {
            console.error('Error fetching Manager:', error);
        }
    };

    const [showManagerInfo, setShowManagerInfo] = useState(false);
    const handleSearchLog = async () => {
        setIsLoading(true);
        try {
            if (!userInfo || !userInfo.departmentId) {
                console.error('User information or departmentId is missing.');
                return;
            }
            const data = {
                departmentId: selectedDepartment,
                month: format(month, 'MM'),
                year: format(month, 'yyyy'),
            };
            const response = await logApi.getEvaluateOfDepartment(data.departmentId, data.month, data.year);

            if (response.length === 0) {
                toast.error(`No logs found for the department in ${format(month, 'MMMM yyyy')}`);


            }
            getManagerByDepartment();
            setShowManagerInfo(true);
            setListLog(response);
            console.log(response);
            console.log(data.departmentId);
            console.log(data.month);
            console.log(data.year);

        } catch (error) {
            console.error('Error fetching department evaluation:', error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        console.log('Is Loading:', isLoading);
        console.log('List Log:', listLog);
    }, [isLoading, listLog]);

    const handleDetailClick = (employeeId) => {
        navigate(`/view-attendence-evaluate-report-emp/${employeeId}/${format(month, 'yyyy-MM-dd')}`);
    };


    const columns = [
        {
            field: 'employeeUserName',
            headerName: 'Account',
            width: 150,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 180,
            renderCell: (params) => {
                return (
                    <Box
                        margin="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        borderRadius="4px"
                    >
                        <Typography>
                            {params.row.firstNameEmp} {params.row.lastNameEmp}
                        </Typography>
                    </Box>
                )
            }
        },
        {
            field: 'totalAttendance',
            headerName: 'Attendance(h)',
            width: 150,
        },
        {
            field: 'workingDay',
            headerName: 'Working Day(day)',
            width: 180,
        },
        {
            field: 'violate',
            headerName: 'Violate(s)',
            width: 150,
        },
        {
            field: 'createdDate',
            headerName: 'Create Date',
            width: 180,
            renderCell: (params) => {
                if (params.row.approvedDate !== null || params.row.createdDate !== "1970-01-01 08:00:00") {
                    return <Box>{formatDate(params.row.createdDate)}</Box>;
                } else {
                    return <Box></Box>;
                }
            },
        },
        {
            field: 'updateDate',
            headerName: 'Update Date',
            width: 180,
            renderCell: (params) => {
                if (params.row.approvedDate !== null || params.row.updateDate !== "1970-01-01 08:00:00") {
                    return <Box>{formatDate(params.row.updateDate,)}</Box>;
                } else {
                    return <Box></Box>;
                }
            },
        },
        {
            field: 'evaluateEnum',
            headerName: 'Rate',
            width: 150,
            renderCell: (params) => {
                const evaluateEnum = params.row.evaluateEnum;
                let textColor = '';
                let displayText = '';

                switch (evaluateEnum) {
                    case 'BAD':
                        textColor = 'red';
                        displayText = 'BAD';
                        break;
                    case 'GOOD':
                        textColor = 'green';
                        displayText = 'GOOD';
                        break;
                    case 'NORMAL':
                        textColor = '#00BFFF';
                        displayText = 'NORMAL';
                        break;
                    case null:
                        textColor = 'black';
                        displayText = 'unrate';
                }

                return (
                    <Typography style={{ color: textColor }}>
                        {displayText}
                    </Typography>
                );
            },
        },
        {
            field: 'approvedDate',
            headerName: 'Approve Date',
            width: 180,
            renderCell: (params) => {
                if (params.row.approvedDate !== null || params.row.approvedDate === "1970-01-01 08:00:00") {
                    return <Box>{formatDate(params.row.approvedDate)}</Box>;
                } else {
                    return <Box></Box>;
                }
            },
        },
        {
            field: 'acceptedHrUserName',
            headerName: 'Accepted By',
            width: 150,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                if (params.row.approvedDate !== null || params.row.approvedDate === "1970-01-01 08:00:00") {
                    if (params.row.status === true) {
                        return <Typography style={{ color: 'green' }}>Accepted</Typography>;
                    } else if (params.row.status === false) {
                        return <Typography style={{ color: 'red' }}>Rejected</Typography>;
                    }
                } else {
                    return <Typography></Typography>;
                }
            },
        },
        {
            field: 'action',
            headerName: 'Action',
            headerAlign: 'center',
            align: 'center',
            width: 200,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const buttonStyle = {
                    width: '80px',
                    marginLeft: '10px',
                    fontSize: '12px',
                };
                return (
                    <>
                        <Button variant="contained" onClick={() => handleDetailClick(params.row.employeeId)} style={buttonStyle}>
                            Detail
                        </Button>
                        <Button variant="contained" onClick={() => navigate(`/view-log-attendance/${params.row.employeeId}/${format(month, 'yyyy-MM-dd')}`)} style={{ ...buttonStyle }}>
                            View Log
                        </Button>
                    </>
                )


            }
        }

    ];
    return (
        <>
            <Box display="flex" alignItems="center" gap={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        maxDate={new Date()}
                        value={month}
                        views={['month', 'year']}
                        onChange={(newDate) => setMonth(newDate.toDate())}
                        renderInput={(props) => <TextField sx={{ width: '20%' }} {...props} />}
                    />
                </LocalizationProvider>
                <Select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    displayEmpty
                    sx={{ width: '20%', marginRight: '16px' }}
                >
                    {getAllManagerDepartment.map((department) => (
                        <MenuItem key={department.departmentId} value={department.departmentId}>
                            {department.departmentName}
                        </MenuItem>
                    ))}
                </Select>
                <Box>
                    <Button variant="outlined" onClick={handleSearchLog}>
                        Search
                    </Button>
                </Box>
            </Box>
            {listLog.length > 0 && listLog[0].department && listLog[0].department.departmentName && (
                <Box mt={3} style={{ marginTop: '20px' }}>

                    <Typography variant="h6">
                        <span>Department: </span>
                        <span style={{ color: 'red' }}>{listLog[0].department.departmentName}</span>
                    </Typography>

                    {showManagerInfo && listmanager.length > 0 && (
                        <div style={{ display: 'flex', gap: '50px' }}>
                            <Typography variant="h6" style={{ marginTop: '20px' }}>
                                <span>Manager Name: </span>
                                <span style={{ color: '#32CD32' }}>{listmanager.map(manager => `${manager.firstName} ${manager.lastName}`).join(', ')}</span>
                            </Typography>
                            <Typography variant="h6" style={{ marginTop: '20px' }}>
                                <span>Manager Account: </span>
                                <span style={{ color: '#32CD32' }}>{listmanager.map(manager => `${manager.username} `)}</span>
                            </Typography>
                        </div>
                    )}
                </Box>
            )}

            {listLog && listLog.length !== 0 ? (
                <>
                    <Box mt={3}>
                        <DataTableListChangeLog rows={listLog} columns={columns} isLoading={isLoading} />
                    </Box>
                </>
            ) : (
                <></>
            )}
        </>
    );
};

export default EvaluateManagement;
