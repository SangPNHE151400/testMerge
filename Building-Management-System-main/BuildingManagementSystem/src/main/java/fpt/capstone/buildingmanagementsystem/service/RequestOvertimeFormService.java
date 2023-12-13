package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.*;
import fpt.capstone.buildingmanagementsystem.mapper.OvertimeRequestFormMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.*;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.OvertimeRequestForm;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus;
import fpt.capstone.buildingmanagementsystem.model.request.ApprovalNotificationRequest;

import fpt.capstone.buildingmanagementsystem.model.request.SendOvertimeFormRequest;
import fpt.capstone.buildingmanagementsystem.repository.*;
import fpt.capstone.buildingmanagementsystem.until.Until;
import fpt.capstone.buildingmanagementsystem.validate.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus.ANSWERED;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus.PENDING;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum.OVERTIME_REQUEST;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.*;

@Service
public class RequestOvertimeFormService {
    @Autowired
    OvertimeRequestFormMapper overtimeRequestFormMapper;
    @Autowired
    OvertimeRequestFormRepository overtimeRequestFormRepository;
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
    AutomaticNotificationService automaticNotificationService;
    @Autowired
    OvertimeService overtimeService;
    @Autowired
    Validate validate;

    public boolean getOvertimeFormUser(SendOvertimeFormRequest sendOvertimeFormRequest) {
        try {
            if (sendOvertimeFormRequest.getContent() != null &&
                    sendOvertimeFormRequest.getDepartmentId() != null &&
                    sendOvertimeFormRequest.getTitle() != null &&
                    sendOvertimeFormRequest.getTopicOvertime() != null &&
                    sendOvertimeFormRequest.getOvertimeDate() != null &&
                    sendOvertimeFormRequest.getToTime() != null &&
                    sendOvertimeFormRequest.getFromTime() != null
            ) {
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                String formattedDate = dateFormat.format(Until.generateDate());
                if (checkValidate(sendOvertimeFormRequest) && checkTime(sendOvertimeFormRequest)) {
                    if (validate.checkValidateExistsEvaluate(sendOvertimeFormRequest.getUserId(), sendOvertimeFormRequest.getOvertimeDate())) {
                        if (validateStartDateAndEndDate2(sendOvertimeFormRequest.getOvertimeDate(),formattedDate)) {
                            List<User> listUserReceiver = new ArrayList<>();
                            Optional<User> send_user = userRepository.findByUserId(sendOvertimeFormRequest.getUserId());
                            Optional<Department> department = departmentRepository.findByDepartmentId(sendOvertimeFormRequest.getDepartmentId());
                            if (sendOvertimeFormRequest.getReceivedId() != null) {
                                Optional<User> receive_user = userRepository.findByUserId(sendOvertimeFormRequest.getReceivedId());
                                listUserReceiver.add(receive_user.get());
                            } else {
                                listUserReceiver = userRepository.findAllByDepartment(department.get());
                            }
                            if (send_user.isPresent() && department.isPresent()) {
                                String id_ticket = "OT_" + Until.generateId();
                                String id_request_ticket = "OT_" + Until.generateId();
                                //
                                Ticket ticket = Ticket.builder().ticketId(id_ticket).topic(OVERTIME_REQUEST).status(true).createDate(Until.generateRealTime())
                                        .updateDate(Until.generateRealTime()).build();
                                ticketRepository.save(ticket);
                                //
                                saveOvertimeRequest(sendOvertimeFormRequest, send_user, department, id_request_ticket, ticket);
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
                            throw new Conflict("request_ot_is_only_created_for_the_previous_day");
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

    public boolean getOvertimeExistTicket(SendOvertimeFormRequest sendOvertimeFormRequest) {
        try {
            if (sendOvertimeFormRequest.getContent() != null &&
                    sendOvertimeFormRequest.getDepartmentId() != null &&
                    sendOvertimeFormRequest.getTitle() != null &&
                    sendOvertimeFormRequest.getTicketId() != null &&
                    sendOvertimeFormRequest.getTopicOvertime() != null &&
                    sendOvertimeFormRequest.getOvertimeDate() != null &&
                    sendOvertimeFormRequest.getToTime() != null &&
                    sendOvertimeFormRequest.getFromTime() != null
            ) {
                if (checkValidate(sendOvertimeFormRequest) && checkTime(sendOvertimeFormRequest)) {

                    Optional<User> send_user = userRepository.findByUserId(sendOvertimeFormRequest.getUserId());
                    Optional<Department> department = departmentRepository.findByDepartmentId(sendOvertimeFormRequest.getDepartmentId());
                    Optional<Ticket> ticket = ticketRepository.findByTicketId(sendOvertimeFormRequest.getTicketId());
                    if (send_user.isPresent() && department.isPresent() && ticket.isPresent()) {
                        String id_request_ticket = "OT_" + Until.generateId();
                        saveOvertimeRequest(sendOvertimeFormRequest, send_user, department, id_request_ticket, ticket.get());
                        ticketRepository.updateTicketTime(Until.generateRealTime(), sendOvertimeFormRequest.getTicketId());
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

    public boolean getOvertimeExistRequest(SendOvertimeFormRequest sendOvertimeFormRequest) {
        try {
            if (sendOvertimeFormRequest.getContent() != null &&
                    sendOvertimeFormRequest.getDepartmentId() != null &&
                    sendOvertimeFormRequest.getRequestId() != null &&
                    sendOvertimeFormRequest.getTopicOvertime() != null &&
                    sendOvertimeFormRequest.getOvertimeDate() != null &&
                    sendOvertimeFormRequest.getToTime() != null &&
                    sendOvertimeFormRequest.getFromTime() != null
            ) {
                if (checkValidate(sendOvertimeFormRequest) && checkTime(sendOvertimeFormRequest)) {
                    Optional<User> send_user = userRepository.findByUserId(sendOvertimeFormRequest.getUserId());
                    Optional<Department> department = departmentRepository.findByDepartmentId(sendOvertimeFormRequest.getDepartmentId());
                    Optional<RequestTicket> requestTicket = requestTicketRepository.findByRequestId(sendOvertimeFormRequest.getRequestId());
                    if (send_user.isPresent() && department.isPresent() && requestTicket.isPresent()) {
                        List<RequestMessage> requestMessageOptional = requestMessageRepository.findByRequest(requestTicket.get());
                        String senderId = requestMessageOptional.get(0).getSender().getUserId();
                        if (requestMessageOptional.get(0).getReceiver() != null) {
                            String receiverId = requestMessageOptional.get(0).getReceiver().getUserId();
                            if (Objects.equals(sendOvertimeFormRequest.getUserId(), senderId)) {
                                sendOvertimeFormRequest.setReceivedId(receiverId);
                            } else {
                                sendOvertimeFormRequest.setReceivedId(senderId);
                            }
                        }
                        RequestStatus status = requestTicket.get().getStatus();
                        if (!status.equals(ANSWERED) && !Objects.equals(senderId, sendOvertimeFormRequest.getUserId())) {
                            requestTicket.get().setStatus(ANSWERED);
                            requestTicketRepository.save(requestTicket.get());
                        }
                        Date time = Until.generateRealTime();
                        saveOvertimeMessage(sendOvertimeFormRequest, send_user, department, requestTicket.get());
                        ticketRepository.updateTicketTime(time, requestTicket.get().getTicketRequest().getTicketId());
                        requestTicketRepository.updateTicketRequestTime(time, sendOvertimeFormRequest.getRequestId());
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

    private void saveOvertimeRequest(SendOvertimeFormRequest sendOvertimeFormRequest, Optional<User> send_user, Optional<Department> department, String id_request_ticket, Ticket ticket) throws ParseException {
        RequestTicket requestTicket = RequestTicket.builder().requestId(id_request_ticket).createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .status(PENDING).ticketRequest(ticket).title(sendOvertimeFormRequest.getTitle()).user(send_user.get()).build();
        saveOvertimeMessage(sendOvertimeFormRequest, send_user, department, requestTicket);
    }

    private boolean checkTime(SendOvertimeFormRequest sendOvertimeFormRequest) {
        boolean check = true;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDate localDate = LocalDate.parse(sendOvertimeFormRequest.getOvertimeDate() + " 00:00:00", formatter);
        java.sql.Date checkDate = java.sql.Date.valueOf(localDate);

        LocalDateTime localCheckTime1 = LocalDateTime.parse(sendOvertimeFormRequest.getOvertimeDate() + " " + sendOvertimeFormRequest.getFromTime(), formatter);
        Time sqlTimeEnd = Time.valueOf(localCheckTime1.toLocalTime());
        if (sqlTimeEnd.getTime() - overtimeService.getSystemTime(sendOvertimeFormRequest.getUserId(), checkDate).getSystemCheckin().getTime() < 0) {
            check = false;
        } else if (overtimeService.getSystemTime(sendOvertimeFormRequest.getUserId(), checkDate).getSystemCheckin().toString() == null) {
            check = false;
        }
        return check;
    }

    private static boolean checkValidate(SendOvertimeFormRequest sendOvertimeFormRequest) throws ParseException {
        return validateDateFormat(sendOvertimeFormRequest.getOvertimeDate()) &&
                validateDateTime(sendOvertimeFormRequest.getFromTime()) &&
                validateDateTime(sendOvertimeFormRequest.getToTime()) &&
                validateStartTimeAndEndTime(sendOvertimeFormRequest.getFromTime(), sendOvertimeFormRequest.getToTime());
    }

    private void saveOvertimeMessage(SendOvertimeFormRequest sendOvertimeFormRequest, Optional<User> send_user, Optional<Department> department, RequestTicket requestTicket) throws ParseException {
        RequestMessage requestMessage = RequestMessage.builder().createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .sender(send_user.get()).request(requestTicket).department(department.get()).build();
        if (sendOvertimeFormRequest.getReceivedId() != null) {
            Optional<User> receive_user = userRepository.findByUserId(sendOvertimeFormRequest.getReceivedId());
            requestMessage.setReceiver(receive_user.get());
        }
        OvertimeRequestForm overtimeRequestForm = overtimeRequestFormMapper.convert(sendOvertimeFormRequest);
        overtimeRequestForm.setTopic(OVERTIME_REQUEST);
        overtimeRequestForm.setRequestMessage(requestMessage);
        overtimeRequestForm.setStatus(false);
        requestTicketRepository.save(requestTicket);
        requestMessageRepository.save(requestMessage);
        overtimeRequestFormRepository.save(overtimeRequestForm);
    }
}
