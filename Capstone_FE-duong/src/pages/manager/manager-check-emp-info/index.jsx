import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography
} from '@mui/material'
import { getDownloadURL, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import USER from '../../../assets/images/user.jpg'
import { storage } from '../../../firebase/config'
import logApi from '../../../services/logApi'
import { formatDateNotTime } from '../../../utils/formatDate'
import DataTableManageUser from './components/DataTable'
import Overview from './components/Overview'
import userApi from '../../../services/userApi'

const CheckEmpProfileByManager = () => {
    const [userProfileImage, setUserProfileImage] = useState('')
    const [info, setInfo] = useState('')
    const navigate = useNavigate()
    const { user_id } = useParams();
    const [empInfo, setempInfo] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await userApi.getUserInfo2(user_id);
                setInfo(response)
                console.log(response);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.error('User not found!');
                } else {
                    console.error('Error fetching user info:', error.message);
                }
            }
        };

        fetchData();
    }, [user_id]);

    const imgurl = async () => {
        const storageRef = ref(storage, `/${info.image}`)
        try {
            const url = await getDownloadURL(storageRef)
            setUserProfileImage(url)
        } catch (error) {
            console.error('Error getting download URL:', error)
        }
    }
    if (info && info.image) {
        imgurl()
    }

    useEffect(() => {
        const fetchAllUserAttendance = async () => {
            setIsLoading(true);
            try {
                let response;
                response = await logApi.getAllEvaluateAcceptedOfEmp(
                    user_id,
                );
                setempInfo(response)
                console.log(response);
            } catch (error) {
                console.error('Error fetching user attendance:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllUserAttendance()
    }, [user_id])



    const [isLoading, setIsLoading] = useState(false)


    const columns = [
        {
            field: 'employeeUserName',
            headerName: 'Account',
            cellClassName: 'name-column--cell',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'name',
            headerName: 'Name',
            cellClassName: 'name-column--cell',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params) => (
                <div style={{ color: 'black' }}>
                    {params.row.employeeFirstName} {params.row.employeeLastName}
                </div>
            ),
        },
        {
            field: 'department',
            headerName: 'Department',
            cellClassName: 'name-column--cell',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params) => (
                <div style={{ color: 'black' }}>
                    {params.row.department.departmentName} 
                </div>
            ),
        },
        {
            field: 'paidDay',
            headerName: 'Paid Day',
            cellClassName: 'name-column--cell',
            headerAlign: 'center',
            align: 'center',
            flex: 1
        },
        {
            field: 'startDate',
            headerName: 'Start Date ',
            cellClassName: 'name-column--cell',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params) => (
                <div style={{ color: 'black' }}>
                    {params.row.month} / {params.row.year}
                </div>
            ),
        },
        {
            field: 'rate',
            headerName: 'Rate',
            cellClassName: 'name-column--cell',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params) => {
                let color;

                if (params.row.rate === 'GOOD') {
                    color = 'green';
                } else if (params.row.rate === 'BAD') {
                    color = 'red';
                } else {
                    color = 'black';
                }

                return <div style={{ color }}>{params.row.rate}</div>;
            },
        },
        {
            field: 'approvedDate',
            headerName: 'Approved Date',
            cellClassName: 'name-column--cell',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params) => (
                <div style={{ color: 'black' }}>
                    {formatDateNotTime(params.row.approvedDate)}
                </div>
            ),
        },
        {
            field: 'detail',
            headerName: 'View',
            cellClassName: 'name-column--cell',
            headerAlign: 'center',
            align: 'center',
            width: 450,
            renderCell: (params) => {
                return (
                    <Box
                        margin="0 auto"
                        p="5px"
                        display="flex"
                        alignItems="center"
                        borderRadius="4px"
                        justifyContent="space-between"
                    >
                        <Button
                            variant='contained'
                            onClick={() => {
                                navigate(`/manager-check-evaluate-report-emp/${params.row.employeeId}/${(params.row.month)}-${(params.row.year)}`)
                            }}
                        >
                            Detail
                        </Button>
                        <div style={{ width: '10px' }}></div>
                        <Button
                            variant='contained'
                            onClick={() => {
                                navigate(`/log-attendance-emp/${params.row.employeeId}/${(params.row.month)}-${(params.row.year)}`)
                            }}
                        >
                            Check Attendance
                        </Button>
                    </Box>
                )
            }
        },

    ];

    return (
        <>
            <Box textAlign="center" bgcolor="#EEF2F6" height="100vh">
                <Box pt={5}>
                    <Box px={5} mt={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6} lg={4}>
                                <Card>
                                    <CardContent sx={{ width: '100%', height: '266px' }} >
                                        <Box
                                            sx={{
                                                alignItems: 'center',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                height: '178px',
                                                width: '100%',
                                            }}>
                                            {userProfileImage !== null ? (
                                                <Avatar
                                                    src={userProfileImage}
                                                    sx={{
                                                        height: 80,
                                                        mb: 2,
                                                        width: 80
                                                    }}
                                                />
                                            ) : (
                                                <Avatar
                                                    src={`${USER}`}
                                                    sx={{
                                                        height: 80,
                                                        mb: 2,
                                                        width: 80
                                                    }}
                                                />
                                            )}
                                            <Typography gutterBottom fontSize="20px" fontWeight="700">
                                                {info?.firstName} {info?.lastName}
                                            </Typography>
                                            <Typography gutterBottom fontSize="15px" fontWeight="600">
                                                Account: <span style={{ color: 'red' }} >  {info?.userName}  </span>
                                            </Typography>
                                            <Typography sx={{ textTransform: 'capitalize' }} fontSize="15px" variant="body2" >
                                                Role: <span style={{ color: 'red' }} >{info.roleName}</span>
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6} lg={8}>
                                <Card>
                                    <Overview userInfo={info} />
                                </Card>
                            </Grid>
                        </Grid>

                    </Box>
                </Box>
                <DataTableManageUser
                    sx={{ marginTop: '20px' }}
                    rows={empInfo}
                    columns={columns}
                    isLoading={isLoading}

                />
                <Box mt={2} mr={500}>
                    <Button
                        variant="contained"
                        onClick={() => navigate(-1)}
                        style={{
                            width: '80px',
                            marginLeft: '10px',
                            fontSize: '12px',
                        }}
                    >
                        Back
                    </Button>
                </Box>
            </Box>

        </>
    )

}

export default CheckEmpProfileByManager
