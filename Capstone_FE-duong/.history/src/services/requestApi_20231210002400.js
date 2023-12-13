import { toast } from 'react-toastify'
import axiosClient from '../utils/axios-config'
import { BASE_URL } from './constraint'


const requestApi = {
  getAllRequestAndTicket: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getTicketByUser`, {
        params: {
          sender_id: data
        }
      })
      return response
    } catch (error) {
      console.log(error)
    }
  },
  getAllNotibyUserId: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getNotificationByUserId`, {
        params: {
          userId: data
        }
      })
      return response
    } catch (error) {
      console.log(error)
    }
  },

  getAllRequestAndTicketByHr: () => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getTicketHr`)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  getDetailAttendanceMessageById: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getAttendanceMessage/`, {
        params: {
          request_id: data
        }
      })
      return response
    } catch (error) {
      console.log(error)
    }
  },
  getManagerByDepartment: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getManagerByDepartment/`, {
        params: {
          department: data
        }
      })
      return response
    } catch (error) {
      console.log(error)
    }
  },

  getDetailLeaveMessageById: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getLeaveMessage/`, {
        params: {
          request_id: data
        }
      })
      return response
    } catch (error) {
      console.log(error)
    }
  },
  getDetailOverTimeMessageById: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getOverTimeMessage/`, {
        params: {
          request_id: data
        }
      })
      return response
    } catch (error) {
      console.log(error)
    }
  },
  getDetailLateMessageById: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getLateRequestMessage/`, {
        params: {
          request_id: data
        }
      })
      return response
    } catch (error) {
      console.log(error);
    }
  },
  getDetailOutSideWorkMessageById: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getWorkingOutsideMessage/`, {
        params: {
          request_id: data
        }
      })
      return response
    } catch (error) {
      console.log(error);
    }
  },
  getDetailOtherMessageById: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getOtherMessage/`, {
        params: {
          request_id: data
        }
      })
      return response
    } catch (error) {
      console.log(error)
    }
  },

  getTicketDepartment: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getTicketDepartment`, {
        params: {
          department: data
        }
      })
      return response
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Request fail!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      }
    }
  },
  acceptStatutOtherRequest: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/closeOtherRequest`, data)
    } catch (error) {
      console.log(error)
    }
  },

  acceptLeaveRequest: async (data) => {
    let data1 = {
      leaveRequestId: data
    }
    try {
      await axiosClient.post(`${BASE_URL}/acceptLeaveRequest`, data1)
      toast.success('Accept request success')
    } catch (error) {
      console.log(error)
    }
  },
  acceptOtRequest: async (data) => {
    let data1 = {
      overTimeRequestId: data
    }
    try {
      await axiosClient.post(`${BASE_URL}/acceptOvertimeRequest`, data1)
      toast.success('Accept request success')
    } catch (error) {
      console.log(error)
    }
  },

  acceptLateRequest: async (data) => {
    let data1 = {
      lateMessageRequestId: data
    }
    try {
      await axiosClient.post(`${BASE_URL}/acceptLateRequest`, data1)
      toast.success('Accept request success')
    } catch (error) {
      console.log(error)
    }
  },
  acceptOutSideRequest: async (data) => {
    let data1 = {
      workOutsideRequestId: data
    }
    try {
      await axiosClient.post(`${BASE_URL}/acceptWorkingOutside`, data1)
      toast.success('Accept request success')
    } catch (error) {
      console.log(error)
    }
  },
  acceptAttendanceRequest: (data) => {
    let data1 = {
      attendanceRequestId: data
    }
    try {
      const res = axiosClient.post(`${BASE_URL}/acceptAttendanceRequest`, data1)
      toast.success('Accept request success')
      return res
    } catch (error) {
      console.log(error)
    }
  },
  acceptRequest: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/changeReceiveId`, data)
      toast.success('Accept Request success')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Wrong date format or date to must be after date from!')
      }
      if (error.response.status === 404) {
        toast.error('Receiver not found!')
      }
    }
  },

  rejectLeaveRequest:  (data) => {
    try {
       axiosClient.post(`${BASE_URL}/rejectLeaveRequest`, data)
    } catch (error) {
      console.log(error)
    }
  },
  rejectLateRequest: (data) => {
    try {
       axiosClient.post(`${BASE_URL}/rejectLateRequest`, data)
    } catch (error) {
      console.log(error)
    }
  },
  rejectOutSideRequest: (data) => {
    try {
       axiosClient.post(`${BASE_URL}/rejectWorkingOutside`, data)
    } catch (error) {
      console.log(error)
    }
  },
  rejectOvertimeRequest: (data) => {
    try {
     axiosClient.post(`${BASE_URL}/rejectOvertimeRequest`, data)
    } catch (error) {
      console.log(error)
    }
  },

  rejectAttendanceRequest: (data) => {
    try {
      axiosClient.post(`${BASE_URL}/rejectAttendanceRequest`, data)
    } catch (error) {
      console.log(error)
    }
  },

  rejectBookRoomRequest: (data) => {
    try {
      axiosClient.post(`${BASE_URL}/rejectBookRoom`, data)
    } catch (error) {
      console.log(error)
    }
  },
  getReceiveIdAndDepartment: (data) => {
    try {
      const response = axiosClient.post(`${BASE_URL}/getReceiveIdAndDepartmentId`, data)
      return response
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Request fail!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      }
    }
  },
  getAllManagerDepartment: () => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getManagerDepartment`)
      return response
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Request fail!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      }
    }
  },
  requestAttendanceForm: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/requestAttendanceForm`, data)
      toast.success('Send request successfully')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Wrong date format or date to must be after date from')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      } if (error.response.status === 500) {
        toast.error('Can not accept')
      } if (error.response.status === 422) {
        toast.error('Evaluate existed')
      }
    }
  },
  requestAttendanceFormExistTicket: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/requestAttendanceFormExistTicket`, data)
      toast.success('Send request successfully')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Wrong date format or date to must be after date from!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      }
    }
  },
  otherFormExistRequest: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/otherFormExistRequest`, data)
      toast.success('Send Message successfully')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Request fail!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      }
    }
  },
  requestLeaveFormExistTicket: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/requestLeaveFormExistTicket`, data)
      toast.success('Send request successfully')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Wrong date format or date to must be after date from!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      } 
    }
  },
  requestLeaveForm: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/requestLeaveForm`, data)
      toast.success('Send request successfully')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Wrong date format or date to must be after date from!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      } if (error.response.status === 422) {
        toast.error('Evaluate existed')
      }
    }
  },

  requestOverTimeForm: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/overTimeForm`, data)
      toast.success('Send request successfully')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Date from must be after system check in!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      } if (error.response.status === 422) {
        toast.error('Evaluate existed')
      }  if (error.response.status === 409) {
        toast.error('Request overtime is only created for the previous day')
      }
    }
  },
  requestOutSideWorkForm: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/workingOutForm`, data)
      toast.success('Send request successfully')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Date from must be after system check in!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      } if (error.response.status === 422) {
        toast.error('Evaluate existed')
      }
    }
  },
  requestLateForm: async (data, navigate) => {
    try {
      await axiosClient.post(`${BASE_URL}/lateForm`, data)
      toast.success('Send request successfully')
      navigate(-1)
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Wrong date format or date to must be after date from!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      } if (error.response.status === 422) {
        toast.error('Evaluate existed')
      } if (error.response.status === 500) {
        toast.error('Wrong date format')
      }
    }
  },
  requestOtherForm: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/otherForm`, data)
      toast.success('Send request successfully')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Request fail!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      } if (error.response.status === 422) {
        toast.error('Evaluate existed')
      }
    }
  },
  otherFormExistTicket: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/otherFormExistTicket`, data)
      toast.success('Send Message successfully')
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Request fail!')
      }
      if (error.response.status === 404) {
        toast.error('User not found!')
      }
    }
  },
  getAllDepartment: () => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getAllDepartment`)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  getAllRoom: () => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getAllRooms`)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  getAllBookRooms: () => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getPendingAndAcceptedRoom`)
      return response
    } catch (error) {
      console.log(error)
    }
  },
   createRoomBookingTicket : async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/roomBookingForm`, data)
      toast.success('Send request successfully')
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

  getAllRequestAndTicketByAdmin: () => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getTicketAdmin`)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  getAllRequestAndTicketBySecurity: () => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getTicketSecurity`)
      return response
    } catch (error) {
      console.log(error)
    }
  },
  getAllTicketHr: () => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getTicketHr`)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  getRequestDetailByAdmin: (data) => {
    try {
      const response = axiosClient.get(`${BASE_URL}/getRoomBookingMessage`, {
        params: {
          request_id: data
        }
      })
      return response
    } catch (error) {
      console.log(error)
    }
  },

  acceptBookRoom: async (data) => {
    try {
      await axiosClient.put(`${BASE_URL}/acceptBookRoom`, {
        params: {
          room_form_id: data
        }
      })
      toast.success('Accept book room successfully!')
    } catch (error) {
      console.log(error)
    }
  },
  closeTicketAttendence: async (data) => {
    try {
      await axiosClient.post(`${BASE_URL}/acceptChangeUserInfo`, data)
      toast.success('Finish Ticket Success !')
    } catch (error) {
      console.log(error)
    }
  }
}

export default requestApi
