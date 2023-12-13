import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'
const overtimeApi = {
    getOvertimeUser: (userId, month, year) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getOvertimeListUser`,{
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
  getOvertimeSystem: (userId, month, year) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getOvertimeSystem`,{
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