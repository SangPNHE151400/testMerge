import SearchIcon from '@mui/icons-material/Search'
import SendIcon from '@mui/icons-material/Send'
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Modal,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import axios from 'axios'
import { getDownloadURL, ref } from 'firebase/storage'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import InputEmoji from 'react-input-emoji'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import io from 'socket.io-client'
import { storage } from '../../../firebase/config'
import useDebounce from '../../../hooks/useDebounce'
import chatApi from '../../../services/chatApi'
import { BASE_URL } from '../../../services/constraint'
import axiosClient from '../../../utils/axios-config'
import './components/Chat.css'
import ChatTopbar from './components/ChatTopbar'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4
}

const Chat = () => {
  const [newMessage, setNewMessage] = useState('')
  const [allUser, setAllUser] = useState([])
  const [allUserSingleChat, setAllUserSingleChat] = useState([])
  const [allChatList, setAllChatList] = useState([])
  const [isActiveUser, setIsActiveUser] = useState('')
  const [messages, setMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState('')
  const [file, setFile] = useState()
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [messageImage, setMessageImage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState([])
  const [selectedUserSingleChat, setSelectedUserSingleChat] = useState([])
  const [chatName, setChatName] = useState('')
  const [chatNameMessage, setChatNameMessage] = useState('')
  const socket = useRef()
  const imageRef = useRef()
  const scroll = useRef()
  const [open, setOpen] = useState(false)
  const [option, setOption] = useState('single')
  const handleChangeSelectOption = (event) => {
    setOption(event.target.value)
  }
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const debouncedSearch = useDebounce(searchTerm, 500)
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const currentUserId = useSelector((state) => state.auth.login.currentUser.accountId)

  useEffect(() => {
    const fetchAllUser = async () => {
      const response = await axios.get(`${BASE_URL}/getAllUserInfo`)
      setAllUser(response.data)
    }
    fetchAllUser()
  }, [])

  useEffect(() => {
    const fetchAllUserSingleChat = async () => {
      const data = {
        userId: currentUserId
      }
      const response = await chatApi.getUserSingleChat(data)
      setAllUserSingleChat(response)
    }
    fetchAllUserSingleChat()
  }, [])

  const handleCreateNewChat = () => {
    if (option === 'group') {
      const data = {
        from: currentUserId,
        to: selectedUser,
        chatName: chatName,
        message: chatNameMessage
      }
      chatApi.createNewMessage(data)
      setChatNameMessage('')
      setSelectedUser([])
      handleClose()
    } else if (option === 'single') {
      const data = {
        from: currentUserId,
        to: [selectedUserSingleChat],
        message: chatNameMessage
      }
      chatApi.createNewMessage(data)
      setChatNameMessage('')
      setAllUserSingleChat(
        allUserSingleChat.filter((user) => user.accountId !== selectedUserSingleChat)
      )
      handleClose()
    }
  }

  console.log(selectedUserSingleChat)

  useEffect(() => {
    const fetchAllChatList = async () => {
      const data = {
        userId: currentUserId
      }
      const response = await chatApi.getAllChatList(data)
      setAllChatList(response)
    }
    fetchAllChatList()
  }, [])

  console.log(allChatList)

  useEffect(() => {
    setIsLoadingChat(true)
    const getMessage = async () => {
      const response = await axiosClient.get(`${BASE_URL}/message`, {
        params: {
          from: currentUserId,
          to: isActiveUser?.accountId
        }
      })
      setMessages(response)
      setIsLoadingChat(false)
    }
    getMessage()
  }, [isActiveUser?.accountId])

  const imgurlAvatar = async () => {
    try {
      const downloadURLPromises = allChatList.map((item) => {
        if (item?.avatar[0] !== 'unknown') {
          const storageRef = ref(storage, `/${item?.avatar[0]}`)
          return getDownloadURL(storageRef)
        }
      })

      const downloadURLs = await Promise.all(downloadURLPromises)
      const result = allChatList.map((obj, index) => {
        return {
          ...obj,
          imgUrl: downloadURLs[index]
        }
      })
      setAllChatList(result)
    } catch (error) {
      console.error('Error getting download URLs:', error)
    }
  }
  useEffect(() => {
    imgurlAvatar()
  }, [allChatList.avatar[0]])

  console.log(allChatList);
  

  // const handleChange = (newMessage) => {
  //   setNewMessage(newMessage)
  //   console.log(newMessage)
  // }

  // const handleActiveUser = (item) => {
  //   setIsActiveUser(item)
  // }

  // const handleSendMessage = async () => {
  //   let data = {
  //     from: currentUserId,
  //     to: isActiveUser?.accountId,
  //     message: newMessage
  //   }

  //   let dataImage = {
  //     from: currentUserId,
  //     to: isActiveUser?.accountId
  //   }

  //   let message = {
  //     myself: true,
  //     message: newMessage,
  //     type: 'text'
  //   }

  //   if (file !== undefined) {
  //     try {
  //       let formData = new FormData()
  //       formData.append('data', JSON.stringify(dataImage))
  //       formData.append('message', file)
  //       const res = await axiosClient.post(`${BASE_URL}/chat2`, formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data'
  //         }
  //       })
  //       let message2 = {
  //         myself: true,
  //         message: res.message,
  //         type: 'image'
  //       }
  //       setMessages(messages.concat(message2))
  //       socket.current.emit('send-msg', {
  //         from: currentUserId,
  //         to: isActiveUser?.accountId,
  //         message: res.message,
  //         type: 'image'
  //       })
  //       setNewMessage('')
  //       setFile()
  //     } catch (error) {
  //       if (error.response.status === 400) {
  //         toast.error('User not found!')
  //       }
  //       if (error.response.status === 500) {
  //         toast.error('Null!')
  //       }
  //     }
  //   } else {
  //     try {
  //       await axiosClient.post(`${BASE_URL}/chat`, data)
  //       setMessages(messages.concat(message))
  //       socket.current.emit('send-msg', {
  //         from: currentUserId,
  //         to: isActiveUser?.accountId,
  //         message: newMessage,
  //         type: 'text'
  //       })
  //       setNewMessage('')
  //     } catch (error) {
  //       if (error.response.status === 400) {
  //         toast.error('User not found!')
  //       }
  //     }
  //   }
  // }

  // console.log(allUser)
  // useEffect(() => {
  //   if (isActiveUser === '') {
  //     socket.current = io('https://capstone-nodejs.onrender.com')
  //     socket.current.emit('addUser', currentUserId)
  //   }
  // }, [currentUserId])

  // useEffect(() => {
  //   if (socket.current) {
  //     socket.current.on('msg-receive', (msg) => {
  //       setArrivalMessage({ myself: false, message: msg.message, type: msg.type })
  //     })
  //   }
  // }, [arrivalMessage])

  // useEffect(() => {
  //   arrivalMessage && setMessages((pre) => [...pre, arrivalMessage])
  // }, [arrivalMessage])

  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0])
  //   setNewMessage(e.target.files[0].name)
  // }

  // const imgurlMessage = async () => {
  //   try {
  //     const downloadURLPromisesImage = messages.map((item) => {
  //       if (item?.type === 'image') {
  //         console.log(item.message)
  //         const storageRef = ref(storage, `/${item?.message}`)
  //         return getDownloadURL(storageRef)
  //       }
  //     })
  //     const downloadURLsImage = await Promise.all(downloadURLPromisesImage)
  //     if (downloadURLsImage !== undefined) {
  //       setMessageImage(downloadURLsImage)
  //     }
  //   } catch (error) {
  //     console.error('Error getting download URLs:', error)
  //   }
  // }

  // useEffect(() => {
  //   imgurlMessage()
  // }, [messages])

  console.log(allUser)
  return (
    <Box height="100vh">
      <ChatTopbar />
      <Box display="flex" gap="20px" p={1.5} bgcolor="#f5f7f9" height="calc(100vh - 65px)">
        <Box
          className="Left-side-chat"
          sx={{ overflowY: 'auto' }}
          bgcolor="#fff"
          width="22%"
          borderRadius="10px">
          <Box className="Chat-container">
            <Box display="flex" justifyContent="space-between" my={2}>
              <h2 style={{ padding: '16px', margin: 0 }}>Chats</h2>
              <Button
                onClick={handleOpen}
                variant="outlined"
                sx={{ p: '0px 5px', fontSize: '15px', mr: '16px', textTransform: 'capitalize' }}>
                Create New Chat
              </Button>
            </Box>
            <FormControl sx={{ width: '100%', bgcolor: '#fff', borderRadius: '10px', px: 2 }}>
              <TextField
                size="small"
                variant="outlined"
                sx={{ color: '#000', borderRadius: '10px', input: { color: '#000' } }}
                placeholder="Search User"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  style: {
                    borderRadius: '10px'
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#000' }} />
                    </InputAdornment>
                  )
                }}
              />
            </FormControl>

            {allChatList.map((item) => (
              <>
                <div
                  // style={{
                  //   backgroundColor:
                  //     item?.accountId === isActiveUser?.accountId ? '#80808038' : ''
                  // }}
                  className="user-friend"
                  // onClick={() => handleActiveUser(item, index)}
                >
                  <Stack p={1} display="flex" direction="row" spacing={1} mb={1}>
                    <Avatar sx={{ width: '50px', height: '50px' }} src='' />
                    <Box>
                      <Typography>{item.chatName}</Typography>
                      <Typography fontSize="15px" fontWeight="500">
                        hr
                      </Typography>
                    </Box>
                  </Stack>
                </div>
              </>
            ))}
          </Box>
        </Box>
        {/* <Box bgcolor="#fff" borderRadius="10px" flex={1}>
          {isLoadingChat ? (
            <Box display="flex" alignItems="center" justifyContent="center" height="100%">
              <CircularProgress />
            </Box>
          ) : (
            <>
              {isActiveUser !== '' ? (
                <Box
                  p={2}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  gap="10px"
                  height="100%">
                  <div>
                    <Box display="flex" alignItems="center" gap="10px" mb={2}>
                      {isActiveUser?.image !== 'unknown' ? (
                        <Avatar
                          // src={`${isActiveUser?.imgUrl}`}
                          sx={{ width: '50px', height: '50px' }}
                        />
                      ) : (
                        <Avatar sx={{ width: '50px', height: '50px' }} />
                      )}
                      {isActiveUser?.firstName !== 'unknown' &&
                      isActiveUser?.lastName !== 'unknown' ? (
                        <Typography>
                          {isActiveUser?.firstName} {isActiveUser?.lastName}
                        </Typography>
                      ) : (
                        <Typography>Unknown</Typography>
                      )}
                    </Box>
                    <Divider />
                  </div>
                  <Box sx={{ overflowY: 'auto', pr: 1 }}>
                    {messages.map((item, index) =>
                      item?.myself === true ? (
                        <>
                          <div ref={scroll} className="message own">
                            <div className="messageTop">
                              <div
                                style={{
                                  backgroundColor: item?.type === 'image' ? '#f5f7f9' : '#1877f2'
                                }}
                                className="messageText">
                                {item?.type === 'text' ? (
                                  <Typography
                                    color="#fff"
                                    sx={{ lineHeight: 1.3, letterSpacing: 0 }}>
                                    {item?.message}
                                  </Typography>
                                ) : item?.type === 'image' ? (
                                  <img
                                    style={{ width: '100%', height: '100%' }}
                                    src={messageImage[index]}
                                  />
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                            <Typography
                              sx={{
                                lineHeight: 1.3,
                                letterSpacing: 0,
                                fontWeight: 500,
                                fontFamily: 'none',
                                fontSize: '13px'
                              }}
                              alignSelf="flex-end">
                              {moment(item.createdAt).fromNow()}
                            </Typography>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            ref={scroll}
                            style={{ alignItems: 'flex-start' }}
                            className="message">
                            <div className="messageTop">
                              <div
                                style={{
                                  backgroundColor:
                                    item?.type === 'image' ? '#f5f7f9' : 'rgb(245, 241, 241)',
                                  color: '#000'
                                }}
                                className="messageText">
                                {item?.type === 'text' ? (
                                  <Typography
                                    color="#000"
                                    sx={{ lineHeight: 1.3, letterSpacing: 0 }}>
                                    {item?.message}
                                  </Typography>
                                ) : item?.type === 'image' ? (
                                  <img src={messageImage[index]} />
                                ) : (
                                  ''
                                )}
                              </div>
                            </div>
                            <Typography
                              sx={{
                                lineHeight: 1.3,
                                letterSpacing: 0,
                                fontWeight: 500,
                                fontFamily: 'none',
                                fontSize: '12px',
                                color: '#000',
                                ml: '10px'
                              }}
                              alignSelf="flex-start">
                              {moment(item.createdAt).fromNow()}
                            </Typography>
                          </div>
                        </>
                      )
                    )}
                  </Box>
                  <div className="chat-sender">
                    <div onClick={() => imageRef.current.click()}>+</div>
                    <InputEmoji value={newMessage} onChange={handleChange} />
                    <IconButton
                      size="large"
                      sx={{ bgcolor: '#1877f2' }}
                      onClick={handleSendMessage}>
                      <SendIcon sx={{ color: '#fff' }} />
                    </IconButton>
                    <input
                      onChange={(e) => handleFileChange(e)}
                      type="file"
                      name=""
                      id=""
                      style={{ display: 'none' }}
                      ref={imageRef}
                    />
                  </div>
                </Box>
              ) : (
                <p style={{ textAlign: 'center' }}>Tap on a chat to start conversation</p>
              )}
            </>
          )}
        </Box> */}
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" textAlign="center" fontSize="25px">
            Create New Chat
          </Typography>
          <FormControl sx={{ mt: 1 }}>
            <FormLabel id="demo-controlled-radio-buttons-group">Select option: </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={option}
              onChange={handleChangeSelectOption}>
              <FormControlLabel value="single" control={<Radio />} label="Single Chat" />
              <FormControlLabel value="group" control={<Radio />} label="Group Chat" />
            </RadioGroup>
          </FormControl>
          {option === 'group' ? (
            <>
              <TextField
                sx={{ mt: 2, mb: 3 }}
                value={chatName}
                fullWidth
                label="Chat Name"
                name="chatName"
                onChange={(e) => setChatName(e.target.value)}
              />
              <Autocomplete
                multiple
                id="tags-outlined"
                options={allUser}
                value={selectedUser.accountId}
                getOptionLabel={(option) => option.username}
                onChange={(event, newValue) =>
                  setSelectedUser(newValue.map((user) => user.accountId))
                }
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} label="UserName" />}
              />
            </>
          ) : (
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={allUserSingleChat}
              getOptionLabel={(option) => option.username}
              onChange={(event, newValue) => setSelectedUserSingleChat(newValue.accountId)}
              sx={{ mt: 2 }}
              renderInput={(params) => <TextField {...params} label="UserName" />}
            />
          )}
          <TextField
            sx={{ mt: 2, mb: 1 }}
            value={chatNameMessage}
            fullWidth
            label="Message"
            name="message"
            onChange={(e) => setChatNameMessage(e.target.value)}
          />
          <Button variant="contained" sx={{ mt: 2, width: '100%' }} onClick={handleCreateNewChat}>
            Create
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default Chat
