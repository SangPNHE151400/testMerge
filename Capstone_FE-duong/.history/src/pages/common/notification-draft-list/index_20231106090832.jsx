import MoreVertIcon from '@mui/icons-material/MoreVert'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import { Box, Button, Checkbox, IconButton } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/Header'
import { BASE_URL } from '../../../services/constraint'
import axiosClient from '../../../utils/axios-config'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { format } from 'date-fns'
import DataTableDraft from './components/DataTableDraft'
import notificationApi from '../../../services/notificationApi'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
const NotificationDraftList = (props) => {
  const { row } = props
  const userId = useSelector((state) => state.auth.login.currentUser.accountId)
  const dispatch = useDispatch()
  const [allNoti, setAllNoti] = useState([])
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
  const options = ['Delete', 'Edit']
  const ITEM_HEIGHT = 58
  const [anchorEl, setAnchorEl] = React.useState(null)
  const openMenu = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose2 = () => {
    setAnchorEl(null)
  }
  const handleClose = () => setOpen(false)
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

  const handleDelete = (user) => {
    Swal.fire({
      title: 'Are you sure to delete this notification?',
      icon: 'warning',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      cancelButtonColor: 'red',
      confirmButtonColor: 'green'
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          notificationId: user.notificationId,
          userId: userId
        }

        axiosClient
          .post(`${BASE_URL}/deleteNotification`, data)
          .then(() => {
            const updatedNoti = allNoti.filter(
              (item) => item.notificationId !== user.notificationId
            )
            setAllNoti(updatedNoti)
          })
          .catch((error) => {
            if (error.response.status === 400) {
              toast.error('Notification is null!')
            } else if (error.response.status === 404) {
              toast.error('Notification does not exist!')
            } else if (error.response.status === 500) {
              toast.error('Unable to delete the notification!')
            } else if (error.response.status === 409) {
              toast.error('Notification have been upload,cant delete')
            } else {
              toast.error('???')
            }
          })
      }
    })
  }

  useEffect(() => {
    setIsLoading(true)
    const fetchAllNoti = async () => {
      const response = await axiosClient.get(`${BASE_URL}/getListDraftNotification`, {
        params: {
          userId: userId
        }
      })
      setAllNoti(response)
      setIsLoading(false)
      console.log(userId)
    }
    fetchAllNoti()
  }, [])

  console.log(allNoti)
  const handelSetPersonalPriority = async (notification) => {
    if (notification.personalPriority === false && !notification.personalPriority) {
      // Đang ở trạng thái `false`, thực hiện API để đặt thành `true`
      let data = {
        notificationId: notification.notificationId,
        userId: userId
      }
      await notificationApi.setPersonalPriority(data)
      const updatedAllNoti = allNoti.map((item) => {
        if (item.notificationId === notification.notificationId) {
          return { ...item, personalPriority: true }
        }
        return item
      })
      setAllNoti(updatedAllNoti)
    } else if (notification.personalPriority === true) {
      // Đang ở trạng thái `true`, thực hiện API để đặt thành `false`
      let data = {
        notificationId: notification.notificationId,
        userId: userId
      }
      await notificationApi.unSetPersonalPriority(data)
      const updatedAllNoti = allNoti.map((item) => {
        if (item.notificationId === notification.notificationId) {
          return { ...item, personalPriority: false }
        }
        return item
      })
      setAllNoti(updatedAllNoti)
    }
  }
  const columns = [
    {
      field: 'personalPriority',
      headerName: '',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 60,
      renderCell: (params) => {
        return (
          <Box
            margin="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            borderRadius="4px">
            <div>
              <Checkbox
                {...label}
                icon={
                  params.row.personalPriority ? (
                    <StarIcon color="warning" />
                  ) : (
                    <StarBorderIcon color="warning" />
                  )
                }
                checkedIcon={
                  params.row.personalPriority ? (
                    <StarIcon color="warning" />
                  ) : (
                    <StarBorderIcon color="warning" />
                  )
                }
                onChange={() => handelSetPersonalPriority(params.row)}
                checked={params.row.personalPriority}
              />
            </div>
          </Box>
        )
      }
    },

    {
      field: 'notificationStatus',
      headerName: '',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      flex: 1,
      renderCell: (params) => (
        <Box
          margin="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="4px"
          color="#DC143C">
          <div>{params.row.notificationStatus}</div>
        </Box>
      )
    },
    {
      field: 'title',
      headerName: 'Title',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      flex: 1
    },
    {
      field: 'content',
      headerName: 'Content',
      headerAlign: 'center',
      align: 'center',
      width: 300,
      flex: 1
    },
    {
      field: 'imageFileName',
      headerName: '',
      headerAlign: 'center',
      align: 'center',
      width: 250,
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => {
        if (params.row.notificationFiles && params.row.notificationFiles.length > 0) {
          return 'There are attached files'
        } else if (params.row.notificationImages && params.row.notificationImages.length > 0) {
          return 'There are attached files'
        } else {
          return ''
        }
      }
    },
    {
      field: 'uploadDate',
      headerName: 'Date',
      cellClassName: 'name-column--cell',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      width: 300,
      renderCell: (params) => (
        <Box
          margin="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="4px"
          color="#000">
          <div>{format(new Date(params.row.uploadDate), 'yyyy/MM/dd HH:mm:ss')}</div>
        </Box>
      )
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'center',
      align: 'center',
      width: 40,
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => {
        const handleDetailClick = () => {
          navigate(`/notification-detail/${params.row.notificationId}/${params.row.creatorId}`)
        }

        const handleEditClick = () => {
          navigate(`/edit-notification/${params.row.notificationId}`)
        }
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
              justifyContent="space-between"
              alignItems="center"
              borderRadius="4px"
              width="100%">
              <Button variant="contained" onClick={() => handleDetailClick(params.row)}>
                Detail
              </Button>
              <Button variant="contained" onClick={() => handleDelete(params.row)}>
                Delete
              </Button>
              <Button variant="contained" onClick={() => handleEditClick(params.row)}>
                Edit
              </Button>
            </Box>
          </Box>
        )
      }
    }
  ]
  return (
    <>
      <Header title="DRAFT" />
      <DataTableDraft rows={allNoti} columns={columns} isLoading={isLoading} />
    </>
  )
}

export default NotificationDraftList
