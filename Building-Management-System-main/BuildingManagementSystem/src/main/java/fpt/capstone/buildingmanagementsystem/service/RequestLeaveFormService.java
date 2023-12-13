package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.exception.UnprocessableEntity;
import fpt.capstone.buildingmanagementsystem.mapper.LeaveRequestFormMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.DailyLog;
import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestTicket;
import fpt.capstone.buildingmanagementsystem.model.entity.Ticket;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.LeaveRequestForm;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus;
import fpt.capstone.buildingmanagementsystem.model.request.ApprovalNotificationRequest;
import fpt.capstone.buildingmanagementsystem.model.request.LeaveMessageRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendLeaveFormRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendOtherFormRequest;
import fpt.capstone.buildingmanagementsystem.repository.DailyLogRepository;
import fpt.capstone.buildingmanagementsystem.repository.DepartmentRepository;
import fpt.capstone.buildingmanagementsystem.repository.LateRequestFormRepositoryV2;
import fpt.capstone.buildingmanagementsystem.repository.LeaveRequestFormRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestMessageRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestTicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.TicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.until.Until;
import fpt.capstone.buildingmanagementsystem.validate.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus.ANSWERED;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus.PENDING;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum.LEAVE_REQUEST;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.validateDateFormat;

@Service
public class RequestLeaveFormService {
    @Autowired
    LeaveRequestFormRepository leaveRequestFormRepository;
    @Autowired
    LeaveRequestFormMapper leaveRequestFormMapper;
    @Autowired
    TicketRepository ticketRepository;
    @Autowired
    RequestTicketRepository requestTicketRepository;
    @Autowired
    RequestMessageRepository requestMessageRepository;
    @Autowired
    DepartmentRepository departmentRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    RequestOtherService requestOtherService;

    @Autowired
    AutomaticNotificationService automaticNotificationService;

    @Autowired
    LateRequestFormRepositoryV2 lateRequestFormRepositoryV2;

    @Autowired
    DailyLogService dailyLogService;

    @Autowired
    DailyLogRepository dailyLogRepository;
    @Autowired
    Validate validate;
    public boolean getLeaveFormUser(SendLeaveFormRequest sendLeaveFormRequest) {
        try {
            if (sendLeaveFormRequest.getContent() != null &&
                    sendLeaveFormRequest.getDepartmentId() != null &&
                    sendLeaveFormRequest.getTitle() != null &&
                    sendLeaveFormRequest.getFromDate() != null &&
                    sendLeaveFormRequest.getToDate() != null
            ) {
                if (checkValidate(sendLeaveFormRequest)) {
                    if (validate.checkValidateExistsEvaluate(sendLeaveFormRequest.getUserId(), sendLeaveFormRequest.getFromDate())) {
                        List<User> listUserReceiver = new ArrayList<>();
                        Optional<User> send_user = userRepository.findByUserId(sendLeaveFormRequest.getUserId());
                        Optional<Department> department = departmentRepository.findByDepartmentId(sendLeaveFormRequest.getDepartmentId());
                        if (sendLeaveFormRequest.getReceivedId() != null) {
                            Optional<User> receive_user = userRepository.findByUserId(sendLeaveFormRequest.getReceivedId());
                            listUserReceiver.add(receive_user.get());
                        } else {
                            listUserReceiver = userRepository.findAllByDepartment(department.get());
                        }
                        if (send_user.isPresent() && department.isPresent()) {
                            String id_ticket = "LV_" + Until.generateId();
                            String id_request_ticket = "LV_" + Until.generateId();
                            Ticket ticket = Ticket.builder()
                                    .ticketId(id_ticket)
                                    .topic(LEAVE_REQUEST)
                                    .status(true)
                                    .createDate(Until.generateRealTime())
                                    .updateDate(Until.generateRealTime())
                                    .build();
                            ticketRepository.save(ticket);
                            saveLeaveRequest(sendLeaveFormRequest, send_user, department, id_request_ticket, ticket);
                            for (User receive_user : listUserReceiver) {
                                automaticNotificationService.sendApprovalTicketNotification(new ApprovalNotificationRequest(
                                        ticket.getTicketId(),
                                        send_user.get(),
                                        receive_user,
                                        ticket.getTopic(),
                                        true,
                                        null
                                ));
                            }
                            return true;
                        } else {
                            throw new NotFound("not_found");
                        }
                    } else {
                        throw new UnprocessableEntity("evaluate_existed");
                    }
                } else {
                    throw new BadRequest("date_time_input_wrong");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError | ParseException e) {
            throw new ServerError("fail");
        }
    }

    public boolean getLeaveFormUserExistTicket(SendLeaveFormRequest sendLeaveFormRequest) {
        try {
            if (sendLeaveFormRequest.getContent() != null &&
                    sendLeaveFormRequest.getDepartmentId() != null &&
                    sendLeaveFormRequest.getTitle() != null &&
                    sendLeaveFormRequest.getFromDate() != null &&
                    sendLeaveFormRequest.getToDate() != null &&
                    sendLeaveFormRequest.getTicketId() != null
            ) {
                if (checkValidate(sendLeaveFormRequest)) {
                    Optional<User> send_user = userRepository.findByUserId(sendLeaveFormRequest.getUserId());
                    Optional<Department> department = departmentRepository.findByDepartmentId(sendLeaveFormRequest.getDepartmentId());
                    Optional<Ticket> ticket = ticketRepository.findByTicketId(sendLeaveFormRequest.getTicketId());
                    if (send_user.isPresent() && department.isPresent() && ticket.isPresent()) {
                        String id_request_ticket = "LV_" + Until.generateId();
                        saveLeaveRequest(sendLeaveFormRequest, send_user, department, id_request_ticket, ticket.get());
                        ticketRepository.updateTicketTime(Until.generateRealTime(), sendLeaveFormRequest.getTicketId());
                        return true;
                    } else {
                        throw new NotFound("not_found");
                    }
                } else {
                    throw new BadRequest("date_time_input_wrong");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean getLeaveFormUserExistRequest(SendLeaveFormRequest sendLeaveFormRequest) {
        try {
            if (sendLeaveFormRequest.getContent() != null &&
                    sendLeaveFormRequest.getDepartmentId() != null &&
                    sendLeaveFormRequest.getFromDate() != null &&
                    sendLeaveFormRequest.getToDate() != null &&
                    sendLeaveFormRequest.getRequestId() != null
            ) {
                if (checkValidate(sendLeaveFormRequest)) {
                    Optional<User> send_user = userRepository.findByUserId(sendLeaveFormRequest.getUserId());
                    Optional<Department> department = departmentRepository.findByDepartmentId(sendLeaveFormRequest.getDepartmentId());
                    Optional<RequestTicket> requestTicket = requestTicketRepository.findByRequestId(sendLeaveFormRequest.getRequestId());
                    if (send_user.isPresent() && department.isPresent() && requestTicket.isPresent()) {
                        List<RequestMessage> requestMessageOptional = requestMessageRepository.findByRequest(requestTicket.get());
                        String sender_id = requestMessageOptional.get(0).getSender().getUserId();
                        if (requestMessageOptional.get(0).getReceiver() != null) {
                            String receiverId = requestMessageOptional.get(0).getReceiver().getUserId();
                            if (Objects.equals(sendLeaveFormRequest.getUserId(), sender_id)) {
                                sendLeaveFormRequest.setReceivedId(receiverId);
                            } else {
                                sendLeaveFormRequest.setReceivedId(sender_id);
                            }
                        }
                        RequestStatus status = requestTicket.get().getStatus();
                        if (!status.equals(ANSWERED) && !Objects.equals(sender_id, sendLeaveFormRequest.getUserId())) {
                            requestTicket.get().setStatus(ANSWERED);
                            requestTicketRepository.save(requestTicket.get());
                        }
                        Date time = Until.generateRealTime();
                        saveLeaveMessage(sendLeaveFormRequest, send_user, department, requestTicket.get());
                        ticketRepository.updateTicketTime(time, requestTicket.get().getTicketRequest().getTicketId());
                        requestTicketRepository.updateTicketRequestTime(time, sendLeaveFormRequest.getRequestId());
                        return true;
                    } else {
                        throw new NotFound("not_found");
                    }
                } else {
                    throw new BadRequest("date_time_input_wrong");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }

    private static boolean checkValidate(SendLeaveFormRequest sendLeaveFormRequest) throws ParseException {
        return validateDateFormat(sendLeaveFormRequest.getFromDate()) &&
                validateDateFormat(sendLeaveFormRequest.getToDate());
    }

    private void saveLeaveRequest(SendLeaveFormRequest sendLeaveFormRequest, Optional<User> send_user, Optional<Department> department, String id_request_ticket, Ticket ticket) throws ParseException {
        RequestTicket requestTicket = RequestTicket.builder()
                .requestId(id_request_ticket)
                .createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .status(PENDING)
                .ticketRequest(ticket)
                .title(sendLeaveFormRequest.getTitle())
                .user(send_user.get()).build();
        saveLeaveMessage(sendLeaveFormRequest, send_user, department, requestTicket);
    }

    private void saveLeaveMessage(SendLeaveFormRequest sendLeaveFormRequest, Optional<User> send_user, Optional<Department> department, RequestTicket requestTicket) throws ParseException {
        RequestMessage requestMessage = RequestMessage.builder()
                .createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .sender(send_user.get())
                .request(requestTicket)
                .department(department.get())
                .build();
        if (sendLeaveFormRequest.getReceivedId() != null) {
            Optional<User> receive_user = userRepository.findByUserId(sendLeaveFormRequest.getReceivedId());
            requestMessage.setReceiver(receive_user.get());
        }
        LeaveRequestForm leaveRequestForm = leaveRequestFormMapper.convert(sendLeaveFormRequest);
        leaveRequestForm.setTopic(LEAVE_REQUEST);
        leaveRequestForm.setStatus(false);
        leaveRequestForm.setRequestMessage(requestMessage);
        requestTicketRepository.save(requestTicket);
        requestMessageRepository.save(requestMessage);
        leaveRequestFormRepository.save(leaveRequestForm);
    }

    @Transactional
    public boolean acceptLeaveRequest(String leaveRequestId) {
        LeaveRequestForm leaveRequestForm = leaveRequestFormRepository.findById(leaveRequestId)
                .orElseThrow(() -> new BadRequest("Not_found_leave_id"));

        RequestMessage requestMessage = requestMessageRepository.findById(leaveRequestForm.getRequestMessage().getRequestMessageId())
                .orElseThrow(() -> new BadRequest("Not_found_request_message"));

        RequestTicket requestTicket = requestTicketRepository.findById(requestMessage.getRequest().getRequestId())
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        Ticket ticket = ticketRepository.findById(requestTicket.getTicketRequest().getTicketId())
                .orElseThrow(() -> new BadRequest("Not_found_ticket"));

        SendOtherFormRequest sendOtherFormRequest = SendOtherFormRequest.builder()
                .userId(requestMessage.getReceiver().getUserId())
                .ticketId(ticket.getTicketId())
                .requestId(requestTicket.getRequestId())
                .title("Approve Leave Request")
                .content("Approve Leave Request")
                .departmentId(requestMessage.getDepartment().getDepartmentId())
                .receivedId(requestMessage.getSender().getUserId())
                .build();

        requestOtherService.getOtherFormUserExistRequest(sendOtherFormRequest);
        List<RequestTicket> requestTickets = requestTicketRepository.findByTicketRequest(ticket);

        executeRequestDecision(requestTickets, ticket, sendOtherFormRequest);

        try {
            leaveRequestForm.setStatus(true);
            leaveRequestFormRepository.save(leaveRequestForm);
            requestMessageRepository.saveAndFlush(requestMessage);
            requestTicketRepository.saveAll(requestTickets);
            ticketRepository.saveAndFlush(ticket);
            automaticNotificationService.sendApprovalRequestNotification(
                    new ApprovalNotificationRequest(
                            ticket.getTicketId(),
                            requestMessage.getReceiver(),
                            requestMessage.getSender(),
                            ticket.getTopic(),
                            true,
                            null
                    ));
            updateLeaveRequest(leaveRequestForm.getFromDate(),
                    leaveRequestForm.getToDate(),
                    requestTicket.getUser(),
                    leaveRequestForm.getContent()
            );
            return true;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    @Transactional
    public boolean rejectLeaveRequest(LeaveMessageRequest leaveMessageRequest) {
        LeaveRequestForm roomBookingRequestForm = leaveRequestFormRepository.findById(leaveMessageRequest.getLeaveRequestId())
                .orElseThrow(() -> new BadRequest("Not_found_form"));

        RequestMessage requestMessage = requestMessageRepository.findById(roomBookingRequestForm.getRequestMessage().getRequestMessageId())
                .orElseThrow(() -> new BadRequest("Not_found_request_message"));

        RequestTicket requestTicket = requestTicketRepository.findById(requestMessage.getRequest().getRequestId())
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        Ticket ticket = ticketRepository.findById(requestTicket.getTicketRequest().getTicketId())
                .orElseThrow(() -> new BadRequest("Not_found_ticket"));

        SendOtherFormRequest sendOtherFormRequest = SendOtherFormRequest.builder()
                .userId(requestMessage.getReceiver().getUserId())
                .ticketId(ticket.getTicketId())
                .requestId(requestTicket.getRequestId())
                .title("Reject Leave Request")
                .content(leaveMessageRequest.getContent())
                .departmentId(requestMessage.getDepartment().getDepartmentId())
                .receivedId(requestMessage.getSender().getUserId())
                .build();

        requestOtherService.getOtherFormUserExistRequest(sendOtherFormRequest);

        List<RequestTicket> requestTickets = requestTicketRepository.findByTicketRequest(ticket);

        executeRequestDecision(requestTickets, ticket, sendOtherFormRequest);
        try {
            requestMessageRepository.saveAndFlush(requestMessage);
            requestTicketRepository.saveAll(requestTickets);
            ticketRepository.save(ticket);
            automaticNotificationService.sendApprovalRequestNotification(
                    new ApprovalNotificationRequest(
                            ticket.getTicketId(),
                            requestMessage.getReceiver(),
                            requestMessage.getSender(),
                            ticket.getTopic(),
                            false,
                            leaveMessageRequest.getContent()

                    ));
            return true;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    private void executeRequestDecision(List<RequestTicket> requestTickets, Ticket ticket, SendOtherFormRequest sendOtherFormRequest) {
        RequestAttendanceFromService.executeDuplicate(requestTickets, ticket, sendOtherFormRequest, requestOtherService);
    }

    public void updateLeaveRequest(java.sql.Date fromDate, java.sql.Date toDate, User user, String reason) {
        try {
            List<DailyLog> dailyLogs = dailyLogRepository.getDailyLogsByUserAndFromDateAndToDate(user.getUserId(), fromDate, toDate);
            if (dailyLogs.isEmpty()) return;
            dailyLogs.forEach(dailyLog -> {
                dailyLogService.checkViolate(dailyLog, user, reason);
                dailyLogRepository.save(dailyLog);
            });
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
