import SearchIcon from '@mui/icons-material/Search'
import SendIcon from '@mui/icons-material/Send'
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  Button
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
import { BASE_URL } from '../../../services/constraint'
import axiosClient from '../../../utils/axios-config'
import './components/Chat.css'
import ChatTopbar from './components/ChatTopbar'
import useDebounce from '../../../hooks/useDebounce'

const Chat = () => {
  const [newMessage, setNewMessage] = useState('')
  const [allUser, setAllUser] = useState([])
  const [isActiveUser, setIsActiveUser] = useState('')
  const [messages, setMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState('')
  const [file, setFile] = useState()
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const [messageImage, setMessageImage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const socket = useRef()
  const imageRef = useRef()
  const scroll = useRef()
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
      const downloadURLPromises = allUser.map((item) => {
        if (item?.image !== 'unknown') {
          const storageRef = ref(storage, `/${item.image}`)
          return getDownloadURL(storageRef)
        }
      })

      const downloadURLs = await Promise.all(downloadURLPromises)
      const result = allUser.map((obj, index) => {
        return {
          ...obj,
          imgUrl: downloadURLs[index]
        };
      });
      setAllUser(result)
    } catch (error) {
      console.error('Error getting download URLs:', error)
    }
  }
  useEffect(() => {
    imgurlAvatar()
  }, [allUser])

  const handleChange = (newMessage) => {
    setNewMessage(newMessage)
    console.log(newMessage)
  }

  const handleActiveUser = (item) => {
    setIsActiveUser(item)
  }

  const handleSendMessage = async () => {
    let data = {
      from: currentUserId,
      to: isActiveUser?.accountId,
      message: newMessage
    }

    let dataImage = {
      from: currentUserId,
      to: isActiveUser?.accountId
    }

    let message = {
      myself: true,
      message: newMessage,
      type: 'text'
    }

    if (file !== undefined) {
      try {
        let formData = new FormData()
        formData.append('data', JSON.stringify(dataImage))
        formData.append('message', file)
        const res = await axiosClient.post(`${BASE_URL}/chat2`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        let message2 = {
          myself: true,
          message: res.message,
          type: 'image'
        }
        setMessages(messages.concat(message2))
        socket.current.emit('send-msg', {
          from: currentUserId,
          to: isActiveUser?.accountId,
          message: res.message,
          type: 'image'
        })
        setNewMessage('')
        setFile()
      } catch (error) {
        if (error.response.status === 400) {
          toast.error('User not found!')
        }
        if (error.response.status === 500) {
          toast.error('Null!')
        }
      }
    } else {
      try {
        await axiosClient.post(`${BASE_URL}/chat`, data)
        setMessages(messages.concat(message))
        socket.current.emit('send-msg', {
          from: currentUserId,
          to: isActiveUser?.accountId,
          message: newMessage,
          type: 'text'
        })
        setNewMessage('')
      } catch (error) {
        if (error.response.status === 400) {
          toast.error('User not found!')
        }
      }
    }
  }

  console.log(allUser);
  useEffect(() => {
    if (isActiveUser === '') {
      socket.current = io('https://capstone-nodejs.onrender.com')
      socket.current.emit('addUser', currentUserId)
    }
  }, [currentUserId])

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-receive', (msg) => {
        setArrivalMessage({ myself: false, message: msg.message, type: msg.type })
      })
    }
  }, [arrivalMessage])

  useEffect(() => {
    arrivalMessage && setMessages((pre) => [...pre, arrivalMessage])
  }, [arrivalMessage])

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setNewMessage(e.target.files[0].name)
  }

  const imgurlMessage = async () => {
    try {
      const downloadURLPromisesImage = messages.map((item) => {
        if (item?.type === 'image') {
          console.log(item.message)
          const storageRef = ref(storage, `/${item?.message}`)
          return getDownloadURL(storageRef)
        }
      })
      const downloadURLsImage = await Promise.all(downloadURLPromisesImage)
      if (downloadURLsImage !== undefined) {
        setMessageImage(downloadURLsImage)
      }
    } catch (error) {
      console.error('Error getting download URLs:', error)
    }
  }

  useEffect(() => {
    imgurlMessage()
  }, [messages])

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
            <Box display='flex' justifyContent='space-between' my={2}>
            <h2 style={{ padding: '16px', margin: 0 }}>Chats</h2>
            <Button variant='contained' sx={{p: '5px'}}>Create New Chat</Button>
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
            {allUser
              .filter((user) =>
                user.firstName.concat(' '+user.lastName).toLowerCase().includes(debouncedSearch)
              )
              .map((item, index) => (
                <>
                  {item?.accountId !== currentUserId ? (
                    <div
                      style={{
                        backgroundColor:
                          item?.accountId === isActiveUser?.accountId ? '#80808038' : ''
                      }}
                      className="user-friend"
                      onClick={() => handleActiveUser(item, index)}>
                      <Stack p={1} display="flex" direction="row" spacing={1} mb={1}>
                        {item?.image !== 'unknown' ? (
                          <Avatar
                            src={`${item?.imgUrl}`}
                            sx={{ width: '50px', height: '50px' }}
                          />
                        ) : (
                          <Avatar sx={{ width: '50px', height: '50px' }} />
                        )}
                        <Box>
                          {item?.firstName !== 'unknown' && item?.lastName !== 'unknown' ? (
                            <Typography>
                              {item?.firstName} {item?.lastName}
                            </Typography>
                          ) : (
                            <Typography>Unknown</Typography>
                          )}

                          <Typography fontSize="15px" fontWeight="500">
                            {item.roleName}
                          </Typography>
                        </Box>
                      </Stack>
                    </div>
                  ) : (
                    ''
                  )}
                </>
              ))}
          </Box>
        </Box>
        <Box bgcolor="#fff" borderRadius="10px" flex={1}>
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
                          src={`${isActiveUser?.imgUrl}`}
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
                                  <Typography color='#fff' sx={{ lineHeight: 1.3, letterSpacing: 0 }}>
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
                                  <Typography color='#000' sx={{ lineHeight: 1.3, letterSpacing: 0 }}>
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
        </Box>
      </Box>
    </Box>
  )
}

export default Chat
