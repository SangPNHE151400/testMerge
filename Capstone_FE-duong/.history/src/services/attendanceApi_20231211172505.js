import { toast } from 'react-toastify'
import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'
import axios from 'axios'
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
      if (error.response.status === 404) {
        toast.error("This account hasn't had log yet!")
      }
    }
  },
  createEvaluate: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/createEvaluate`, data)
      toast.success('Create evaluate successfully')
    } catch (error) {
      if (error.response.status === 409) {
        toast.error('Evaluate existed')
      }
    }
  },
  updateEvaluate: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/updateEvaluateRecord`, data)
      toast.success('Update evaluate successfully')
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
          accountId: data
        }
      })
      return response
    } catch (error) {
      console.log(error)
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
      console.log(error)
    }
  },
  getChangeLogsInDay: (employeeId, date) => {
    let data = {
      employeeId: employeeId,
      date: date
    }
    try {
      const response = axiosClient.post(`${BASE_URL}/getChangeLogsInDay`, data)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  getEvaluate: async (data) => {
    try {
      const response = await axiosClient.post(`${BASE_URL}/getEvaluate`, data)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  getIndividualEvaluate: (data) => {
    try {
      const response = axiosClient.post(`${BASE_URL}/getIndividualEvaluate`, data)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  // checkEvaluateExisted: (data) => {
  //   try {
  //     const response = axiosClient.post(`${BASE_URL}/getIndividualEvaluate`, data)
  //     return response
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },

  checkEvaluateExisted: (employee_id, month, year) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/checkEvaluateExisted`, {
        params: {
          employee_id: employee_id,
          month: month,
          year: year
        }
      })
      return response
    } catch (error) {
      console.log(error)
    }
  },

  exportAttendanceUserDetail: (user_id, date) => {
    try {
      const response = axiosClient.get(
        `${BASE_URL}/exportAttendanceUserDetail`,
        {
          params: {
            user_id: user_id,
            date: date
          }
        },
      )
      return response
    } catch (error) {
      console.log(error)
    }
  }
}

export default attendanceApi
