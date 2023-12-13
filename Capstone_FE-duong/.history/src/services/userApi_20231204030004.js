import { toast } from 'react-toastify'
import { changePaswordFailed, changePaswordStart, changePaswordSuccess, changeRoleAccountFailed, changeRoleAccountStart, changeRoleAccountSuccess, changeUserStatusFailed, changeUserStatusStart, changeUserStatusSuccess, getUserInfoFailed, getUserInfoStart, getUserInfoSuccess, updateProfileFailed, updateProfileStart, updateProfileSuccess } from '../redux/userSlice'
import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'
const userApi = {
  changePassword: async (data, dispatch) => {
    dispatch(changePaswordStart())
    try {
      await axiosClient.post(`${BASE_URL}/changePassword`, data)
      dispatch(changePaswordSuccess())
      toast.success('Update profile sucessfully!')
    } catch (error) {
      console.log(error)
      dispatch(changePaswordFailed())
    }
  },

  getAllDepartment: () => {
    try {
    const res =  axiosClient.get(`${BASE_URL}/getAllDepartment`)
    return res;
    } catch (error) {
      console.log(error)
    }
  },

  getAllUserByUserId: (data) => {
    try {
    const res =  axiosClient.get(`${BASE_URL}/getUserAccount`, {
      params: {
        userId: data
      }
    })
    return res;
    } catch (error) {
      console.log(error)
    }
  },

  getAllDepartmentManager: () => {
    try {
    const res =  axiosClient.get(`${BASE_URL}/getDepartmentWithManager`)
    return res;
    } catch (error) {
      console.log(error)
    }
  },
  getChangeInfoDetail: (data) => {
    try {
    const res =  axiosClient.post(`${BASE_URL}/getChangeInfoDetail`,data)
    return res;
    } catch (error) {
      console.log(error)
    }
  },

  updateProfile: async (data, dispatch) => {
    dispatch(updateProfileStart())
    try {
      await axiosClient.post(`${BASE_URL}/changeUserInfo`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      dispatch(updateProfileSuccess())
      toast.success('Update profile sucessfully!')
    } catch (error) {
      console.log(error)
      dispatch(updateProfileFailed())
    }
  },
  getUserInfo: async (data, dispatch) => {
    dispatch(getUserInfoStart())
    try {
      const response = await axiosClient.post(`${BASE_URL}/getInfoUser`, data)
      dispatch(getUserInfoSuccess(response))
      return response
      
    } catch (error) {
      if (error.response.status === 404) {
        toast.error('User not found!')
        dispatch(getUserInfoFailed())
      }
    }
  },
  getUserInfo2: async (data) => {

    try {
      const response = await axiosClient.post(`${BASE_URL}/getInfoUser`, data)
      return response
      
    } catch (error) {
      if (error.response.status === 404) {
        toast.error('User not found!')
      }
    }
  },
  getRoleByUserId: async (data) => {
    try {
      const response = await axiosClient.post(`${BASE_URL}/getRoleByUserId`, data)
      return response;
    } catch (error) {
      if (error.response.status === 404) {
        toast.error('User not found!')
      }
    }
  },
  changeUserStatus: async (data, dispatch) => {
    dispatch(changeUserStatusStart())
    try {
      await axiosClient.post(`${BASE_URL}/changeStatusAccount`, data)
      dispatch(changeUserStatusSuccess())
      toast.success('Change status successfully')
    } catch (error) {
      if (error.response.status === 404) {
        toast.error('Status not found!')
        dispatch(changeUserStatusFailed())
      }else if (error.response.status === 409) {
        toast.error(`You can't change status role manager!`)
        dispatch(changeUserStatusFailed())
      }
    }
  },
  changeRoleAccount: async (data, dispatch) => {
    dispatch(changeRoleAccountStart())
    try {
      await axiosClient.post(`${BASE_URL}/changeRoleAccount`, data)
      dispatch(changeRoleAccountSuccess())
      toast.success('Change role successfully')
    } catch (error) {
      if (error.response.status === 404) {
        toast.error('Role not found!')
        dispatch(changeRoleAccountFailed())
      }else if (error.response.status === 400) {
        toast.error('Your department has manager already')
        dispatch(changeRoleAccountFailed())
      }
    }
  },
  createAccount: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/register`, data)
      toast.success('Create account succesfully!')
    } catch (error) {
      if (error.response.status === 404) {
        toast.error('Role not found!')
      }
      if (error.response.status === 400) {
        toast.error('Username already exists!')
      }
      if (error.response.status === 409) {
        toast.error('Your department has manager already!')
      }
    }
  }
  ,
  deleteAccount: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/deleteAccount`, data)
      toast.success('Delete account succesfully!')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Username is null!')
      }
      if (error.response.status === 404) {
        toast.error('Username already exists!')
      }
      if (error.response.status === 500) {
        toast.error('Can not delete!')
      }
    }
  },
  getAllEmployeeByDepartmentId: (data) => {
    try {
      let res =  axiosClient.get(`${BASE_URL}/getAllDepartmentEmployee`,{
        params: {
          department_id: data,
        }
      })
      return res;
    } catch (error) {
      if (error.response.status === 404) {
        toast.error("Error!")
      }
    }
  },
  getManagerByDepartment: (data) => {
    try {
      let res =  axiosClient.get(`${BASE_URL}/getManagerByDepartment`,{
        params: {
          department: data,
        }
      })
      return res;
    } catch (error) {
      toast.error('Error!')
    }
  },
}

export default userApi
