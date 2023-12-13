import { toast } from 'react-toastify'
import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'
const holidayApi = {
  getAllHoliday: () => {
    try {
      const response = axiosClient.get(`${BASE_URL}/listAllHoliday`)
      return response
    } catch (error) {
        console.log(error);   
    }
  },

  createHoliday : async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/saveHoliday`, data)
      toast.success('Create holiday successfully')
      return 1
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("You can't book room before current time")
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      }
    }
  },

  deleteHoliday : async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/deleteHoliday`, data)
      toast.success('Delete holiday successfully')
    } catch (error) {
      console.log(error);
    }
  },

  verifyCode : async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/validateHolidayEmail`, {
        params: {
          user_name: data
        }
      })
    } catch (error) {
      console.log(error);
    }
  },
}

export default holidayApi