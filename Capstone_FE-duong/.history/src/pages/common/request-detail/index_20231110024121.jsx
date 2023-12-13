import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { LoadingButton } from '@mui/lab'
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Modal,
  Paper,
  Typography
} from '@mui/material'
import { styled } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import requestApi from '../../../services/requestApi'
import userApi from '../../../services/userApi'
import ChatTopbar from '../chat/components/ChatTopbar'
import './components/style.css'
import { storage } from '../../../firebase/config'
import { getDownloadURL, ref } from 'firebase/storage'
ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'heading',
      '|',
      'bold',
      'italic',
      '|',
      'bulletedList',
      'numberedList',
    ]
  },
  language: 'en'
};
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper
}))

const StyledPaperAns = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  backgroundColor: 'lightblue'
}))

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 2
}

const TicketDetail = () => {
  const scrollbarsRef = useRef()
  const [request, setRequest] = useState([])
  const [roleSender, setRoleSender] = useState(null)
  const [content, setContent] = useState('')
  const [contentReason, setContentReason] = useState('')
  const { requestId } = useParams()
  const [open, setOpen] = useState(false)
  const [imageReceiver, setImageReceiver] = useState('')
  const [imageSender, setImageSender] = useState('')
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth.login?.currentUser)
  const userRole = useSelector((state) => state.auth.login?.currentUser.role)
  const userId = useSelector((state) => state.auth.login?.currentUser?.accountId)
  const handleSendMessage = (e) => {
    e.preventDefault()
    let data = {
      userId: userId,
      requestId: requestId,
      content: content,
      departmentId: request[0]?.requestMessageResponse?.receiverDepartment?.departmentId
    }

    requestApi.otherFormExistRequest(data)
    setTimeout(function () {
      location.reload()
    }, 500)
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  useEffect(() => {
    const getMessageDetail = async () => {
      if (requestId.startsWith('AT')) {
        const res = await requestApi.getDetailAttendanceMessageById(requestId)
        setRequest(res)
        console.log(res)
      } else if (requestId.startsWith('LV')) {
        const res = await requestApi.getDetailLeaveMessageById(requestId)
        setRequest(res)
      } else if (requestId.startsWith('OR')) {
        const res = await requestApi.getDetailOtherMessageById(requestId)
        console.log(res)
        setRequest(res)
      }
      else if (requestId.startsWith('OT')) {
        const res = await requestApi.getDetailOverTimeMessageById(requestId)
        console.log(res)
        setRequest(res)
      }
    }
    getMessageDetail()
  }, [])

  useEffect(() => {
    if (request.length !== 0) {
      const getRoleByID = async () => {
        const res = await userApi.getRoleByUserId(request[0]?.requestMessageResponse?.senderId)
        setRoleSender(res.roleName)
        console.log(res)
      }
      getRoleByID()
    }
  }, [request[0]?.requestMessageResponse?.senderId])

  console.log('>>>' + request[0]?.object?.attendanceRequestId)

  const handleAccept = async () => {
    if (request[0]?.object?.topic === 'ATTENDANCE_REQUEST') {
      requestApi.acceptAttendanceRequest(request[0]?.object?.attendanceRequestId);
    } else if (request[0]?.object?.topic === 'LEAVE_REQUEST') {
      requestApi.acceptLeaveRequest(request[0]?.object?.leaveRequestId);
    } else if (request[0]?.object?.topic === 'OVERTIME_REQUEST') {
      requestApi.acceptOtRequest(request[0]?.object?.overtimeRequestId);
    } else if (request[0]?.object?.topic === 'LATE_REQUEST') {
      requestApi.acceptLateRequest(request[0]?.object?.lateRequestId);
    }
  }

  useEffect(() => {
    scrollbarsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleRejectRequest = () => {
    if (request[0]?.object?.topic === 'ATTENDANCE_REQUEST') {
      let data = {
        attendanceRequestId: request[0]?.object?.attendanceRequestId,
        content: contentReason,
      };
      console.log(data);
      requestApi.rejectAttendanceRequest(data);
      if (currentUser?.role === 'manager') {
        navigate('/request-list-manager');
      } else if (currentUser?.role === 'hr') {
        navigate('/request-list-hr');
      }
    } else if (request[0]?.object?.topic === 'LEAVE_REQUEST') {
      let data = {
        leaveRequestId: request[0]?.object?.leaveRequestId,
        content: contentReason,
      };
      console.log(data);
      requestApi.rejectLeaveRequest(data);
      if (currentUser?.role === 'manager') {
        navigate('/request-list-manager');
      } else if (currentUser?.role === 'hr') {
        navigate('/request-list-hr');
      }
    } else if (request[0]?.object?.topic === 'OVERTIME_REQUEST') {
      let data = {
        overtimeRequestId: request[0]?.object?.overtimeRequestId,
        content: contentReason,
      };
      console.log(data);
      requestApi.rejectOvertimeRequest(data);
      if (currentUser?.role === 'manager') {
        navigate('/request-list-manager');
      }
    } else if (request[0]?.object?.topic === 'LATE_REQUEST') {
      let data = {
        lateRequestId: request[0]?.object?.lateRequestId,
        content: contentReason,
      };
      console.log(data);
      requestApi.rejectLateRequest(data);
      if (currentUser?.role === 'manager') {
        navigate('/request-list-manager');
      }
    }
  };


  const imgurlReceiver = async () => {
    const storageRef = ref(storage, `/${request[0]?.requestMessageResponse?.imageReceiver}`)
    try {
      const url = await getDownloadURL(storageRef)
      setImageReceiver(url)
    } catch (error) {
      console.error('Error getting download URL:', error)
    }
  }

  if (request[0]?.requestMessageResponse && request[0]?.requestMessageResponse?.imageReceiver) {
    imgurlReceiver()
  }

  const imgurlSender = async () => {
    const storageRef = ref(storage, `/${request[0]?.requestMessageResponse?.imageSender}`)
    try {
      const url = await getDownloadURL(storageRef)
      setImageSender(url)
    } catch (error) {
      console.error('Error getting download URL:', error)
    }
  }

  if (request[0]?.requestMessageResponse && request[0]?.requestMessageResponse?.imageSender) {
    imgurlSender()
  }

  console.log(request[0]?.requestMessageResponse?.receiverId)
  console.log(currentUser?.accountId)

  const checkTopic = () => {
    if (request[0]?.object?.topic === 'ATTENDANCE_REQUEST') {
      return (
        <>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Title : {request[0]?.requestMessageResponse?.title}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Department :{' '}
                      {request[0]?.requestMessageResponse?.receiverDepartment?.departmentName}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />

            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Date : {request[0]?.object?.manualDate}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />

            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Time Start : {request[0]?.object?.manualFirstEntry}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />

            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Time Exit : {request[0]?.object?.manualLastExit}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
          </List>
        </>
      )
    } else if (request[0]?.object?.topic === 'LEAVE_REQUEST') {
      return (
        <>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Title : {request[0]?.requestMessageResponse?.title}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Department :{' '}
                      {request[0]?.requestMessageResponse?.receiverDepartment?.departmentName}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />

            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      From Date : {request[0]?.object?.fromDate}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />

            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      End Date : {request[0]?.object?.toDate}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
          </List>
        </>
      )
    } else if (request[0]?.object?.topic === 'OTHER_REQUEST') {
      return (
        <>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Title : {request[0]?.requestMessageResponse?.title}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Department :{' '}
                      {request[0]?.requestMessageResponse?.receiverDepartment?.departmentName}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
          </List>
        </>
      )

    } else if (request[0]?.object?.topic === 'OVERTIME_REQUEST') {
      return (
        <>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Title : {request[0]?.requestMessageResponse?.title}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {request[0]?.object?.topicOvertime === 'WEEKEND_AND_NORMAL_DAY'
                        ? 'WEEKEND AND NORMAL DAY'
                        : 'HOLIDAY'}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Department :{' '}
                      {request[0]?.requestMessageResponse?.receiverDepartment?.departmentName}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      Date Over Time :{' '}
                      {request[0]?.object?.overtimeDate}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                      From : {request[0]?.object?.fromTime +" "} 
                    </Typography>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary">
                       - To : {request[0]?.object?.toTime}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
          </List>
        </>
      )
    }
  }

  console.log(request[0]?.requestMessageResponse?.requestTicketStatus)
  return (
    <>
      {request.length === 0 ? (
        <></>
      ) : (
        <Box>
          <ChatTopbar />
          <Box height="100%" display="flex">
            <Box flex="1">{checkTopic()}</Box>
            <Box flex="4">
              <form onSubmit={handleSendMessage}>
                <div
                  ref={scrollbarsRef}
                  style={{ overflow: 'auto', backgroundColor: '#f5f7f9', maxHeight: '430px' }}>
                  <Box m={2} sx={{ left: '0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button variant="outlined">{request[0]?.object?.topic}</Button>
                    </Box>
                  </Box>
                  {request?.map((req, index) => (
                    <>
                      {request[index]?.requestMessageResponse?.receiverId === userId ? (
                        <>
                          {index === 0 ? (
                            <StyledPaper>
                              <Box display="flex" justifyContent="space-between">
                                <Box display="flex" gap={1} alignItems="center" mb={2}>
                                  {req?.requestMessageResponse?.imageSender === null ? (
                                    <Avatar src="/path/to/avatar.jpg" alt="Avatar" />
                                  ) : (
                                    <Avatar src={imageSender} alt="Avatar" />
                                  )}
                                  <Box display="flex" flexDirection="column">
                                    <Typography fontSize="16px" variant="body1">
                                      {req?.requestMessageResponse?.senderFirstName === null ||
                                        req?.requestMessageResponse?.senderLastName === null ? (
                                        <>unknown</>
                                      ) : (
                                        <>
                                          {' '}
                                          {req?.requestMessageResponse?.senderFirstName}{' '}
                                          {req?.requestMessageResponse?.senderLastName}
                                        </>
                                      )}
                                    </Typography>
                                    <Typography
                                      sx={{ textTransform: 'capitalize' }}
                                      fontSize="12px"
                                      variant="body1">
                                      {roleSender}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box>{req?.requestMessageResponse?.createDate}</Box>
                              </Box>
                              <Typography
                                dangerouslySetInnerHTML={{
                                  __html: req?.object?.content
                                }}></Typography>
                              {request[0]?.object?.topic !== 'OTHER_REQUEST' &&
                                request[0]?.requestMessageResponse?.requestTicketStatus !=
                                'CLOSED' ? (
                                <Box display="flex" gap="10px" justifyContent="flex-end">
                                  <Button
                                    onClick={handleOpen}
                                    variant="contained"
                                    sx={{ bgcolor: 'red' }}>
                                    Reject
                                  </Button>

                                  <LoadingButton
                                    onClick={handleAccept}
                                    variant="contained"
                                    sx={{ bgcolor: 'green' }}>
                                    Accept
                                  </LoadingButton>
                                </Box>
                              ) : (
                                <></>
                              )}
                            </StyledPaper>
                          ) : (
                            <StyledPaper>
                              <Box display="flex" justifyContent="space-between">
                                <Box display="flex" gap={1} alignItems="center" mb={2}>
                                  {req?.requestMessageResponse?.imageSender === null ? (
                                    <Avatar src="/path/to/avatar.jpg" alt="Avatar" />
                                  ) : (
                                    <Avatar src={imageSender} alt="Avatar" />
                                  )}
                                  <Box display="flex" flexDirection="column">
                                    <Typography fontSize="16px" variant="body1">
                                      {req?.requestMessageResponse?.senderFirstName === null ||
                                        req?.requestMessageResponse?.senderLastName === null ? (
                                        <>unknown</>
                                      ) : (
                                        <>
                                          {' '}
                                          {req?.requestMessageResponse?.senderFirstName}{' '}
                                          {req?.requestMessageResponse?.senderLastName}
                                        </>
                                      )}
                                    </Typography>
                                    <Typography
                                      sx={{ textTransform: 'capitalize' }}
                                      fontSize="12px"
                                      variant="body1">
                                      {roleSender}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box>{req?.requestMessageResponse?.createDate}</Box>
                              </Box>
                              <Typography
                                dangerouslySetInnerHTML={{
                                  __html: req?.object?.content
                                }}></Typography>
                            </StyledPaper>
                          )}
                        </>
                      ) : (
                        <>
                          <StyledPaperAns>
                            <Box display="flex" justifyContent="space-between">
                              <Box display="flex" gap={1} alignItems="center" mb={2}>
                                {req?.requestMessageResponse?.imageSender === null ? (
                                  <Avatar src="/path/to/avatar.jpg" alt="Avatar" />
                                ) : (
                                  <Avatar src={imageReceiver} alt="Avatar" />
                                )}
                                <Box display="flex" flexDirection="column">
                                  <Typography fontSize="16px" variant="body1">
                                    {req?.requestMessageResponse?.senderFirstName === null ||
                                      req?.requestMessageResponse?.senderLastName === null ? (
                                      <>unknown</>
                                    ) : (
                                      <>
                                        {' '}
                                        {req?.requestMessageResponse?.senderFirstName}{' '}
                                        {req?.requestMessageResponse?.senderLastName}
                                      </>
                                    )}
                                  </Typography>
                                  <Typography
                                    sx={{ textTransform: 'capitalize' }}
                                    fontSize="12px"
                                    variant="body1">
                                    {userRole}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box>{req?.requestMessageResponse?.createDate}</Box>
                            </Box>
                            <Typography
                              dangerouslySetInnerHTML={{
                                __html: req?.object?.content
                              }}></Typography>
                          </StyledPaperAns>
                        </>
                      )}
                    </>
                  ))}
                </div>
                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                  {currentUser?.role === 'hr' ||
                    currentUser?.role === 'admin' ||
                    currentUser?.role === 'security' ? (
                    request[0]?.requestMessageResponse?.requestTicketStatus != 'CLOSED' &&
                      request[0]?.requestMessageResponse?.receiverId === currentUser?.accountId ? (
                      <CKEditor
                        editor={ClassicEditor}
                        onChange={(event, editor) => {
                          const data = editor.getData()
                          setContent(data)
                        }}
                      />
                    ) : (
                      <></>
                    )
                  ) : request[0]?.requestMessageResponse?.requestTicketStatus != 'CLOSED' ? (
                    <CKEditor
                      editor={ClassicEditor}
                      onChange={(event, editor) => {
                        const data = editor.getData()
                        setContent(data)
                      }}
                    />
                  ) : (
                    <></>
                  )}

                  <Box mt={2} justifyContent="space-between" display="flex">
                    {currentUser?.role === 'hr' ? (
                      <Link to="/request-list-hr">
                        <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                          Back
                        </Button>
                      </Link>
                    ) : currentUser?.role === 'employee' ? (
                      <Link to="/request-list-employee">
                        <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                          Back
                        </Button>
                      </Link>
                    ) : currentUser?.role === 'manager' ? (
                      <Link to="/request-list-manager">
                        <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                          Back
                        </Button>
                      </Link>
                    ) : currentUser?.role === 'admin' ? (
                      <Link to="/request-list-admin">
                        <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                          Back
                        </Button>
                      </Link>
                    ) : currentUser?.role === 'security' ? (
                      <Link to="/manage-user">
                        <Button variant="contained" sx={{ bgcolor: 'rgb(100, 149, 237)' }}>
                          Back
                        </Button>
                      </Link>
                    ) : (
                      <></>
                    )}
                    {currentUser?.role === 'hr' ||
                      currentUser?.role === 'admin' ||
                      currentUser?.role === 'security' ? (
                      request[0]?.requestMessageResponse?.requestTicketStatus != 'CLOSED' &&
                        request[0]?.requestMessageResponse?.receiverId === currentUser?.accountId ? (
                        <Button sx={{ mr: 2 }} type="submit" variant="contained" color="primary">
                          Send
                        </Button>
                      ) : (
                        <></>
                      )
                    ) : request[0]?.requestMessageResponse?.requestTicketStatus != 'CLOSED' ? (
                      <Button sx={{ mr: 2 }} type="submit" variant="contained" color="primary">
                        Send
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style} display="flex" flexDirection="column">
              <form onSubmit={handleRejectRequest}>
                <Typography fontSize="20px" fontWeight="700" mb={2}>
                  Reason reject
                </Typography>
                <textarea
                  value={contentReason}
                  onChange={(e) => setContentReason(e.target.value)}
                  style={{ width: '100%' }}
                  rows={6}
                />
                <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-end', mt: 2 }}>
                  Save
                </Button>
              </form>
            </Box>
          </Modal>
        </Box>
      )}
    </>
  )
}

export default TicketDetail
