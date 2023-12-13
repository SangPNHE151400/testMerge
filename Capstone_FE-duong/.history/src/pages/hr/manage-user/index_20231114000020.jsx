import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BlockIcon from '@mui/icons-material/Block'
import CheckIcon from '@mui/icons-material/Check'
import EditIcon from '@mui/icons-material/Edit'
import ManIcon from '@mui/icons-material/Man'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import SecurityIcon from '@mui/icons-material/Security'
import { Box, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Header from '../../../components/Header'
import { BASE_URL } from '../../../services/constraint'
import userApi from '../../../services/userApi'
import axiosClient from '../../../utils/axios-config'
import CreateAccountModal from './components/CreateAccountModal'
import DataTableManageUser from './components/DataTable'
import RoleModal from './components/RoleModal'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import formatDate from '../../../utils/formatDate'
const ManageUser = () => {
  const userId = useSelector((state) => state.auth.login.currentUser.accountId)
  const dispatch = useDispatch()
  const [allUser, setAllUser] = useState([])
  const [user, setUser] = useState('')
  const [open, setOpen] = useState(false)
  const [openCreateAccount, setOpenCreateAccount] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const navigate = useNavigate()
  const handleOpen = (data) => {
    setOpen(true)
    setUser(data)
  }
  const handleClose = () => setOpen(false)
  const handleOpenCreateAccount = () => {
    setOpenCreateAccount(true)
  }
  const handleCloseCreateAccount = () => setOpenCreateAccount(false)

  useEffect(() => {
    setIsLoading(true)
    const fetchAllUser = async () => {
      const response = await axiosClient.get(`${BASE_URL}/getAllAccount`, userId)
      setAllUser(response)
      setIsLoading(false)
    }
    fetchAllUser()
  }, [])

  const handleChangeStatus = (user) => {
    Swal.fire({
      title: 'Are you sure to change this status?',
      icon: 'info',
      cancelButtonText: 'Cancel!',
      showCancelButton: true,
      cancelButtonColor: 'red',
      confirmButtonColor: 'green'
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          accountId: user.accountId,
          statusName: user.statusName === 'active' ? 'inactive' : 'active'
        }
        userApi.changeUserStatus(data, dispatch)
        setAllUser((prevUser) =>
          prevUser.map((userInfo) => {
            if (userInfo.accountId === user.accountId) {
              return {
                ...userInfo,
                statusName: user.statusName === 'active' ? 'inactive' : 'active'
              }
            } else {
              return userInfo
            }
          })
        )
      } else {
        navigate('/manage-user')
      }
    })
  }

  console.log(allUser)
  const handleDelete = (user) => {
    Swal.fire({
      title: 'Are you sure to delete this account?',
      icon: 'warning',
      cancelButtonText: 'Cancel!',
      showCancelButton: true,
      cancelButtonColor: 'red',
      confirmButtonColor: 'green'
    }).then((result) => {
      if (result.isConfirmed) {
      let data = {
        username: user.username,
        hrId: currentUser?.accountId
      }
      axiosClient
        .post(`${BASE_URL}/deleteAccount`, data)
        .then(() => {
          toast.success('Account deleted successfully!')
          setAllUser((prevUser) =>
            prevUser.filter((userInfo) => userInfo.accountId !== user.accountId)
          )
        })
        .catch((error) => {
          if (error.response.status === 400) {
            toast.error('Username is null!')
          } else if (error.response.status === 404) {
            toast.error('Username does not exist!')
          } else if (error.response.status === 500) {
            toast.error('Only HR who created this account can delete this account!')
          } else {
            toast.error('An error occurred while deleting the account.')
          }
        })
    }
  })
}

  const columns = [
    {
      field: 'username',
      headerName: 'Username',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'roleName',
      headerName: 'Access Level',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
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
      flex: 1,
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
      flex: 1,
     
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => {
        return (
            <Typography color='#000'>
              {formatDate(params.row.createdDate)}
            </Typography>
        )
      }
    },
    {
      field: 'departmentName',
      headerName: 'Department Name',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            margin="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="4px">
            <IconButton onClick={() => handleOpen(params.row)}>
              <EditIcon sx={{ color: '#00FF00' }} />
            </IconButton>
            {params.row.statusName === 'active' ? (
              <IconButton onClick={() => handleChangeStatus(params.row)}>
                <BlockIcon sx={{ color: '#ff6666' }} />
              </IconButton>
            ) : (
              <IconButton onClick={() => handleChangeStatus(params.row)}>
                <CheckIcon sx={{ color: '#009900' }} />
              </IconButton>
            )}

            <IconButton onClick={() => handleDelete(params.row)}>
              <DeleteIcon sx={{ color: '#2596be' }} />
            </IconButton>
          </Box>
        )
      }
    }
    ,
   
  ]
  return (
    <>
      <Header title="TEAM" subtitle="Managing the team Members" />
      <DataTableManageUser
        rows={allUser}
        columns={columns}
        handleOpenCreateAccount={handleOpenCreateAccount}
        isLoading={isLoading}
      />
      <RoleModal setAllUser={setAllUser} user={user} open={open} handleClose={handleClose} />
      <CreateAccountModal
        setAllUser={setAllUser}
        allUser={allUser}
        openCreateAccount={openCreateAccount}
        handleCloseCreateAccount={handleCloseCreateAccount}
      />
    </>
  )
}

export default ManageUser
