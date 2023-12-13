import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import ManIcon from '@mui/icons-material/Man'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import SecurityIcon from '@mui/icons-material/Security'
import { Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/Header'
import { BASE_URL } from '../../../services/constraint'
import axiosClient from '../../../utils/axios-config'
import formatDate from '../../../utils/formatDate'
import CreateAccountModal from './components/CreateAccountModal'
import DataTableManageUser from './components/DataTable'
import RoleModal from './components/RoleModal'
import userApi from '../../../services/userApi'
const ManageUserByManager = () => {
  const userId = useSelector((state) => state.auth.login.currentUser.accountId)
  const [allUser, setAllUser] = useState([])
  const [open, setOpen] = useState(false)
  const [openCreateAccount, setOpenCreateAccount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [info, setInfo] = useState('')
  const navigate = useNavigate()


  const handleClose = () => setOpen(false)
  const handleOpenCreateAccount = () => {
    setOpenCreateAccount(true)
  }
  const handleCloseCreateAccount = () => setOpenCreateAccount(false)

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
      width:250,
    },
    {
      field: 'name',
      headerName: 'Name',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width:250,
      renderCell: (params) => (
        <div style={{ color: 'black' }}>
          {params.row.firstName} {params.row.lastName}
        </div>
      ),
    },
    {
      field: 'roleName',
      headerName: 'Access Level',
      headerAlign: 'center',
      align: 'center',
      width:250,
      renderCell: (params) => {
        return (
          <Box
            width="80%"
            margin="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor={params.row.roleName === 'admin' ? '#3da58a' : '#2e7c67'}
            borderRadius="4px">
            {params.row.roleName === 'admin' && <AdminPanelSettingsIcon />}
            {params.row.roleName === 'manager' && <ManageAccountsIcon />}
            {params.row.roleName === 'hr' && <ManIcon />}
            {params.row.roleName === 'director' && <AccessibilityNewIcon />}
            {params.row.roleName === 'security' && <SecurityIcon />}
            {params.row.roleName === 'employee' && <ManIcon />}
            <Typography color="#d0d1d5" sx={{ ml: '5px' }}>
              {params.row.roleName}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'statusName',
      headerName: 'Status',
      headerAlign: 'center',
      align: 'center',
      width:250,
      renderCell: (params) => {
        return (
          <Box
            width="80%"
            margin="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor={params.row.statusName === 'active' ? 'green' : 'red'}
            borderRadius="4px">
            {params.row.statusName === 'active' && <AdminPanelSettingsIcon />}
            {params.row.statusName === 'inactive' && <SecurityIcon />}
            <Typography color="#d0d1d5" sx={{ ml: '5px' }}>
              {params.row.statusName}
            </Typography>
          </Box>
        )
      }
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width:150,

    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width:200,
      renderCell: (params) => {
        return (
          <Typography color='#000'>
            {formatDate(params.row.createdDate)}
          </Typography>
        )
      }
    },
    {
      field: 'detail',
      headerName: 'View',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width:150,
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
              onClick={() => navigate(`/check-emp-info-by-manager/${params.row.accountId}`)}
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
     <Header title={`TEAM - ${departmentName}`} subtitle="Managing the team Members" />

      <DataTableManageUser
        rows={allUser}
        columns={columns}
        handleOpenCreateAccount={handleOpenCreateAccount}
        isLoading={isLoading}
        departmentName={departmentName}
      />
      <RoleModal setAllUser={setAllUser}  open={open} handleClose={handleClose} />
      <CreateAccountModal
        setAllUser={setAllUser}
        allUser={allUser}
        openCreateAccount={openCreateAccount}
        handleCloseCreateAccount={handleCloseCreateAccount}
      />
    </>
  )
}

export default ManageUserByManager
