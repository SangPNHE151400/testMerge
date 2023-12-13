import axios from 'axios'
import { loginFailed, loginStart, loginSuccess } from '../redux/authSlice'

import { toast } from 'react-toastify'
import { BASE_URL } from './constraint'

const authApi = {
  loginUser: async (data, dispatch, navigate) => {
    dispatch(loginStart())
    try {
      const response = await axios.post(`${BASE_URL}/login`, data)
      dispatch(loginSuccess(response.data))
      localStorage.setItem('token', response.data.jwtToken)
      if (response.data.role === 'admin') {
        navigate('/request-list-admin')
      } else if (response.data.role === 'hr') {
        navigate('/manage-user')
      } else if (response.data.role === 'employee') {
        navigate('/check-attendance-employee')
      } else if (response.data.role === 'manager') {
        navigate('/request-list-manager')
      }
      else if (response.data.role === 'security') {
        navigate('/ticket-list-security')
      }
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
  resetPassword: (data, navigate) => {
    try {
       axios.post(`${BASE_URL}/resetPassword`, data)
      toast.success('Your new password will be sent to your gmail!')
      navigate('/login')
    } catch (error) {
      if (error.response.status === 404) {
        toast.error('Username not found!')
      }
      if (error.response.status === 500) {
        toast.error(`Your account hasn't had gmail yet!`)
      }
      if (error.response.status === 400) {
        toast.error(`Username can't be blank!`)
      }
    }
  },
}

export default authApi
