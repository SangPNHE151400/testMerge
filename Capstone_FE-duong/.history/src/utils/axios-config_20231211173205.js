// api/axiosClient.js
import axios from 'axios'
import { BASE_URL } from '../services/constraint'

// Set up default config for http requests here

// Please have a look at here `https://github.com/axios/axios#request-config` for the full list of configs

const axiosClient = axios.create({
  baseURL: BASE_URL
})

axiosClient.defaults.headers = {
  'Content-Type': 'application/json'
}

axiosClient.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem('token')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  (error) => {
    // Handle errors
    throw error
  }
)
export const axiosPDF = axios.create({
  baseURL: BASE_URL,

  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

export default axiosClient
