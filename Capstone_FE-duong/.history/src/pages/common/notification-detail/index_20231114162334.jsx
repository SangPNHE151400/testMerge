import DownloadIcon from '@mui/icons-material/Download'
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Typography,
  useTheme
} from '@mui/material'
import { getDownloadURL, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { storage } from '../../../firebase/config'
import notificationApi from '../../../services/notificationApi'
import ChatTopbar from '../chat/components/ChatTopbar'
import formatDate from '../../../utils/formatDate'

const NotificationDetail = () => {
  const theme = useTheme()
  const { notificationId, creatorId } = useParams()
  const [imageSender, setImageSender] = useState('')
  const [notificationDetail, setNotificationDetail] = useState('')
  const [notificationFiles, setNotificationFiles] = useState([])
  const [notificationImages, setNotificationImages] = useState([])
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const [isLoading, setIsLoading] = useState(false)
  const handleDownload = (item) => {
    const base64Data = item?.data
    if (!base64Data) {
      return
    }

    const binaryData = atob(base64Data)
    const byteNumbers = new Array(binaryData.length)
    for (let i = 0; i < binaryData.length; i++) {
      byteNumbers[i] = binaryData.charCodeAt(i)
    }
    const uint8Array = new Uint8Array(byteNumbers)

    const blob = new Blob([uint8Array], {
      type: item?.type
    })

    const blobUrl = URL.createObjectURL(blob)

    const downloadLink = document.createElement('a')
    downloadLink.href = blobUrl
    downloadLink.download = item?.fileName
    downloadLink.click()
  }

  useEffect(() => {
    setIsLoading(true)
    const fetchNotificationDetail = async () => {
      if (currentUser?.accountId === creatorId) {
        let data = {
          userId: currentUser?.accountId,
          notificationId: notificationId
        }

        const res = await notificationApi.getNotificationDetailByCreator(data)
        setNotificationDetail(res)
        setNotificationFiles(res?.notificationFiles)
        setNotificationImages(res?.notificationImages)
        setIsLoading(false)
      } else {
        let data = {
          userId: currentUser?.accountId,
          notificationId: notificationId
        }

        const res = await notificationApi.getNotificationDetailByReceiver(data)
        setNotificationDetail(res)
        setNotificationFiles(res?.notificationFiles)
        setNotificationImages(res?.notificationImages)
        setIsLoading(false)
      }
    }

    fetchNotificationDetail()
  }, [])
  const imgurl = async () => {
    if (notificationImages.length > 0) {
      try {
        const downloadURLPromises = notificationImages.map((item) => {
          if (item.imageFileName === 'unknown') {
            return Promise.resolve(null)
          } else {
            const storageRef = ref(storage, `/${item.imageFileName}`)
            return getDownloadURL(storageRef)
          }
        })

        const downloadURLs = await Promise.all(downloadURLPromises)
        console.log(downloadURLs)
        const updatedUsersProfile = notificationImages.map((item, index) => ({
          ...item,
          imageFileName: downloadURLs[index]
        }))
        setNotificationImages(updatedUsersProfile)
      } catch (error) {
        console.error('Error getting download URLs:', error)
      }
    }
  }

  useEffect(() => {
    imgurl()
  }, [notificationImages])

  const imgurlSender = async () => {
    const storageRef = ref(storage, `/${notificationDetail?.creatorImage}`)
    try {
      const url = await getDownloadURL(storageRef)
      setImageSender(url)
    } catch (error) {
      console.error('Error getting download URL:', error)
    }
  }

  if (notificationDetail?.creatorImage) {
    imgurlSender()
  }

  console.log(notificationDetail)
  console.log(notificationImages)
  return (
    <Box bgcolor={theme.palette.bgColorPrimary.main}>
      <ChatTopbar />
      {isLoading ? (
        <Paper sx={{ padding: 2, m: 2 }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="450px">
            <CircularProgress />
          </Box>
        </Paper>
      ) : (
        <Paper sx={{ padding: 2, m: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap={1} alignItems="center" mb={2}>
              {notificationDetail?.creatorImage === null ? (
                <Avatar src="/path/to/avatar.jpg" alt="Avatar" />
              ) : (
                <Avatar src={imageSender} alt="Avatar" />
              )}
              <Box display="flex" flexDirection="column">
                <Typography fontSize="16px" variant="body1">
                  {notificationDetail?.firstName} {notificationDetail?.lastName}
                </Typography>
                <Typography sx={{ textTransform: 'capitalize' }} fontSize="12px" variant="body1">
                  {notificationDetail?.role?.roleName}
                </Typography>
              </Box>
            </Box>
            <Box>{formatDate(notificationDetail?.uploadDate)}</Box>
          </Box>
          <Divider />
          <Box mt={2} minHeight="450px">
            <Typography
              dangerouslySetInnerHTML={{
                __html: notificationDetail?.content
              }}></Typography>
          </Box>
          {notificationFiles && notificationFiles.length > 0 || notificationImages &&
            notificationImages.length > 0 && <Divider />}
          <Box mt={2}>
            {(notificationFiles && notificationFiles.length > 0) || (notificationImages &&
            notificationImages.length > 0) ? (
              <Typography mb={2} fontWeight="700">
                Attachments:{' '}
              </Typography>
            ): ''}
            <Box mb={3} alignItems="center" gap="10px" display="flex" flexWrap="wrap">
              {notificationFiles &&
                notificationFiles.length > 0 &&
                notificationFiles.map((item) => (
                  <>
                    <Chip
                      sx={{
                        mr: 1
                      }}
                      variant="outlined"
                      size="medium"
                      label={item?.fileName}
                      icon={
                        <IconButton onClick={() => handleDownload(item)}>
                          <DownloadIcon />
                        </IconButton>
                      }
                    />
                  </>
                ))}
            </Box>
          </Box>
          {notificationImages &&
            notificationImages.length > 0 &&
            notificationImages.map((item, index) => (
              <>
                <img
                  width="150px"
                  height="100px"
                  style={{ marginRight: '20px' }}
                  key={index}
                  src={item?.imageFileName}
                />
              </>
            ))}
          <Divider />
          <Box mt={2} display="flex" justifyContent="flex-start">
            {currentUser?.role === 'hr' ? (
              <Link to="/manage-user">
                <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                  Back to Dashboard
                </Button>
              </Link>
            ) : currentUser?.role === 'employee' ? (
              <Link to="/check-attendance">
                <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                  Back to Dashboard
                </Button>
              </Link>
            ) : currentUser?.role === 'manager' ? (
              <Link to="/request-list-manager">
                <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                  Back to Dashboard
                </Button>
              </Link>
            ) : currentUser?.role === 'admin' ? (
              <Link to="/request-list-admin">
                <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                  Back to Dashboard
                </Button>
              </Link>
            ) : currentUser?.role === 'security' ? (
              <Link to="/manage-user">
                <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                  Back to Dashboard
                </Button>
              </Link>
            ) : (
              <></>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  )
}

export default NotificationDetail
