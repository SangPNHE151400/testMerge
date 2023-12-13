import { toast } from 'react-toastify'
import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'
const holidayApi = {
  getAlltUserInfo: async () => {
    try {
      const response = await axiosClient.get(`${BASE_URL}/getAllUserInfoPending`)
      return response
    } catch (error) {
        console.log(error);   
    }
  },
  acceptUserInfo: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/acceptChangeUserInfo`, data)
      toast.success('Accept User Info Successfully!!')
    } catch (error) {
        console.log(error);
    }
  },
  rejectUserInfo: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/rejectChangeUserInfo`, data)
      toast.success('Reject User Info Successfully!!')
    } catch (error) {
        console.log(error); 
    }
  },
}

export default holidayApi