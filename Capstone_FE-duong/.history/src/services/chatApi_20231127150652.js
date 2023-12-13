import { toast } from 'react-toastify'
import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'

const chatApi = {
  sendMessage: async (data) => {
    try {
      const response = await axiosClient.post(`${BASE_URL}/chat`, data)
      return response
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('User not found!')
      }
    }
  },
  createNewChat: (data) => {
    try {
      const res = axiosClient.post(`${BASE_URL}/createNewChat`, data)
      toast.success('Create new Chat successfully!!!!')
      return res
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('User not found!')
      }
    }
  },
  updateChat: (data) => {
    try {
      const res = axiosClient.post(`${BASE_URL}/updateChat`, data)
      toast.success('Update Chat successfully!!!!')
      return res
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('User not found!')
      }
    }
  },
  markReadChat:  (data) => {
    try {
     axiosClient.post(`${BASE_URL}/readChat`, data)
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('User not found!')
      }
    }
  },
  createNewTextMessage: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/createNewMessage`, data)
      toast.success('Create new message successfully!!!!')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('User not found!')
      }
    }
  },
  createNewImageMessage: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/createNewMessage2`, data)
      toast.success('Create new message successfully!!!!')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('User not found!')
      }
    }
  },
  getUserSingleChat:  (data) => {
    try {
      const res = axiosClient.post(`${BASE_URL}/getAllChatUserSingle`, data)
      return res
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('User not found!')
      }
    }
  },
  getAllChatList:  (data) => {
    try {
      const res = axiosClient.post(`${BASE_URL}/getAllChat`, data)
      return res
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('User not found!')
      }
    }
  }
}

export default chatApi
