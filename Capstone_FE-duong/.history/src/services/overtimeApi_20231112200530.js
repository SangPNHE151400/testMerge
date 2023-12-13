import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'
const overtimeApi = {
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

}

export default overtimeApi