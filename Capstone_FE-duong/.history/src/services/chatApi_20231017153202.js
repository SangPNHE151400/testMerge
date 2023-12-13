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
  }
}

export default chatApi
