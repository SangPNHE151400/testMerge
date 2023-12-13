import axios from 'axios'
import { loginFailed, loginStart, loginSuccess } from '../redux/authSlice'

import { toast } from 'react-toastify'
import { BASE_URL } from './constraint'

const authApi = {
  loginUser: (data, dispatch) => {
    dispatch(loginStart())
    try {
      axios.post(`${BASE_URL}/login`, data)
      dispatch(loginSuccess(response.data))
      localStorage.setItem('token', response.data.jwtToken)
      
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Password wrong, please try again!')
        dispatch(loginFailed())
      }
      if (error.response.status === 403) {
        toast.error('Your account has blocked!')
        dispatch(loginFailed())
      }
      if (error.response.status === 404) {
        toast.error('Username not found!')
        dispatch(loginFailed())
      }
    }
  },
  resetPassword: async (data) => {
    try {
      await axios.post(`${BASE_URL}/resetPassword`, data)
      toast.success('Your new password will be sent your gmail!')
    } catch (error) {
      console.log(error);
    }
  },
}

export default authApi
