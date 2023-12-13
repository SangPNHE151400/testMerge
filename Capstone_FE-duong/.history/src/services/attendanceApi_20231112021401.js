import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'
const attendanceApi = {
    getAttendanceUser: (userId, month, year) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getAttendanceUser`,{
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

  getCreatedDate: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getCreatedDate`,{
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
      const response = axiosClient.get(`${BASE_URL}/getAttendanceUserDetail`,{
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

}

export default attendanceApi