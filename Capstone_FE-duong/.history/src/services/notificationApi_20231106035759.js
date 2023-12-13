import { toast } from 'react-toastify'
import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'
const notificationApi = {
  createNewNotification: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/saveNewNotification`, data ,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }, 
        onUploadProgress: data => {
          //Set the progress value to show the progress bar
          return Math.round((100 * data.loaded) / data.total)
        }, 
      })
      toast.success('Upload success')
    } catch (error) {
        console.log(error);   
    }
  },

  getNotificationDetailByCreator: async (data) => {
    try {
      const res = await axiosClient.post(`${BASE_URL}/getNotificationDetailByCreator`, data)
      return res
    } catch (error) {
        console.log(error);   
    }
  },
  getNotificationDetailByReceiver: async (data) => {
    try {
      const res = await axiosClient.post(`${BASE_URL}/getNotificationDetailByReceiver`, data)
      return res
    } catch (error) {
        console.log(error);   
    }
  },
  markToRead: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/markToRead`, data)
    } catch (error) {
        console.log(error);   
    }
  },
  markToUnRead: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/markToUnRead`, data)
    } catch (error) {
        console.log(error);   
    }
  },
  setPersonalPriority: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/setPersonalPriority`, data)
    } catch (error) {
        console.log(error);   
    }
  },
  unSetPersonalPriority: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/unsetPersonalPriority`, data)
    } catch (error) {
        console.log(error);   
    }
  },
}

export default notificationApi