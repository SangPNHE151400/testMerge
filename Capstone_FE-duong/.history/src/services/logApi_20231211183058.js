import { toast } from 'react-toastify'
import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'

const logApi = {
  getChangeLogByEmployeeAndMonth: (data) => {
    try {
      const response = axiosClient.post(`${BASE_URL}/getChangeLogByEmployeeAndMonth`, data)
      return response
    } catch (error) {
      toast.error("Fetch Error")
    }
  },
  getEvaluateOfDepartment: async (departmentId, month, year) => {
    try {
      const response = await axiosClient.get('/getDepartmentEvaluate', {
        params: {
           department_id: departmentId,
            month: month,
            year: year,
        },
    });
      return response;
    } catch (error) {
      console.error('Error fetching department evaluation:', error);
      throw error; 
    }
  },
  getAllEvaluateAcceptedOfEmp: async (user_id) => {
    try {
      const response = await axiosClient.get('/getAllEvaluateOfEmployee', {
        params: {
          user_id: user_id,
        },
    });
      return response;
    } catch (error) {
      console.error('Error fetching department evaluation:', error);
      throw error; 
    }
  },


  getChangeLogDetail: async (employee_id, date, change_log_id) => {
    try {
      const response = await axiosClient.get(`${BASE_URL}/getChangeLogDetail`, {
        params: {
          employee_id: employee_id,
          date: date, 
          change_log_id: change_log_id
        }
      })
      return response
    } catch (error) {
      toast.error("Fetch Error")
    }
  },
  editEmpLog: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/changeUserInfo`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Update user info sucessfully!')
    } catch (error) {
      console.log(error)
    }
  },
}

export default logApi
