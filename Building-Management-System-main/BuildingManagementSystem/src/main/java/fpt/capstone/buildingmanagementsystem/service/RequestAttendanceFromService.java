package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.exception.UnprocessableEntity;
import fpt.capstone.buildingmanagementsystem.mapper.AttendanceRequestFormMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.*;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.AttendanceRequestForm;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus;
import fpt.capstone.buildingmanagementsystem.model.request.ApprovalNotificationRequest;
import fpt.capstone.buildingmanagementsystem.model.request.AttendanceMessageRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendAttendanceFormRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendOtherFormRequest;
import fpt.capstone.buildingmanagementsystem.model.response.NotificationAcceptResponse;
import fpt.capstone.buildingmanagementsystem.repository.*;
import fpt.capstone.buildingmanagementsystem.until.Until;
import fpt.capstone.buildingmanagementsystem.validate.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.text.ParseException;
import java.util.*;

import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus.ANSWERED;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus.PENDING;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum.ATTENDANCE_REQUEST;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.*;

@Service
public class RequestAttendanceFromService {
    @Autowired
    AttendanceRequestFormMapper attendanceRequestFormMapper;
    @Autowired
    AttendanceRequestFormRepository attendanceRequestFormRepository;
    @Autowired
    TicketRepositoryv2 ticketRepositoryv2;
    @Autowired
    RequestTicketRepository requestTicketRepository;
    @Autowired
    RequestMessageRepository requestMessageRepository;
    @Autowired
    DepartmentRepository departmentRepository;
    @Autowired
    UserRepository userRepository;

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    RequestOtherService requestOtherService;

    @Autowired
    AutomaticNotificationService automaticNotificationService;

    @Autowired
    AttendanceService attendanceService;
    @Autowired
    Validate validate;

    public boolean getAttendanceUser(SendAttendanceFormRequest sendAttendanceFormRequest) {
        try {
            if (sendAttendanceFormRequest.getContent() != null &&
                    sendAttendanceFormRequest.getDepartmentId() != null &&
                    sendAttendanceFormRequest.getManualDate() != null &&
                    sendAttendanceFormRequest.getTitle() != null
            ) {
                if (checkValidate(sendAttendanceFormRequest)) {
                    if (validate.checkValidateExistsEvaluate(sendAttendanceFormRequest.getUserId(), sendAttendanceFormRequest.getManualDate())) {
                        Optional<User> send_user = userRepository.findByUserId(sendAttendanceFormRequest.getUserId());
                        Optional<Department> department = departmentRepository.findByDepartmentId(sendAttendanceFormRequest.getDepartmentId());
                        List<User> listUserReceiver = new ArrayList<>();
                        if (sendAttendanceFormRequest.getReceivedId() != null) {
                            Optional<User> receive_user = userRepository.findByUserId(sendAttendanceFormRequest.getReceivedId());
                            listUserReceiver.add(receive_user.get());
                        } else {
                            listUserReceiver = userRepository.findAllByDepartment(department.get());
                        }
                        if (send_user.isPresent() && department.isPresent()) {
                            String id_ticket = "AT_" + Until.generateId();
                            String id_request_ticket = "AT_" + Until.generateId();
                            Ticket ticket = Ticket.builder().ticketId(id_ticket).topic(ATTENDANCE_REQUEST).status(true).createDate(Until.generateRealTime())
                                    .updateDate(Until.generateRealTime()).build();
                            ticketRepository.save(ticket);
                            saveAttendanceRequest(sendAttendanceFormRequest, send_user, department, id_request_ticket, ticket);
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

    public boolean getAttendanceUserExistTicket(SendAttendanceFormRequest sendAttendanceFormRequest) {
        try {
            if (sendAttendanceFormRequest.getContent() != null &&
                    sendAttendanceFormRequest.getDepartmentId() != null &&
                    sendAttendanceFormRequest.getManualDate() != null &&
                    sendAttendanceFormRequest.getTitle() != null &&
                    sendAttendanceFormRequest.getTicketId() != null
            ) {
                if (checkValidate(sendAttendanceFormRequest)) {
                    Optional<User> send_user = userRepository.findByUserId(sendAttendanceFormRequest.getUserId());
                    Optional<Department> department = departmentRepository.findByDepartmentId(sendAttendanceFormRequest.getDepartmentId());
                    Optional<Ticket> ticket = ticketRepository.findByTicketId(sendAttendanceFormRequest.getTicketId());
                    if (send_user.isPresent() && department.isPresent() && ticket.isPresent()) {
                        String id_request_ticket = "AT_" + Until.generateId();
                        saveAttendanceRequest(sendAttendanceFormRequest, send_user, department, id_request_ticket, ticket.get());
                        ticketRepository.updateTicketTime(Until.generateRealTime(), sendAttendanceFormRequest.getTicketId());
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
        } catch (ServerError | ParseException e) {
            throw new ServerError("fail");
        }
    }

    public boolean getAttendanceUserExistRequest(SendAttendanceFormRequest sendAttendanceFormRequest) {
        try {
            if (sendAttendanceFormRequest.getContent() != null &&
                    sendAttendanceFormRequest.getDepartmentId() != null &&
                    sendAttendanceFormRequest.getManualDate() != null &&
                    sendAttendanceFormRequest.getRequestId() != null
            ) {
                if (checkValidate(sendAttendanceFormRequest)) {

                    Optional<User> send_user = userRepository.findByUserId(sendAttendanceFormRequest.getUserId());
                    Optional<Department> department = departmentRepository.findByDepartmentId(sendAttendanceFormRequest.getDepartmentId());
                    Optional<RequestTicket> request = requestTicketRepository.findByRequestId(sendAttendanceFormRequest.getRequestId());
                    if (send_user.isPresent() && department.isPresent() && request.isPresent()) {
                        List<RequestMessage> requestMessageOptional = requestMessageRepository.findByRequest(request.get());
                        String senderId = requestMessageOptional.get(0).getSender().getUserId();
                        if (requestMessageOptional.get(0).getReceiver() != null) {
                            String receiverId = requestMessageOptional.get(0).getReceiver().getUserId();
                            if (Objects.equals(sendAttendanceFormRequest.getUserId(), senderId)) {
                                sendAttendanceFormRequest.setReceivedId(receiverId);
                            } else {
                                sendAttendanceFormRequest.setReceivedId(senderId);
                            }
                        }
                        RequestStatus status = request.get().getStatus();
                        if (!status.equals(ANSWERED) && !Objects.equals(senderId, sendAttendanceFormRequest.getUserId())) {
                            request.get().setStatus(ANSWERED);
                            requestTicketRepository.save(request.get());
                        }
                        saveAttendanceMessage(sendAttendanceFormRequest, send_user, department, request.get());
                        Date time = Until.generateRealTime();
                        ticketRepository.updateTicketTime(time, request.get().getTicketRequest().getTicketId());
                        requestTicketRepository.updateTicketRequestTime(time, sendAttendanceFormRequest.getRequestId());
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
        } catch (ServerError | ParseException e) {
            throw new ServerError("fail");
        }
    }

    private static boolean checkValidate(SendAttendanceFormRequest sendAttendanceFormRequest) throws ParseException {
        boolean check1 = validateDateFormat(sendAttendanceFormRequest.getManualDate());
        boolean check2 = true;
        boolean check3 = true;
        boolean check4 = true;
        if (sendAttendanceFormRequest.getManualFirstEntry() != null) {
            check2 = validateDateTime(sendAttendanceFormRequest.getManualFirstEntry());
        }
        if (sendAttendanceFormRequest.getManualLastExit() != null) {
            check3 = validateDateTime(sendAttendanceFormRequest.getManualLastExit());
        }
        if (sendAttendanceFormRequest.getManualLastExit() != null && sendAttendanceFormRequest.getManualFirstEntry() != null) {
            check4 = validateStartTimeAndEndTime(sendAttendanceFormRequest.getManualFirstEntry(), sendAttendanceFormRequest.getManualLastExit());
        }
        return check1 && check2 && check3 && check4;
    }

    private void saveAttendanceRequest(SendAttendanceFormRequest
                                               sendAttendanceFormRequest, Optional<User> send_user, Optional<Department> department, String
                                               id_request_ticket, Ticket ticket) throws ParseException {
        RequestTicket requestTicket = RequestTicket.builder().requestId(id_request_ticket).createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .status(PENDING).ticketRequest(ticket).title(sendAttendanceFormRequest.getTitle()).user(send_user.get()).build();
        saveAttendanceMessage(sendAttendanceFormRequest, send_user, department, requestTicket);
    }

    private void saveAttendanceMessage(SendAttendanceFormRequest
                                               sendAttendanceFormRequest, Optional<User> send_user, Optional<Department> department, RequestTicket
                                               requestTicket) throws ParseException {
        RequestMessage requestMessage = RequestMessage.builder().createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .sender(send_user.get()).request(requestTicket).department(department.get()).build();
        if (sendAttendanceFormRequest.getReceivedId() != null) {
            Optional<User> receive_user = userRepository.findByUserId(sendAttendanceFormRequest.getReceivedId());
            requestMessage.setReceiver(receive_user.get());
        }
        AttendanceRequestForm attendanceRequestForm = attendanceRequestFormMapper.convert(sendAttendanceFormRequest);
        attendanceRequestForm.setTopic(ATTENDANCE_REQUEST);
        attendanceRequestForm.setStatus(false);
        attendanceRequestForm.setRequestMessage(requestMessage);
        requestTicketRepository.save(requestTicket);
        requestMessageRepository.save(requestMessage);
        attendanceRequestFormRepository.save(attendanceRequestForm);
    }

    @Transactional
    public NotificationAcceptResponse acceptAttendanceRequest(String attendanceRequestId) {
        AttendanceRequestForm attendanceRequestForm = attendanceRequestFormRepository.findById(attendanceRequestId)
                .orElseThrow(() -> new BadRequest("Not_found_attendance_id"));

        RequestMessage requestMessage = requestMessageRepository.findById(attendanceRequestForm.getRequestMessage().getRequestMessageId())
                .orElseThrow(() -> new BadRequest("Not_found_request_message"));

        RequestTicket requestTicket = requestTicketRepository.findById(requestMessage.getRequest().getRequestId())
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        Ticket ticket = ticketRepository.findById(requestTicket.getTicketRequest().getTicketId())
                .orElseThrow(() -> new BadRequest("Not_found_ticket"));

        SendOtherFormRequest sendOtherFormRequest = SendOtherFormRequest.builder()
                .userId(requestMessage.getReceiver().getUserId())
                .ticketId(ticket.getTicketId())
                .requestId(requestTicket.getRequestId())
                .title("Approve attendance request")
                .content("Approve attendance request")
                .departmentId(requestMessage.getDepartment().getDepartmentId())
                .receivedId(requestMessage.getSender().getUserId())
                .build();

        List<RequestTicket> requestTickets = requestTicketRepository.findByTicketRequest(ticket);

        executeRequestDecision(requestTickets, ticket, sendOtherFormRequest);
        try {
            attendanceRequestForm.setStatus(true);
            attendanceRequestFormRepository.save(attendanceRequestForm);
            requestMessageRepository.saveAndFlush(requestMessage);
            requestTicketRepository.saveAll(requestTickets);
            ticketRepository.save(ticket);

            NotificationAcceptResponse response = automaticNotificationService.sendApprovalRequestNotification(
                    new ApprovalNotificationRequest(
                            ticket.getTicketId(),
                            requestMessage.getReceiver(),
                            requestMessage.getSender(),
                            ticket.getTopic(),
                            true,
                            null
                    ));
            attendanceService.updateAttendanceTime(
                    attendanceRequestForm.getManualDate(),
                    requestTicket.getUser(),
                    attendanceRequestForm.getManualFirstEntry(),
                    attendanceRequestForm.getManualLastExit(),
                    attendanceRequestForm.getContent()
            );
            return response;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }


    @Transactional
    public boolean rejectAttendanceRequest(AttendanceMessageRequest attendanceMessageRequest) {
        AttendanceRequestForm roomBookingRequestForm = attendanceRequestFormRepository.findById(attendanceMessageRequest.getAttendanceRequestId())
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
                .title("Reject Attendance request")
                .content(attendanceMessageRequest.getContent())
                .departmentId(requestMessage.getDepartment().getDepartmentId())
                .receivedId(requestMessage.getSender().getUserId())
                .build();
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
                            attendanceMessageRequest.getContent()
                    ));
            return true;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    private void executeRequestDecision(List<RequestTicket> requestTickets, Ticket ticket, SendOtherFormRequest
            sendOtherFormRequest) {
        executeDuplicate(requestTickets, ticket, sendOtherFormRequest, requestOtherService);
    }

    static void executeDuplicate(List<RequestTicket> requestTickets, Ticket ticket, SendOtherFormRequest
            sendOtherFormRequest, RequestOtherService requestOtherService) {
        requestOtherService.getOtherFormUserExistRequest(sendOtherFormRequest);

        if (!requestTickets.isEmpty()) {
            requestTickets.forEach(request -> {
                request.setUpdateDate(Until.generateRealTime());
                request.setStatus(RequestStatus.CLOSED);
                request.setUpdateDate(Until.generateRealTime());
            });
            ticket.setUpdateDate(Until.generateRealTime());
            ticket.setStatus(false);
        } else {
            throw new BadRequest("Not_fount_request_in_ticket");
        }
    }
}
