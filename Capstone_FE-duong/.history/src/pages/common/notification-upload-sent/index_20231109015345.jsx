import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { Box, Button, Typography } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Header from '../../../components/Header'
import { BASE_URL } from '../../../services/constraint'
import notificationApi from '../../../services/notificationApi'
import axiosClient from '../../../utils/axios-config'
import DataTableListUploadSent from './components/DataTableUploadSent'
const NotificationUploadSent = () => {
  const userId = useSelector((state) => state.auth.login.currentUser.accountId)
  const [allNoti, setAllNoti] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } }
  const handelSetPersonalPriority = async (notification) => {
    if (notification.personalPriority === false && !notification.personalPriority) {
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
  useEffect(() => {
    setIsLoading(true)
    const fetchAllNoti = async () => {
      const response = await axiosClient.get(`${BASE_URL}/getListUploadedNotificationByCreator`, {
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
      field: 'title',
      headerName: 'Title',
      headerAlign: 'center',
      align: 'center',
      width: 200,
      flex: 1
    },
    {
      headerName: 'Content',
      headerAlign: 'center',
      align: 'center',
      width: 300,
      renderCell: (params) => (
        <Typography
          dangerouslySetInnerHTML={{
            __html: params.row.content
          }}></Typography>
      )
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
      width: 300,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const handleDetailClick = () => {
          navigate(`/notification-detail/${params.row.notificationId}/${params.row.creatorId}`)
        }
            },
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
                    color='#000'
                >
                    <div>
                        {format(new Date(params.row.uploadDate), 'yyyy/MM/dd HH:mm:ss')}
                    </div>
                </Box>
            )
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
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="4px"
                    width="100%">
                    <Button variant="contained" onClick={() => handleDetailClick(params.row)} style={{ fontSize: '12px' }}>
                      Detail
                    </Button>
                    <Button variant="contained" onClick={() => handleEditClick(params.row)} style={{ fontSize: '12px' }}>
                      Edit
                    </Button>

                  </Box>
                </Box>
              )
            }
          }
        ,

    ]
    return (
        <>
            <Header title="SEND" />
            <DataTableListUploadSent
                rows={allNoti}
                columns={columns}
                isLoading={isLoading}

            />

        </>
    )

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
              justifyContent="center"
              alignItems="center"
              borderRadius="4px"
              width="100%">
              <Button variant="contained" onClick={() => handleDetailClick(params.row)}>
                Detail
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
      <Header title="SEND" />
      <DataTableListUploadSent rows={allNoti} columns={columns} isLoading={isLoading} />
    </>
  )
}

export default NotificationUploadSent
