import { Box, Button, Typography } from '@mui/material'
import { getDownloadURL, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/Header'
import { storage } from '../../../firebase/config'
import { BASE_URL } from '../../../services/constraint'
import axiosClient from '../../../utils/axios-config'
import DataTableManageProfile from './components/DataTable'
const ManageProfile = () => {

  const navigate = useNavigate()
  const [usersProfile, setUsersProfile] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const res = await axiosClient.get(`${BASE_URL}/getAllUserInfoPending`)
      setUsersProfile(res)
      setIsLoading(false)
    }
    fetchData()
  }, [usersProfile])



  const imgurl = async () => {
    if (usersProfile.length > 0) {
      try {
        const downloadURLPromises = usersProfile.map((item) => {
          if (item.image === 'unknown') {
            return Promise.resolve(null);
          } else {
            const storageRef = ref(storage, `/${item.image}`);
            return getDownloadURL(storageRef);
          }
        });

        const downloadURLs = await Promise.all(downloadURLPromises)
        const updatedUsersProfile = usersProfile.map((item, index) => ({
          ...item,
          image: downloadURLs[index]
        }))
        setUsersProfile(updatedUsersProfile)
      } catch (error) {
        console.error('Error getting download URLs:', error)
      }
    }
  }

  useEffect(() => {
    imgurl()
  }, [usersProfile])


  console.log(usersProfile);
  const columns = [
    {
      field: 'username',
      headerName: 'Account',
      cellClassName: 'name-column--cell',
      flex :1
    },
    {
      field: 'firstName',
      headerName: 'Name',
      headerAlign: 'left',
      align: 'left',
      flex :1,
      renderCell: (params) => {
        return (
          <Box>
            <Typography>{params.row.firstName} {params.row.lastName} </Typography>
          </Box>
        )
      }
    },
    {
      field: 'roleName',
      headerName: 'Access level',
      flex :1
    },
    {
      field: 'departmentName',
      headerName: 'Department',
      flex :1
    },
    {
      field: 'acceptedBy',
      headerName: 'Last Accepted By',
      flex :1
    },
    {
      field: 'approvedDate',
      headerName: 'Last Approved Date',
      flex :1
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      flex :1,
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
              variant="contained"
              onClick={() => navigate(`/change-log-edit-profile-detail/${params.row.accountId}`)}>
              Detail
            </Button>
          </Box>
        )
      }
    }
  ]
  return (
    <>
      <Header title="TEAM" subtitle="Managing the team Members" />
      <DataTableManageProfile rows={usersProfile} columns={columns} isLoading={isLoading} />
    </>
  )
}

export default ManageProfile
