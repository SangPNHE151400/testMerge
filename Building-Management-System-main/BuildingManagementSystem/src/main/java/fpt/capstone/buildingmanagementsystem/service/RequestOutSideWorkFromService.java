package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.exception.UnprocessableEntity;
import fpt.capstone.buildingmanagementsystem.mapper.WorkingOutsideMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.*;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.WorkingOutsideRequestForm;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus;
import fpt.capstone.buildingmanagementsystem.model.request.ApprovalNotificationRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendLeaveFormRequest;
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
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum.OUTSIDE_REQUEST;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.validateDateFormat;

@Service
public class RequestOutSideWorkFromService {
    @Autowired
    WorkingOutsideMapper workingOutsideMapper;
    @Autowired
    WorkingOutsideFormRepository workingOutsideFormRepository;
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
    public boolean getOutSideFormUser(SendWorkingOutSideRequest sendWorkingOutSideRequest) {
        try {
            if (sendWorkingOutSideRequest.getContent() != null &&
                    sendWorkingOutSideRequest.getDepartmentId() != null &&
                    sendWorkingOutSideRequest.getTitle() != null &&
                    sendWorkingOutSideRequest.getDate() != null &&
                    sendWorkingOutSideRequest.getType() != null
            ) {
                if (checkValidate(sendWorkingOutSideRequest)) {
                    if (validate.checkValidateExistsEvaluate(sendWorkingOutSideRequest.getUserId(), sendWorkingOutSideRequest.getDate())) {
                        List<User> listUserReceiver = new ArrayList<>();
                        Optional<User> send_user = userRepository.findByUserId(sendWorkingOutSideRequest.getUserId());
                        Optional<Department> department = departmentRepository.findByDepartmentId(sendWorkingOutSideRequest.getDepartmentId());
                        if (sendWorkingOutSideRequest.getReceivedId() != null) {
                            Optional<User> receive_user = userRepository.findByUserId(sendWorkingOutSideRequest.getReceivedId());
                            listUserReceiver.add(receive_user.get());
                        } else {
                            listUserReceiver = userRepository.findAllByDepartment(department.get());
                        }
                        if (send_user.isPresent() && department.isPresent()) {
                            String id_ticket = "OW_" + Until.generateId();
                            String id_request_ticket = "OW_" + Until.generateId();
                            //
                            Ticket ticket = Ticket.builder().ticketId(id_ticket).topic(OUTSIDE_REQUEST).status(true).createDate(Until.generateRealTime())
                                    .updateDate(Until.generateRealTime()).build();
                            ticketRepository.save(ticket);
                            //
                            saveOutSideRequest(sendWorkingOutSideRequest, send_user, department, id_request_ticket, ticket);
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

    private static boolean checkValidate(SendWorkingOutSideRequest sendWorkingOutSideRequest) throws ParseException {
        return validateDateFormat(sendWorkingOutSideRequest.getDate());
    }

    public boolean getOutSideFormUserExistTicket(SendWorkingOutSideRequest sendWorkingOutSideRequest) {
        try {
            if (sendWorkingOutSideRequest.getContent() != null &&
                    sendWorkingOutSideRequest.getDepartmentId() != null &&
                    sendWorkingOutSideRequest.getTitle() != null &&
                    sendWorkingOutSideRequest.getTicketId() != null &&
                    sendWorkingOutSideRequest.getDate() != null &&
                    sendWorkingOutSideRequest.getType() != null
            ) {
                Optional<User> send_user = userRepository.findByUserId(sendWorkingOutSideRequest.getUserId());
                Optional<Department> department = departmentRepository.findByDepartmentId(sendWorkingOutSideRequest.getDepartmentId());
                Optional<Ticket> ticket = ticketRepository.findByTicketId(sendWorkingOutSideRequest.getTicketId());
                if (send_user.isPresent() && department.isPresent() && ticket.isPresent()) {
                    String id_request_ticket = "OW_" + Until.generateId();
                    saveOutSideRequest(sendWorkingOutSideRequest, send_user, department, id_request_ticket, ticket.get());
                    ticketRepository.updateTicketTime(Until.generateRealTime(), sendWorkingOutSideRequest.getTicketId());
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

    public boolean getOutSideFormUserExistRequest(SendWorkingOutSideRequest sendWorkingOutSideRequest) {
        try {
            if (sendWorkingOutSideRequest.getContent() != null &&
                    sendWorkingOutSideRequest.getDepartmentId() != null &&
                    sendWorkingOutSideRequest.getRequestId() != null &&
                    sendWorkingOutSideRequest.getDate() != null &&
                    sendWorkingOutSideRequest.getType() != null
            ) {
                Optional<User> send_user = userRepository.findByUserId(sendWorkingOutSideRequest.getUserId());
                Optional<Department> department = departmentRepository.findByDepartmentId(sendWorkingOutSideRequest.getDepartmentId());
                Optional<RequestTicket> requestTicket = requestTicketRepository.findByRequestId(sendWorkingOutSideRequest.getRequestId());
                if (send_user.isPresent() && department.isPresent() && requestTicket.isPresent()) {
                    List<RequestMessage> requestMessageOptional = requestMessageRepository.findByRequest(requestTicket.get());
                    String senderId = requestMessageOptional.get(0).getSender().getUserId();
                    if (requestMessageOptional.get(0).getReceiver() != null) {
                        String receiverId = requestMessageOptional.get(0).getReceiver().getUserId();
                        if (Objects.equals(sendWorkingOutSideRequest.getUserId(), senderId)) {
                            sendWorkingOutSideRequest.setReceivedId(receiverId);
                        } else {
                            sendWorkingOutSideRequest.setReceivedId(senderId);
                        }
                    }
                    RequestStatus status = requestTicket.get().getStatus();
                    if (!status.equals(ANSWERED) && !Objects.equals(senderId, sendWorkingOutSideRequest.getUserId())) {
                        requestTicket.get().setStatus(ANSWERED);
                        requestTicketRepository.save(requestTicket.get());
                    }
                    Date time = Until.generateRealTime();
                    saveOutSideMessage(sendWorkingOutSideRequest, send_user, department, requestTicket.get());
                    ticketRepository.updateTicketTime(time, requestTicket.get().getTicketRequest().getTicketId());
                    requestTicketRepository.updateTicketRequestTime(time, sendWorkingOutSideRequest.getRequestId());
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

    private void saveOutSideRequest(SendWorkingOutSideRequest sendWorkingOutSideRequest, Optional<User> send_user, Optional<Department> department, String id_request_ticket, Ticket ticket) throws ParseException {
        RequestTicket requestTicket = RequestTicket.builder().requestId(id_request_ticket).createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .status(PENDING).ticketRequest(ticket).title(sendWorkingOutSideRequest.getTitle()).user(send_user.get()).build();
        saveOutSideMessage(sendWorkingOutSideRequest, send_user, department, requestTicket);
    }

    private void saveOutSideMessage(SendWorkingOutSideRequest sendWorkingOutSideRequest, Optional<User> send_user, Optional<Department> department, RequestTicket requestTicket) throws ParseException {
        RequestMessage requestMessage = RequestMessage.builder().createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .sender(send_user.get()).request(requestTicket).department(department.get()).build();
        if (sendWorkingOutSideRequest.getReceivedId() != null) {
            Optional<User> receive_user = userRepository.findByUserId(sendWorkingOutSideRequest.getReceivedId());
            requestMessage.setReceiver(receive_user.get());
        }
        WorkingOutsideRequestForm workingOutsideRequestForm = workingOutsideMapper.convert(sendWorkingOutSideRequest);
        workingOutsideRequestForm.setTopic(OUTSIDE_REQUEST);
        workingOutsideRequestForm.setRequestMessage(requestMessage);
        workingOutsideRequestForm.setStatus(false);
        requestTicketRepository.save(requestTicket);
        requestMessageRepository.save(requestMessage);
        workingOutsideFormRepository.save(workingOutsideRequestForm);
    }
}
