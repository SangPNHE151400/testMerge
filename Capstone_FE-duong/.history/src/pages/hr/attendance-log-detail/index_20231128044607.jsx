import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import attendanceApi from '../../../services/attendanceApi'
import ChatTopbar from '../../common/chat/components/ChatTopbar'
import ChangeLogTable from './component/DataTable'

const AttendanceLogDetailHR = () => {
    const navigate = useNavigate()
    const { employee_id, date } = useParams()
    console.log(employee_id);
    console.log(date);
    const [isLoading, setIsLoading] = useState(false)
    const [controlLog, setControlLog] = useState([])
    const [changLogList, setChangLogList] = useState([])
    const [userAttendanceDetail, setUserAttendanceDetail] = useState({})

    useEffect(() => {
        const getChangeLogByEmployeeAndMonth = async () => {
            setIsLoading(true)
            let res = await attendanceApi.getAttendanceUserDetail(employee_id, date)
            setUserAttendanceDetail(res)
            setControlLog(res.controlLogResponse)
            setIsLoading(false)
        }
     
        getChangeLogByEmployeeAndMonth()
    }, [])

    useEffect(() => {
        const getChangeLogsInDays = async () => {
            setIsLoading(true)
            let res = await attendanceApi.getChangeLogsInDay(employee_id, date)
            setChangLogList(res)
            setIsLoading(false)
        }
        getChangeLogsInDays()
    }, [])

    console.log(userAttendanceDetail);
    console.log(changLogList);

    const columns = [
        {
            field: 'createdDate',
            headerName: 'Created Date',
            width: 280
        },
        {
            field: 'Attendance',
            headerName: 'Attendance',
            width: 170,
            renderCell: (params) => {
                return (
                   <>
                   <Typography>{params.row.checkin== null && params.row.checkout == null ?0:1}</Typography>
                   </>
                )
            }
        },
        {
            field: 'violate',
            headerName: 'Violate',
            width: 150,
            renderCell: (params) => {
                
                return (
                   <>
                   <Typography>{params.row.violate?1:0}</Typography>
                   </>
                )
            }
        },
        {
            field: 'outsideWork',
            headerName: 'Outside Work',
            width: 150,
            renderCell: (params) => {
                
                return (
                   <>
                   <Typography>{params.row.outsideWork == -1 ?0:1}</Typography>
                   </>
                )
            }
        },
        {
            field: '',
            headerName: 'Action',
            width: 170,
            renderCell: (params) => {
                const buttonStyle = {
                    width: '120px',
                    fontSize: '15px',
                };
                return (
                    <>
                        <Button variant="contained" onClick={() => navigate(`/change-log-detail-hr/${employee_id}/${params.row.date}`)} style={buttonStyle}>
                            View Detail
                        </Button>
                    </>
                )
            }
        },
    ]
    return (
        <>
            {userAttendanceDetail && (
                <>
                    <ChatTopbar />
                    <Box display="flex">
                        <Box flex="1.8">
                            <Paper sx={{ margin: '25px 0px 0px 40px', p: '15px' }} elevation={4}>
                                <Typography fontWeight="700" fontSize="25px">
                                    Information{' '}
                                </Typography>
                                <Box display="flex" marginTop="10px">
                                    <Box flex="1" borderRight="1px solid #999">
                                        <Typography mb={2}>Employee </Typography>
                                        <Typography mb={2}>Account </Typography>
                                        <Typography mb={2}>Department </Typography>
                                    </Box>
                                    <Box flex="2" marginLeft="10px">
                                        <Typography mb={2}>{userAttendanceDetail?.name}</Typography>
                                        <Typography mb={2}>{userAttendanceDetail?.username} </Typography>
                                        <Typography mb={2}>{userAttendanceDetail?.departmentName} </Typography>
                                    </Box>
                                </Box>
                            </Paper>

                            {isLoading ? (
                                <Paper sx={{ padding: 2, m: 2 }} elevation={4}>
                                    <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                                        <CircularProgress />
                                    </Box>
                                </Paper>
                            ) : (
                                <Paper sx={{ margin: '50px 0px 0px 40px', p: '15px' }} elevation={4}>
                                    <Typography fontWeight="bold" fontSize="25px">
                                        Control Log{' '}
                                    </Typography>
                                    <Box sx={{ height: '300px', overflowY: 'auto' }}>
                                        <Box display="flex" marginTop="15px" flexDirection="column">
                                            {controlLog.length != 0 ? (
                                                <>
                                                    {controlLog.map((item) => (
                                                        <>
                                                            <Box display="flex" justifyContent="space-between" width="100%">
                                                                <Box>
                                                                    <Typography marginLeft="15px">{item?.username}</Typography>
                                                                </Box>
                                                                <Box height="30px">
                                                                    <Typography marginLeft="15px">{item?.log}</Typography>
                                                                </Box>
                                                            </Box>
                                                            <Divider sx={{ mb: 2 }} />
                                                        </>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    <Box display="flex" justifyContent="space-between" width="100%">
                                                        <Typography marginLeft="15px">No Control Log</Typography>
                                                    </Box>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                </Paper>
                            )}

                            <Box sx={{ margin: '20px 0px 0px 40px' }}>
                                <Button variant="contained"  onClick={() => navigate(-1)}>
                                    Back
                                </Button>
                            </Box>
                        </Box>

                        <Box flex="3">
                            <Box marginRight="30px">
                                <Paper sx={{ margin: '25px 0px 0px 40px', p: '15px' }} elevation={4}>
                                    <Typography fontWeight="700" fontSize="25px">
                                        Working Details{' '}
                                    </Typography>
                                    <Box display="flex" marginTop="10px">
                                        <Box flex="1" gap={3} borderRight="1px solid #999">
                                            <Typography mb={1}>Date </Typography>
                                            <Typography mb={1}>Check-In </Typography>
                                            <Typography mb={1}>Check-out</Typography>
                                            <Typography mb={1}>Total Attendance</Typography>
                                            <Typography mb={1}>Total Morning</Typography>
                                            <Typography mb={1}>Total Afternoon</Typography>
                                            <Typography mb={1}>Working Day</Typography>
                                        </Box>
                                        <Box flex="3" ml={2}>
                                            <Typography mb={1}> {userAttendanceDetail?.dateDaily} </Typography>
                                            <Typography mb={1}>{userAttendanceDetail?.checkin} </Typography>
                                            <Typography mb={1}>{userAttendanceDetail?.checkout} </Typography>
                                            <Typography mb={1}>{userAttendanceDetail?.totalAttendance} </Typography>
                                            <Typography mb={1}>{userAttendanceDetail?.morningTotal} </Typography>
                                            <Typography mb={1}>{userAttendanceDetail?.afternoonTotal} </Typography>
                                            <Typography mb={1}>{userAttendanceDetail?.outsideWork} </Typography>
                                        </Box>
                                    </Box>
                                </Paper>


                                <Paper sx={{ margin: '28px 0px 0px 40px', p: '15px' }} elevation={4}>
                                    <Typography fontWeight="700" fontSize="25px" color='red'>
                                        Change Log{' '}
                                    </Typography>
                                    <Box>
                                        <ChangeLogTable
                                            rows={changLogList}
                                            columns={columns}
                                            isLoading={isLoading}
                                        />
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </>
    )
}

export default AttendanceLogDetailHR
