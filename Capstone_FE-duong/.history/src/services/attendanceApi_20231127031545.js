import { toast } from 'react-toastify'
import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'
const attendanceApi = {
  getAttendanceUser: (userId, month, year) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getAttendanceUser`, {
        params: {
          user_id: userId,
          month: month,
          year: year
        }
      })
      return response
    } catch (error) {
      console.log(error);
    }
  },
  createEvaluate: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/createEvaluate`, data)
      toast.success('Create evaluate success')
    } catch (error) {
      if (error.response.status === 409) {
        toast.error('Evaluate existed')
      }
    }
  },

  getCreatedDate: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getCreatedDate`, {
        params: {
          accountId: data,
        }
      })
      return response
    } catch (error) {
      console.log(error);
    }
  },

  getAttendanceUserDetail: (userId, date) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getAttendanceUserDetail`, {
        params: {
          user_id: userId,
          date: date
        }
      })
      return response
    } catch (error) {
      console.log(error);
    }
  },

  getEvaluate: async (data) => {
    try {
      const response = await axiosClient.post(`${BASE_URL}/getEvaluate`, data)
      return response
    } catch (error) {
      console.log(error);
    }
  },

  getIndividualEvaluate: async (data) => {
    try {
      const response = await axiosClient.post(`${BASE_URL}/getIndividualEvaluate`, data)
      return response
    } catch (error) {
      console.log(error);
    }
  },
}

export default attendanceApi