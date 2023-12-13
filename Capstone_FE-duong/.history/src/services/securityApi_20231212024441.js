import { toast } from "react-toastify"
import axiosClient from "../utils/axios-config"
import { BASE_URL } from "./constraint"
const securityApi = {
    getListControlLogByDayAndDevice:  (data) => {
        try {
            let res =  axiosClient.post(`${BASE_URL}/getListControlLogByDayAndDevice`, data)
            return res;
        } catch (error) {
            if (error.response.status === 400) {
                toast.error('End time must be greater than start time')
              }
        }
    },
    getListStrangerLogByDayAndDevice:  (data) => {
        try {
            let res =  axiosClient.post(`${BASE_URL}/getListStrangerLogByDayAndDevice`, data)
            return res;
        } catch (error) {
            if (error.response.status === 400) {
                toast.error('End time must be greater than start time')
              }
        }
    },
    listAllDevice: async () => {
        try {
            let res = await axiosClient.get(`${BASE_URL}/listAllDevice`)
            return res;
        } catch (error) {
            console.log(error);
        }
    },
    getControlLogDetail: async (username, controlLogId) => {
        try {
            let res = await axiosClient.get(`${BASE_URL}/getControlLogDetail`,
                {
                    params: {
                        username: username,
                        controlLogId: controlLogId
                    }
                })
            return res;
        } catch (error) {
            console.log(error);
        }
    },
    getAllDevice: async () => {
        try {
            let res = await axiosClient.get(`${BASE_URL}/getAllDevice`)
            return res;
        } catch (error) {
            console.log(error);
        }
    },
    updateDeviceStatus: async (data) => {
        try {
            let res = await axiosClient.post(`${BASE_URL}/updateDeviceStatus`,data)
            return res;
        } catch (error) {
            console.log(error);
        }
    },
    changeRecordStatus: async (data) => {
        try {
            let res = await axiosClient.post(`${BASE_URL}/changeRecordStatus`,data)
            return res;
        } catch (error) {
            console.log(error);
        }
    },
    updateDevice:  (data) => {
        try {
            let res =  axiosClient.post(`${BASE_URL}/updateDevice`,data)
            return res;
        } catch (error) {
         console.log(error);
        }
    },
    getDeviceDetail:  (data) => {
        try {
            let res =  axiosClient.get(`${BASE_URL}/getDeviceDetail`,{
                params :{
                    device_id : data 
                }
            })
            return res;
        } catch (error) {
            console.log(error);
        }
    },
    createDeviceAccount:  (data) => {
        try {
            let res =  axiosClient.post(`${BASE_URL}/createDeviceAccount`,data)
            return res;
        } catch (error) {
         
        }
    },
    // getControlListByAccount: async (username) => {
    //     try {
    //         let res = await axiosClient.get(`${BASE_URL}/getListControlLogByAccount`,
    //             {
    //                 params: {
    //                     username: username,
    //                 }
    //             })
    //         return res;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
    getControlListByAccount: (username) => {
        try {
          const response = axiosClient.get(`${BASE_URL}/getListControlLogByAccount`, {
            params: {
                username: username,
            }
          })
          return response
        } catch (error) {
          if (error.response.status === 404) {
            toast.error("This account hasn't had log yet!")
          }
        }
      },

}

export default securityApi
