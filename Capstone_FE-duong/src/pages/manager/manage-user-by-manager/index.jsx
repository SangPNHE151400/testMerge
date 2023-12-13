import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/Header'
import { BASE_URL } from '../../../services/constraint'
import userApi from '../../../services/userApi'
import axiosClient from '../../../utils/axios-config'
import formatDate from '../../../utils/formatDate'
import DataTableManageUser from './components/DataTable'
import RoleModal from './components/RoleModal'
const ManageUserByManager = () => {
  const userId = useSelector((state) => state.auth.login.currentUser.accountId)
  const [allUser, setAllUser] = useState([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [info, setInfo] = useState('')
  const navigate = useNavigate()
  const handleClose = () => setOpen(false)

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
  const departmentName = info?.departmentName
  useEffect(() => {
    setIsLoading(true)
    const fetchAllUser = async () => {
      const response = await axiosClient.get(`${BASE_URL}/getAllAccount`, userId)
      setAllUser(response)
      setIsLoading(false)
    }
    fetchAllUser()
  }, [])

  console.log(info.departmentId)
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
      field: 'createdDate',
      headerName: 'Create Date',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 235,
      renderCell: (params) => {
        return (
          <Typography color='#000'>
            {formatDate(params.row.createdDate)}
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
              onClick={() => navigate(`/check-emp-info-by-manager/${params.row.accountId}`)}>
              Detail
            </Button>
          </Box>
        )
      }
    },
  ]
  return (
    <>
      <Header title={`TEAM - ${departmentName}`} subtitle="Managing the team Members" />

      <DataTableManageUser
        rows={allUser}
        columns={columns}
        isLoading={isLoading}
        departmentName={departmentName}
      />
      <RoleModal setAllUser={setAllUser} open={open} handleClose={handleClose} />
    </>
  )
}

export default ManageUserByManager
