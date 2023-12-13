import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/Header'
import { BASE_URL } from '../../../services/constraint'
import userApi from '../../../services/userApi'
import axiosClient from '../../../utils/axios-config'
import { formatDateNotTime } from '../../../utils/formatDate'
import DataTableManageLog from './components/DataTable'
const ListAllControlLogByStaff = () => {
  const userId = useSelector((state) => state.auth.login.currentUser.accountId)
  const [allUser, setAllUser] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [info, setInfo] = useState('')
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
  const userName = info?.userName
  useEffect(() => {
    setIsLoading(true)
    const fetchAllUser = async () => {
      const response = await axiosClient.get(`${BASE_URL}/listAllControlLogByStaff`, userId)
      setAllUser(response)
      setIsLoading(false)
    }
    fetchAllUser()
  }, [])

  console.log(allUser[17])
  const columns = [
    {
      field: 'username',
      headerName: 'Username',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 150,
    },
    {
      field: 'name',
      headerName: 'Name',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 250,
      renderCell: (params) => (
        <div style={{ color: 'black' }}>
          {params.row.firstName} {params.row.lastName}
        </div>
      ),
    },
    // {
    //   field: 'createdBy',
    //   headerName: 'Created By',
    //   cellClassName: 'name-column--cell',
    //   headerAlign: 'center',
    //   align: 'center',
    //   width: 250,

    // },
    {
      field: 'hireDate',
      headerName: 'Hire Date',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 235,
      renderCell: (params) => {
        return (
          <Typography color='#000'>
            {formatDateNotTime(params.row.hireDate)}
          </Typography>
        )
      }
    },
    {
      field: 'phone',
      headerName: 'Phone Number',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 150,
    },
    {
      field: 'email',
      headerName: 'Email',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 250,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 120,
    },
    {
      field: 'verifyType',
      headerName: 'Verify Type',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 120,
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
      field: 'detail',
      headerName: 'View',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 250,
      renderCell: (params) => {
        return (
          <Box
            margin="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="4px">
            <Button
              variant='contained'
              onClick={() => navigate(`/list-control-log-by-account/${params.row.username}`)}
            >
              Detail
            </Button>
          </Box>
        )
      }
    },
  ]
  return (
    <>
      <Header title={`SECURITY - ${userName}`} subtitle="List All Control Log" />
      <DataTableManageLog
        rows={allUser}
        columns={columns}
        isLoading={isLoading}
      />

    </>
  )
}

export default ListAllControlLogByStaff
