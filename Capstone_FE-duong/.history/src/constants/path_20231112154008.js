export const PUBLIC_PATH = {
    LOGIN: "/login",
    CHANGE_PASSWORD: 'change-password',
    PROFILE: '/profile',
    RESET_PASSWORD: '/reset-password',
    CHAT: '/chat',
    CREATE_REQUEST: '/create-request',
    CREATE_REQUEST_EXISTED: '/create-request-existed/:ticketId',
    NOT_FOUND: '*',
    REQUEST_DETAIL: '/request-detail/:requestId',
    CREATE_NOTIFICATION: '/create-notification',
    NOTIFICATION_DETAIL: '/notification-detail/:notificationId/:creatorId',
    NOTIFICATION_LIST: '/notification-list',
    EDIT_NOTIFICATION: '/edit-notification/:notificationId',
}

export const ADMIN_PATH = {
    LAYOUT: "/",
    REQUEST_LIST_ADMIN: '/request-list-admin',
    BOOK_ROOM_DETAIL: '/room-detail/:ticketId',
    MANAGE_LIST_TICKET_ADMIN: '/manage-list-admin',
    CHECK_BOOK_ROOM: '/check-book-room',
    NOTIFICATION_LIST_ADMIN: '/notification-list-admin',
    NOTIFICATION_DRAFT_ADMIN: '/notification-draft-admin',
    NOTIFICATION_SEND_ADMIN: '/notification-send-admin',
    NOTIFICATION_RECEIVE_ADMIN: '/notification-receive-admin',
    NOTIFICATION_SCHEDULED_ADMIN: '/notification-schedule-admin',
    NOTIFICATION_SCHEDULED_DEPARTMENT_ADMIN: '/notification-department-admin'
}

export const MANAGER_PATH = {
    LAYOUT: "/",
    MANAGE_LIST_TICKET_MANAGER: '/request-list-manager',
    REQUEST_LIST_MANAGER: '/request-manager-list',
    BOOK_ROOM_MANAGER: '/book-room-manager',
    BOOK_ROOM_DETAIL_MANAGER: '/book-room-detail-manager/:ticketId',
    NOTIFICATION_LIST_MANAGER: '/notification-list-manager',
    NOTIFICATION_DRAFT_MANAGER: '/notification-draft-manager',
    NOTIFICATION_SEND_MANAGER: '/notification-send-manager',
    NOTIFICATION_RECEIVE_MANAGER: '/notification-receive-manager',
    NOTIFICATION_SCHEDULED_MANAGER: '/notification-schedule-manager',
    NOTIFICATION_SCHEDULED_DEPARTMENT_MANAGER: '/notification-department-manager',
}

export const EMPLOYEE_PATH = {
    LAYOUT: "/",
    CHECK_ATTENDACE: '/check-attendance',
    REQUEST_LIST_EMPLOYEE: '/request-list-employee',
    NOTIFICATION_LIST_EMPLOYEE: '/notification-list-emp',
    NOTIFICATION_DRAFT_LIST_EMPLOYEE: 'notification-draft-emp',
    NOTIFCAITON_RECEIVE_LIST_EMPLOYEE: 'notification-receive-emp',
    NOTIFICATION_SEND_LIST_EMPLOYEE: 'notification-send-emp',
    NOTIFICATION_SCHEDULED_LIST_EMPLOYEE: 'notification-schedule-emp',
    NOTIFICATION_SCHEDULED_DEPARTMENT_EMPLOYEE: '/notification-department-employee',
    ATTENDANCE_DETAIL: 'attendance-detail/:dailyLogId/:date',
    OVERTIME_LOG: '/overtime-log'
}

export const HR_PATH = {
    LAYOUT: "/",
    MANAGE_USER: "/manage-user",
    MANAGE_PROFILE: '/manage-profile',
    REQUEST_HR_LIST: '/request-hr-list',
    REQUEST_LIST_HR: '/request-list-hr',
    BOOK_ROOM_HR: '/book-room-hr',
    NOTIFICATION_LIST_HR: '/notification-list-hr',
    NOTIFICATION_UPLOAD_SENT_HR: 'notification-uploadsent',
    NOTIFICATION_UPLOAD_RECEIVE_HR: 'notification-uploadreceive',
    NOTIFICATION_DRAFT_LIST_HR: 'notification-draftlist',
    NOTIFICATION_SCHEDULED_LIST_HR: 'notification-schedulelist',
    NOTIFICATION_SCHEDULED_DEPARTMENT_HR: '/notification-department-hr'

}