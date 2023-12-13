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
    BOOK_ROOM_DETAIL: '/book-room-detail/:ticketId',
    NOTIFICATION_LIST_MANAGER: '/notification-list-manager',
    NOTIFICATION_DRAFT_MANAGER: '/notification-draft-manager',
    NOTIFICATION_SEND_MANAGER: '/notification-send-manager',
    NOTIFICATION_RECEIVE_MANAGER: '/notification-receive-manager',
    NOTIFICATION_SCHEDULED_MANAGER: '/notification-schedule-manager',
    NOTIFICATION_SCHEDULED_DEPARTMENT_MANAGER: '/notification-department-manager',
    CHECK_ATTENDACE_MANAGER: '/check-attendance-manager',
    CREATE_EVALUATE: '/create-evaluate/:employee_id/:date',
    UPDATE_EVALUATE: '/update-evaluate/:employee_id/:date',
    ATTENDANCE_LOG_DETAIL: '/attendance-log-detail/:employee_id/:date',
    LOG_MANAGEMENT: '/log-management',
    EMPLOYEE_ATTENDANCE_LOG_LIST: '/emp-attendance-log-list',
    LOG_ATTENDACE_OF_EMP: '/log-attendance-emp/:employee_id',
    EMPLOYEE_ATTENDANCE_DETAIL: 'emp-attendance-detail/:employee_id/:date',
    EMP_LOG_MANAGEMENT:'/emp-log-management'
}

export const EMPLOYEE_PATH = {
    LAYOUT: "/",
    CHECK_ATTENDACE_EMPLOYEE: '/check-attendance-employee',
    REQUEST_LIST_EMPLOYEE: '/request-list-employee',
    NOTIFICATION_LIST_EMPLOYEE: '/notification-list-emp',
    NOTIFICATION_DRAFT_LIST_EMPLOYEE: 'notification-draft-emp',
    NOTIFCAITON_RECEIVE_LIST_EMPLOYEE: 'notification-receive-emp',
    NOTIFICATION_SEND_LIST_EMPLOYEE: 'notification-send-emp',
    NOTIFICATION_SCHEDULED_LIST_EMPLOYEE: 'notification-schedule-emp',
    NOTIFICATION_SCHEDULED_DEPARTMENT_EMPLOYEE: '/notification-department-employee',
    ATTENDANCE_DETAIL: 'attendance-detail/:dailyLogId/:date',
    OVERTIME_LOG: '/overtime-log',
    ATTENDANCE_EVALUATE_REPORT: 'attendence-evaluate-report-emp',
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
    NOTIFICATION_SCHEDULED_DEPARTMENT_HR: '/notification-department-hr',
    EVALUATE_MANAGEMENT:'/view-list-evaluate',
    VIEW_ATTENDANCE_EVALUATE_REPORT: 'view-attendence-evaluate-report-emp/:employee_id',
    VIEW_LOG_ATTENDANCE:'/view-log-attendance/:employee_id/:date',
    ATTENDANCE_LOG_DETAIL:'/attendance-log-detail-hr/:employee_id/:date',
    CHANGE_LOG_DETAIL:'/change-log-detail-hr/:employee_id/:date',

}