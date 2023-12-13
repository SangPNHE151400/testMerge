import { toast } from 'react-toastify'
import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'
const holidayApi = {
  getAllHoliday: async () => {
    try {
      const response = await axiosClient.get(`${BASE_URL}/listAllHoliday`)
      return response
    } catch (error) {
        console.log(error);   
    }
  },
}

export default holidayApi