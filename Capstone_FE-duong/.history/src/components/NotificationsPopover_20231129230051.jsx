import LensIcon from '@mui/icons-material/Lens' // Import the LensIcon
import NotificationsIcon from '@mui/icons-material/Notifications'
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Popover,
  Typography
} from '@mui/material'
import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { BASE_URL } from '../services/constraint'
import axiosClient from '../utils/axios-config'
import notificationApi from '../services/notificationApi'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
const NotificationsPopover = () => {
  const [open, setOpen] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [listNotifications, setListNotifications] = useState([])
  const [showMore, setShowMore] = useState(false)
  const [viewAll, setViewAll] = useState(false)
  const [arrivalNotification, setArrivalNotification] = useState('')
  const navigate = useNavigate()
  const socket = useRef()
  const userId = useSelector((state) => state.auth.login.currentUser.accountId)
  const currentUserId = useSelector((state) => state.auth.login.currentUser.accountId)
  const handleOpen = (event) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...'
    }
    return text
  }

  useEffect(() => {
    setIsLoading(true)

    const fetchAllNotifications = async () => {
      try {
        const response = await axiosClient.get(`${BASE_URL}/getNotificationByUserId`, {
          params: {
            userId: userId
          }
        })

        if (response) {
          setListNotifications(response)
          setIsLoading(false)
        } else {
          toast.error('No data found')
        }
        console.log(response)
      } catch (error) {
        toast.error('Failed to fetch data')
      }
    }
    fetchAllNotifications()
  }, [userId])


  const sortedNotifications = listNotifications.notifications
    ? listNotifications.notifications
        .slice()
        .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
        .slice(
          0,
          viewAll
            ? listNotifications.notifications.length
            : showMore
            ? listNotifications.notifications.length
            : 5
        )
    : []

  const currentTime = new Date()

  const newNotifications = sortedNotifications.filter((notification) => {
    const timeDifference = currentTime - new Date(notification.uploadDate)
    const isRecent = timeDifference < 24 * 60 * 60 * 1000
    return isRecent
  })

  const otherNotifications = sortedNotifications.filter((notification) => {
    const timeDifference = currentTime - new Date(notification.uploadDate)
    const isRecent = timeDifference < 24 * 60 * 60 * 1000
    return !isRecent
  })

  useEffect(() => {
    socket.current = io('http://localhost:3001')
    socket.current.emit('addUser', currentUserId)
  }, [currentUserId])

  useEffect(() => {
    if (socket.current) {
      socket.current.on('notification-receive', (msg) => {
        console.log(msg);
        setArrivalNotification({
          notificationId: msg.notificationId,
          userId: msg.userId,
          readStatus: msg.readStatus,
          title: msg.title,
          uploadDate: msg.uploadDate,
          department: msg.department
        })
      })
    }
  }, [arrivalNotification])

  useEffect(() => {
    arrivalNotification && setListNotifications({total: listNotifications.total + 1, notifications: [arrivalNotification, ...listNotifications.notifications]})
    toast.success('New notification')
  }, [arrivalNotification.notificationId])

  console.log(listNotifications);


  const handleGoToDetail = (notification) => {
    if (notification.readStatus === false) {
      let data = {
        notificationId: notification.notificationId,
        userId: userId
      }
      notificationApi.markToRead(data)
    }
    navigate(`/notification-detail/${notification.notificationId}/${notification.userId}`)
  }

  return (
    <>
      <IconButton sx={{ color: 'rgb(94, 53, 177)' }} onClick={handleOpen}>
        <Badge
          badgeContent={
            listNotifications.notifications &&
            listNotifications.notifications.filter((notification) => !notification.readStatus)
              .length
          }
          color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 360,
            maxHeight: '400px',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            },
            overflowY: 'auto'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {listNotifications.total} notifications
              {listNotifications.notifications && (
                <span>
                  {' '}
                  (
                  {
                    listNotifications.notifications.filter(
                      (notification) => !notification.readStatus
                    ).length
                  }{' '}
                  unread)
                </span>
              )}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <List disablePadding>
          {newNotifications.length > 0 && (
            <>
              <ListSubheader
                disableSticky
                sx={{
                  px: 2.5,
                  py: 1,
                  typography: 'overline',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: 'rgb(94, 53, 177)'
                }}>
                New
              </ListSubheader>
              {newNotifications.map((notification) => (
                <ListItemButton
                  key={`new_${notification.notificationId}`}
                  sx={{
                    px: 2.5,
                    pb: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    alignItems: 'flex-start'
                  }}
                  onClick={() => handleGoToDetail(notification)}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                    From {notification.department.departmentName}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <ListItemText
                      primary={truncateText(notification.title, 30)}
                      sx={{ fontSize: '2.5rem', fontWeight: 'bold' }}
                    />
                    {!notification.readStatus === true && (
                      <LensIcon
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: '55%',
                          right: 0,
                          transform: 'translateY(-50%)',
                          fontSize: '16px'
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.9rem',
                      fontStyle: 'italic',
                      color: 'grey'
                    }}>
                    {format(new Date(notification.uploadDate), 'yyyy/MM/dd HH:mm:ss')}
                  </Typography>
                </ListItemButton>
              ))}
            </>
          )}

          {otherNotifications.length > 0 && (
            <>
              <ListSubheader
                disableSticky
                sx={{
                  px: 2.5,
                  py: 1,
                  typography: 'overline',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: 'rgb(94, 53, 177)'
                }}>
                Previous
              </ListSubheader>
              {otherNotifications.map((notification) => (
                <ListItemButton
                  key={`other_${notification.notificationId}`}
                  sx={{
                    px: 2.5,
                    pb: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',

                    alignItems: 'flex-start'
                  }}
                  onClick={() => handleGoToDetail(notification)}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                    from {notification.department.departmentName}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space between' }}>
                    <ListItemText
                      primary={truncateText(notification.title, 30)}
                      sx={{ fontSize: '2.5rem', fontWeight: 'bold' }}
                    />
                    {!notification.readStatus === true && (
                      <LensIcon
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: '55%',
                          right: 0,
                          transform: 'translateY(-50%)',
                          fontSize: '16px'
                        }}
                      />
                    )}
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: '0.9rem',
                      fontStyle: 'italic',
                      color: 'grey'
                    }}>
                    {format(new Date(notification.uploadDate), 'yy/MM/dd HH:mm:ss')}
                  </Typography>
                </ListItemButton>
              ))}
            </>
          )}
        </List>
        <Divider sx={{ borderStyle: 'dashed' }} />
        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple disablePadding onClick={() => setViewAll(!viewAll)}>
            {viewAll ? 'Show Less' : 'View More'}
          </Button>
        </Box>
      </Popover>
    </>
  )
}

export default NotificationsPopover
