import { Suspense, lazy } from 'react'
import { useRoutes } from 'react-router-dom'
import BookRoom from '../components/BookRoom'
import NotFoundPage from '../components/NotFoundPage'
import RequireAuth from '../components/RequireAuth'
import UnAuthorized from '../components/UnAuthorized'
import { ADMIN_PATH, EMPLOYEE_PATH, HR_PATH, MANAGER_PATH, PUBLIC_PATH } from '../constants/path'
import { ROLES } from '../constants/role'
import AdminLayout from '../layouts/admin'
import EmployeeLayout from '../layouts/employee'
import HrLayout from '../layouts/hr'
import ManagerLayout from '../layouts/manager'
import ListNotficationDepartmentAdmin from '../pages/admin/admin-notification-department'
import ListNotificationDraftAdmin from '../pages/admin/admin-notification-draft'
import ListAllNotificationAdmin from '../pages/admin/admin-notification-list-all'
import ListNotificationReceiveAdmin from '../pages/admin/admin-notification-receive'
import ListNotificationScheduleAdmin from '../pages/admin/admin-notification-scheduled'
import ListNotificationSendAdmin from '../pages/admin/admin-notification-send'
import CheckBookRoom from '../pages/admin/check-book-room'
import ManageTicketListAdmin from '../pages/admin/manage-ticket-list'
import Login from '../pages/auth/login/login'
import ResetPassword from '../pages/auth/resetpassword'
import AdminChanagePassword from '../pages/common/change-password'
import Chat from '../pages/common/chat'
import CreateNotification from '../pages/common/create-notification'
import CreateTicketRequest from '../pages/common/create-request'
import CreateTicketExistRequest from '../pages/common/create-request-exist'
import EditNotification from '../pages/common/edit-notification'
import NotificationsList from '../pages/common/list-all-notification'
import Profile from '../pages/common/profile'
import CheckAttendance from '../pages/employee/check-attendance'
import ListNotificationDarfEmp from '../pages/employee/employee-notification-draft'
import ListAllNotificationEmp from '../pages/employee/employee-notification-list-all'
import ListNoitificationRecive from '../pages/employee/employee-notification-recive'
import ListNOtificationSchedulePersonal from '../pages/employee/employee-notification-schedule'
import ListNotificationSend from '../pages/employee/employee-notification-send'
import RequestListEmployee from '../pages/employee/request-list'
import BookRoomHr from '../pages/hr/book-room-hr'
import CheckHrList from '../pages/hr/check-hr-ticket'
import ListNotificationDepartmentHR from '../pages/hr/hr-notification-deparment'
import NotificationDraftListHr from '../pages/hr/hr-notification-draft-list'
import NotificationsHrList from '../pages/hr/hr-notification-list'
import NotificationScheduleListHr from '../pages/hr/hr-notification-scheduled-list'
import NotificationUploadReceiveHR from '../pages/hr/hr-notification-upload-receive'
import NotificationUploadSentHR from '../pages/hr/hr-notification-upload-sent'
import ManageProfile from '../pages/hr/manage-profile'
import RequestListHr from '../pages/hr/request-list'
import BookRoomManager from '../pages/manager/book-room-manager'
import ListNotifcationDeparmentManager from '../pages/manager/manager-notification-deparment'
import ListAllNotificationDraftManager from '../pages/manager/manager-notification-draft'
import ListAllNotificationManager from '../pages/manager/manager-notification-list-all'
import ListAllNotificationReceiveManager from '../pages/manager/manager-notification-receive'
import ListAllNotificationScheduleManager from '../pages/manager/manager-notification-schedule'
import ListAllNotificationSendManager from '../pages/manager/manager-notification-send'
import RequestListManager from '../pages/manager/request-list'
import RequestManagerList from '../pages/manager/request-manager-list'
import BookListDetailManager from '../pages/manager/request-manager-list/components/BookRoomDetail'
import AttendanceDetail from '../pages/employee/attendance-detail'
const ManageUser = lazy(() => import('../pages/hr/manage-user'))
const NotificationDetail = lazy(() => import('../pages/common/notification-detail'))
const TicketDetail = lazy(() => import('../pages/common/request-detail'))
const RequestListAdmin = lazy(() => import('../pages/admin/request-list'))
const BookListDetail = lazy(() => import('../pages/admin/manage-ticket-list/components/BookRoomDetail'))
export default function Router() {
  let router = useRoutes([
    {
      path: PUBLIC_PATH.LOGIN,
      element: <Login />
    },
    {
      path: PUBLIC_PATH.CHANGE_PASSWORD,
      element: <AdminChanagePassword />
    },
    {
      path: PUBLIC_PATH.PROFILE,
      element: <Profile />
    },
    {
      path: PUBLIC_PATH.RESET_PASSWORD,
      element: <ResetPassword />
    },
    {
      path: PUBLIC_PATH.CHAT,
      element: <Chat />
    },
    {
      path: '/unauthorized',
      element: <UnAuthorized />
    },
    {
      path: PUBLIC_PATH.CREATE_REQUEST,
      element: <CreateTicketRequest />
    },
    {
      path: PUBLIC_PATH.CREATE_REQUEST_EXISTED,
      element: <CreateTicketExistRequest />
    },
    {
      path: PUBLIC_PATH.REQUEST_DETAIL,
      element: (
        <Suspense fallback={<>Loading...</>}>
          <TicketDetail />
        </Suspense>
      )
    },
    {
      path: PUBLIC_PATH.NOTIFICATION_LIST,
      element: (
        <Suspense fallback={<>Loading...</>} >
          <NotificationsList />
        </Suspense>
      )
    },
    {
      path: PUBLIC_PATH.NOT_FOUND,
      element: <NotFoundPage />
    },

    {
      path: ADMIN_PATH.LAYOUT,
      element: <AdminLayout />,
      children: [
        {
          element: <RequireAuth allowedRoles={ROLES.ADMIN} />,
          children: [
            {
              path: ADMIN_PATH.REQUEST_LIST_ADMIN,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <RequestListAdmin />
                </Suspense>
              )
            },
            {
              path: ADMIN_PATH.MANAGE_LIST_TICKET_ADMIN,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ManageTicketListAdmin />
                </Suspense>
              )
            },
            {
              path: ADMIN_PATH.CHECK_BOOK_ROOM,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <CheckBookRoom />
                </Suspense>
              )
            }
            ,
            {
              path: ADMIN_PATH.NOTIFICATION_LIST_ADMIN,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListAllNotificationAdmin />
                </Suspense>
              )
            }
            ,
            {
              path: ADMIN_PATH.NOTIFICATION_DRAFT_ADMIN,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListNotificationDraftAdmin />
                </Suspense>
              )
            }
            ,
            {
              path: ADMIN_PATH.NOTIFICATION_SEND_ADMIN,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListNotificationSendAdmin />
                </Suspense>
              )
            }
            ,
            {
              path: ADMIN_PATH.NOTIFICATION_RECEIVE_ADMIN,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListNotificationReceiveAdmin />
                </Suspense>
              )
            }
            ,
            {
              path: ADMIN_PATH.NOTIFICATION_SCHEDULED_ADMIN,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListNotificationScheduleAdmin />
                </Suspense>
              )
            },
            {
              path: ADMIN_PATH.NOTIFICATION_SCHEDULED_DEPARTMENT_ADMIN,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListNotficationDepartmentAdmin />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: '/',
      element: <RequireAuth allowedRoles={ROLES.ADMIN} />,
      children: [
        {
          path: ADMIN_PATH.BOOK_ROOM_DETAIL,
          element: (
            <Suspense fallback={<>Loading...</>}>
              <BookListDetail />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '/',
      element: <RequireAuth allowedRoles={ROLES.MANAGER} />,
      children: [
        {
          path: MANAGER_PATH.BOOK_ROOM_DETAIL_MANAGER,
          element: (
            <Suspense fallback={<>Loading...</>}>
              <BookListDetailManager />
            </Suspense>
          )
        }
      ]
    },
    {
      path: HR_PATH.LAYOUT,
      element: <HrLayout />,
      children: [
        {
          element: <RequireAuth allowedRoles={ROLES.HR} />,
          children: [
            {
              path: HR_PATH.MANAGE_USER,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ManageUser />
                </Suspense>
              )
            },

            {
              path: HR_PATH.MANAGE_PROFILE,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ManageProfile />
                </Suspense>
              )
            },
            {
              path: HR_PATH.REQUEST_LIST_HR,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <RequestListHr />
                </Suspense>
              )
            }, {
              path: HR_PATH.REQUEST_HR_LIST,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <CheckHrList />
                </Suspense>
              )
            },
            {
              path: HR_PATH.NOTIFICATION_LIST_HR,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <NotificationsHrList />
                </Suspense>
              )
            },
            {
              path: HR_PATH.NOTIFICATION_UPLOAD_RECEIVE_HR,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <NotificationUploadReceiveHR />
                </Suspense>
              )
            },
            {
              path: HR_PATH.NOTIFICATION_UPLOAD_SENT_HR,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <NotificationUploadSentHR />
                </Suspense>
              )
            },
            {
              path: HR_PATH.NOTIFICATION_DRAFT_LIST_HR,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <NotificationDraftListHr />
                </Suspense>
              )
            },
            {
              path: HR_PATH.NOTIFICATION_SCHEDULED_LIST_HR,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <NotificationScheduleListHr />
                </Suspense>
              )
            },
            {
              path: HR_PATH.NOTIFICATION_SCHEDULED_DEPARTMENT_HR,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListNotificationDepartmentHR />
                </Suspense>
              )
            },
            {
              path: HR_PATH.BOOK_ROOM_HR,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <BookRoomHr />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: EMPLOYEE_PATH.LAYOUT,
      element: <EmployeeLayout />,
      children: [
        {
          element: <RequireAuth allowedRoles={ROLES.EMPLOYEE} />,
          children: [
            {
              path: EMPLOYEE_PATH.CHECK_ATTENDACE,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <CheckAttendance />
                </Suspense>
              )
            },
            {
              path: EMPLOYEE_PATH.REQUEST_LIST_EMPLOYEE,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <RequestListEmployee />
                </Suspense>
              )
            },
            {
              path: EMPLOYEE_PATH.NOTIFICATION_LIST_EMPLOYEE,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListAllNotificationEmp />
                </Suspense>
              )
            },
            {
              path: EMPLOYEE_PATH.NOTIFICATION_DRAFT_LIST_EMPLOYEE,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListNotificationDarfEmp />
                </Suspense>
              )
            },
            {
              path: EMPLOYEE_PATH.NOTIFCAITON_RECEIVE_LIST_EMPLOYEE,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListNoitificationRecive />
                </Suspense>
              )
            },
            {
              path: EMPLOYEE_PATH.NOTIFICATION_SEND_LIST_EMPLOYEE,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListNotificationSend />
                </Suspense>
              )
            },
            {
              path: EMPLOYEE_PATH.NOTIFICATION_SCHEDULED_LIST_EMPLOYEE,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListNOtificationSchedulePersonal />
                </Suspense>
              )
            },
          ]
        }
      ]
    },

    {
      path: '/',
      children: [
        {
          element: (
            <RequireAuth allowedRoles={[ROLES.MANAGER, ROLES.EMPLOYEE]} />
          ),
          children: [
            {
              path: EMPLOYEE_PATH.ATTENDANCE_DETAIL,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <AttendanceDetail />
                </Suspense>
              )
            }
          ]
        },
      ]
    },

    {
      path: MANAGER_PATH.LAYOUT,
      element: <ManagerLayout />,
      children: [
        {
          element: <RequireAuth allowedRoles={ROLES.MANAGER} />,
          children: [
            {
              path: MANAGER_PATH.MANAGE_LIST_TICKET_MANAGER,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <RequestListManager />
                </Suspense>
              )
            },
            {
              path: MANAGER_PATH.REQUEST_LIST_MANAGER,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <RequestManagerList />
                </Suspense>
              )
            },
            {
              path: MANAGER_PATH.NOTIFICATION_LIST_MANAGER,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListAllNotificationManager />
                </Suspense>
              )
            },
            {
              path: MANAGER_PATH.NOTIFICATION_DRAFT_MANAGER,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListAllNotificationDraftManager />
                </Suspense>
              )
            },
            {
              path: MANAGER_PATH.NOTIFICATION_SEND_MANAGER,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListAllNotificationSendManager />
                </Suspense>
              )
            },
            {
              path: MANAGER_PATH.NOTIFICATION_RECEIVE_MANAGER,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListAllNotificationReceiveManager />
                </Suspense>
              )
            },
            {
              path: MANAGER_PATH.NOTIFICATION_SCHEDULED_MANAGER,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListAllNotificationScheduleManager />
                </Suspense>
              )
            },
            {
              path: MANAGER_PATH.NOTIFICATION_SCHEDULED_DEPARTMENT_MANAGER,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <ListNotifcationDeparmentManager />
                </Suspense>
              )
            },
          ]
        },
        {
          path: MANAGER_PATH.BOOK_ROOM_MANAGER,
          element: (
            <Suspense fallback={<>Loading...</>}>
              <BookRoomManager />
            </Suspense>
          )
        },
      ]
    },
    {
      path: '/',
      children: [
        {
          element: (
            <RequireAuth allowedRoles={[ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.HR]} />
          ),
          children: [
            {
              path: PUBLIC_PATH.REQUEST_DETAIL,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <TicketDetail />
                </Suspense>
              )
            }
          ]
        },
        {
          path: PUBLIC_PATH.BOOK_ROOM,
          element: <BookRoom />
        }
      ]
    },
    {
      path: '/',
      children: [
        {
          element: (
            <RequireAuth allowedRoles={[ROLES.MANAGER, ROLES.SECURITY, ROLES.ADMIN, ROLES.HR]} />
          ),
          children: [
            {
              path: PUBLIC_PATH.CREATE_NOTIFICATION,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <CreateNotification />
                </Suspense>
              )
            },
            {
              path: PUBLIC_PATH.EDIT_NOTIFICATION,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <EditNotification />
                </Suspense>
              )
            },
          ]
        },
      ]
    },
    {
      path: '/',
      children: [
        {
          element: (
            <RequireAuth allowedRoles={[ROLES.MANAGER, ROLES.SECURITY, ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE]} />
          ),
          children: [
            {
              path: PUBLIC_PATH.NOTIFICATION_DETAIL,
              element: (
                <Suspense fallback={<>Loading...</>}>
                  <NotificationDetail />
                </Suspense>
              )
            }
          ]
        },
      ]
    }
  ])

  return router
}
