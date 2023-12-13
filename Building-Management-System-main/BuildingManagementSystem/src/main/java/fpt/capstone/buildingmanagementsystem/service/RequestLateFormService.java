package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.exception.UnprocessableEntity;
import fpt.capstone.buildingmanagementsystem.mapper.LateRequestMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.*;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.LateRequestForm;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus;
import fpt.capstone.buildingmanagementsystem.model.request.ApprovalNotificationRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendLateFormRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendWorkingOutSideRequest;
import fpt.capstone.buildingmanagementsystem.repository.*;
import fpt.capstone.buildingmanagementsystem.until.Until;
import fpt.capstone.buildingmanagementsystem.validate.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.*;

import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus.ANSWERED;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus.PENDING;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum.LATE_REQUEST;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.validateDateFormat;


@Service
public class RequestLateFormService {
    @Autowired
    LateRequestMapper lateRequestMapper;
    @Autowired
    LateRequestFormRepository lateRequestFormRepository;
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
    Validate validate;
    public boolean getLateFormUser(SendLateFormRequest sendLateFormRequest) {
        try {
            if (sendLateFormRequest.getContent() != null &&
                    sendLateFormRequest.getDepartmentId() != null &&
                    sendLateFormRequest.getTitle() != null &&
                    sendLateFormRequest.getRequestDate() != null &&
                    sendLateFormRequest.getLateType() != null &&
                    sendLateFormRequest.getLateDuration() != null
            ) {
                if (checkValidate(sendLateFormRequest)) {
                    if (validate.checkValidateExistsEvaluate(sendLateFormRequest.getUserId(), sendLateFormRequest.getRequestDate())) {
                        List<User> listUserReceiver = new ArrayList<>();
                        Optional<User> send_user = userRepository.findByUserId(sendLateFormRequest.getUserId());
                        Optional<Department> department = departmentRepository.findByDepartmentId(sendLateFormRequest.getDepartmentId());
                        if (sendLateFormRequest.getReceivedId() != null) {
                            Optional<User> receive_user = userRepository.findByUserId(sendLateFormRequest.getReceivedId());
                            listUserReceiver.add(receive_user.get());
                        } else {
                            listUserReceiver = userRepository.findAllByDepartment(department.get());
                        }
                        if (send_user.isPresent() && department.isPresent()) {
                            String id_ticket = "LT_" + Until.generateId();
                            String id_request_ticket = "LT_" + Until.generateId();
                            //
                            Ticket ticket = Ticket.builder().ticketId(id_ticket).topic(LATE_REQUEST).status(true).createDate(Until.generateRealTime())
                                    .updateDate(Until.generateRealTime()).build();
                            ticketRepository.save(ticket);
                            //
                            saveLateFormRequest(sendLateFormRequest, send_user, department, id_request_ticket, ticket);
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

    public boolean getLateFormUserExistTicket(SendLateFormRequest sendLateFormRequest) {
        try {
            if (sendLateFormRequest.getContent() != null &&
                    sendLateFormRequest.getDepartmentId() != null &&
                    sendLateFormRequest.getTitle() != null &&
                    sendLateFormRequest.getTicketId() != null &&
                    sendLateFormRequest.getRequestDate() != null &&
                    sendLateFormRequest.getLateType() != null &&
                    sendLateFormRequest.getLateDuration() != null
            ) {
                Optional<User> send_user = userRepository.findByUserId(sendLateFormRequest.getUserId());
                Optional<Department> department = departmentRepository.findByDepartmentId(sendLateFormRequest.getDepartmentId());
                Optional<Ticket> ticket = ticketRepository.findByTicketId(sendLateFormRequest.getTicketId());
                if (send_user.isPresent() && department.isPresent() && ticket.isPresent()) {
                    String id_request_ticket = "LT_" + Until.generateId();
                    saveLateFormRequest(sendLateFormRequest, send_user, department, id_request_ticket, ticket.get());
                    ticketRepository.updateTicketTime(Until.generateRealTime(), sendLateFormRequest.getTicketId());
                    return true;
                } else {
                    throw new NotFound("not_found");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError | ParseException e) {
            throw new ServerError("fail");
        }
    }

    private static boolean checkValidate(SendLateFormRequest sendLateFormRequest) throws ParseException {
        return validateDateFormat(sendLateFormRequest.getRequestDate());
    }

    public boolean getLateFormUserExistRequest(SendLateFormRequest sendLateFormRequest) {
        try {
            if (sendLateFormRequest.getContent() != null &&
                    sendLateFormRequest.getDepartmentId() != null &&
                    sendLateFormRequest.getRequestId() != null &&
                    sendLateFormRequest.getRequestDate() != null &&
                    sendLateFormRequest.getLateType() != null &&
                    sendLateFormRequest.getLateDuration() != null
            ) {
                Optional<User> send_user = userRepository.findByUserId(sendLateFormRequest.getUserId());
                Optional<Department> department = departmentRepository.findByDepartmentId(sendLateFormRequest.getDepartmentId());
                Optional<RequestTicket> requestTicket = requestTicketRepository.findByRequestId(sendLateFormRequest.getRequestId());
                if (send_user.isPresent() && department.isPresent() && requestTicket.isPresent()) {
                    List<RequestMessage> requestMessageOptional = requestMessageRepository.findByRequest(requestTicket.get());
                    String senderId = requestMessageOptional.get(0).getSender().getUserId();
                    if (requestMessageOptional.get(0).getReceiver() != null) {
                        String receiverId = requestMessageOptional.get(0).getReceiver().getUserId();
                        if (Objects.equals(sendLateFormRequest.getUserId(), senderId)) {
                            sendLateFormRequest.setReceivedId(receiverId);
                        } else {
                            sendLateFormRequest.setReceivedId(senderId);
                        }
                    }
                    RequestStatus status = requestTicket.get().getStatus();
                    if (!status.equals(ANSWERED) && !Objects.equals(senderId, sendLateFormRequest.getUserId())) {
                        requestTicket.get().setStatus(ANSWERED);
                        requestTicketRepository.save(requestTicket.get());
                    }
                    Date time = Until.generateRealTime();
                    saveLateFormMessage(sendLateFormRequest, send_user, department, requestTicket.get());
                    ticketRepository.updateTicketTime(time, requestTicket.get().getTicketRequest().getTicketId());
                    requestTicketRepository.updateTicketRequestTime(time, sendLateFormRequest.getRequestId());
                    return true;
                } else {
                    throw new NotFound("not_found");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError | ParseException e) {
            throw new ServerError("fail");
        }
    }

    private void saveLateFormRequest(SendLateFormRequest sendLateFormRequest, Optional<User> send_user, Optional<Department> department, String id_request_ticket, Ticket ticket) throws ParseException {
        RequestTicket requestTicket = RequestTicket.builder().requestId(id_request_ticket).createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .status(PENDING).ticketRequest(ticket).title(sendLateFormRequest.getTitle()).user(send_user.get()).build();
        saveLateFormMessage(sendLateFormRequest, send_user, department, requestTicket);
    }

    private void saveLateFormMessage(SendLateFormRequest sendLateFormRequest, Optional<User> send_user, Optional<Department> department, RequestTicket requestTicket) throws ParseException {
        RequestMessage requestMessage = RequestMessage.builder().createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .sender(send_user.get()).request(requestTicket).department(department.get()).build();
        if (sendLateFormRequest.getReceivedId() != null) {
            Optional<User> receive_user = userRepository.findByUserId(sendLateFormRequest.getReceivedId());
            requestMessage.setReceiver(receive_user.get());
        }
        LateRequestForm lateRequestForm = lateRequestMapper.convert(sendLateFormRequest);
        lateRequestForm.setTopic(LATE_REQUEST);
        lateRequestForm.setRequestMessage(requestMessage);
        lateRequestForm.setStatus(false);
        requestTicketRepository.save(requestTicket);
        requestMessageRepository.save(requestMessage);
        lateRequestFormRepository.save(lateRequestForm);
    }
}
