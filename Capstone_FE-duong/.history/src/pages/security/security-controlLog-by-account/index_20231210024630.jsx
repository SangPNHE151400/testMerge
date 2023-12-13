import { Avatar, Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { getDownloadURL, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import USER from '../../../assets/images/user.jpg'
import Header from '../../../components/Header'
import { storage } from '../../../firebase/config'
import securityApi from '../../../services/securityApi'
import userApi from '../../../services/userApi'
import DataTableManageLog from './components/DataTable'
import ChatTopbar from '../../common/chat/components/ChatTopbar'
const ListAllControlLogByAccount = () => {
  const userId = useSelector((state) => state.auth.login.currentUser.accountId)
  const [allControlLog, setAllControlLog] = useState([])
  const [allUser, setAllUser] = useState([])
  const [info, setInfo] = useState('')
  const { username } = useParams();
  const [userProfileImage, setUserProfileImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  console.log(username);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userApi.getUserInfo2(userId);
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
  }, [userId]);

  // Fetch by controlLogByAccountResponseList
  useEffect(() => {
    setIsLoading(true)
    const fetchAllUser = async () => {
      try {
        const response = await securityApi.getControlListByAccount(username);
        const controlLogs = response.controlLogByAccountResponseList || [];
        setAllControlLog(controlLogs)
        setIsLoading(false)
        console.log(response);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('Log not found!');
          setIsLoading(false)
        } else {
          console.error('Error fetching user info:', error.message);
          setIsLoading(false)
        }
      }

    }
    fetchAllUser()
  }, [username])

  //Fetch by info 

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const response = await securityApi.getControlListByAccount(username);

        setAllUser(response)
        console.log(response);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('Log not found!');

        } else {
          console.error('Error fetching user info:', error.message);
        }
      }

    }
    fetchAllUser()
  }, [username])
  const imgurl = async () => {
    const storageRef = ref(storage, `/${allUser.avatar}`)
    try {
      const url = await getDownloadURL(storageRef)
      setUserProfileImage(url)
    } catch (error) {
      console.error('Error getting download URL:', error)
    }
  }
  if (allUser && allUser.avatar) {
    imgurl()
  }
  const userName = info?.userName
  const test = allUser?.account
  console.log(test);
  console.log(userName);
  // useEffect(() => {
  //   setIsLoading(true)
  //   const fetchAllUser = async () => {
  //     const response = await securityApi.getControlListByAccount(username)
  //     setAllLog(response)
  //     setIsLoading(false)
  //   }
  //   fetchAllUser()
  // }, [username]); 


  //   useEffect(() => {
  //     const getControlLogDetail = async () => {
  //         let res = await securityApi.getControlListByAccount(username);
  //         setAllLog(res);
  //     }
  //     getControlLogDetail();
  // }, [])
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      headerAlign: 'center',
      align: 'center',
      width: 250,
      renderCell: (params) => (
        <div>
          {params.row.firstName} {params.row.lastName}
        </div>
      ),
    },
    {
      field: 'account',
      headerName: 'UserName',
      headerAlign: 'center',
      align: 'center'
      , width: 250,
      flex: 1
    },
    {
      field: 'department',
      headerName: 'Department',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      flex: 1
    },
    {
      field: 'timeRecord',
      headerName: 'Time Record',
      headerAlign: 'center',
      align: 'center',
      width: '180', flex: 1
    },
    {
      field: 'verifyType',
      headerName: 'Verify Type',
      headerAlign: 'center',
      align: 'center',
      width: '180',
      flex: 1,
      renderCell: (params) => {
        let textColor = '';


        if (params.row.verifyType === 'WHITE_LIST') {
          textColor = 'green';
        } else if (params.row.verifyType === 'BLACK_LIST') {
          textColor = 'red';
        }
        else {
          textColor = 'black';
        }


        return (
          <div style={{ color: textColor }}>
            {params.row.verifyType}
          </div>
        );
      },
    },
    {
      field: 'room',
      headerName: 'Room',
      headerAlign: 'center',
      align: 'center',
      width: '120'
      , flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      width: 300,
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
                onClick={() => navigate(`/control-log-detail-security/${params.row.account}/${params.row.controlLogId}`)}>
                Detail
              </Button>
            </Box>
          </Box>
        )
      }
    }

  ];
  return (
    <>
      <ChatTopbar />
      <Box sx={{ marginLeft: '10px' }}>
        <Box pt={5}>
          <Box px={5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6} mb={5}>
                <Card elevation={3} sx={{margin: 'auto'}}>
                  <CardContent sx={{ display: 'flex' }}>
                    <Box>
                      {userProfileImage !== null ? (
                        <Avatar
                          src={userProfileImage}
                          sx={{
                            height: 150,
                            mb: 1,
                            width: 150,
                            ml: 1,
                          }}
                        />
                      ) : (
                        <Avatar
                          src={`${USER}`}
                          sx={{
                            height: 80,
                            mb: 2,
                            width: 80,
                          }}
                        />
                      )}
                    </Box>

                    <Box ml={10} mt={4}>
                      <Typography gutterBottom fontSize="20px" fontWeight="700">
                        Full Name:
                      </Typography>
                      <Typography gutterBottom fontSize="15px" fontWeight="600">
                        Account: <span style={{ color: 'red' }}> {allUser.account} </span>
                      </Typography>
                      <Typography sx={{ textTransform: 'capitalize' }} fontSize="15px" variant="body2">
                        Role: <span style={{ color: 'red' }}>{allUser.role}</span>
                      </Typography>
                    </Box>
                    <Box ml={2} mt={8.6}>
                      <Typography gutterBottom fontSize="15px" fontWeight="600">
                        Hire Date: <span style={{ color: 'red' }}> {allUser.hireDate} </span>
                      </Typography>
                      <Typography sx={{ textTransform: 'capitalize' }} fontSize="15px" variant="body2">
                        Department: <span style={{ color: 'red' }}>{allUser.department}</span>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>


        <DataTableManageLog
          rows={allControlLog}
          columns={columns}
          isLoading={isLoading}
        />
      </Box>
    </>
  )
}

export default ListAllControlLogByAccount
