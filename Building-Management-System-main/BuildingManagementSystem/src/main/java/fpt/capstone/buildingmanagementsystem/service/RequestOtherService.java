package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.mapper.OtherRequestMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestTicket;
import fpt.capstone.buildingmanagementsystem.model.entity.Ticket;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.OtherRequest;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus;
import fpt.capstone.buildingmanagementsystem.model.request.ApprovalNotificationRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendOtherFormRequest;
import fpt.capstone.buildingmanagementsystem.repository.DepartmentRepository;
import fpt.capstone.buildingmanagementsystem.repository.OtherRequestFormRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestMessageRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestTicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.TicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus.ANSWERED;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus.PENDING;
import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum.OTHER_REQUEST;

@Service
public class RequestOtherService {
    @Autowired
    OtherRequestMapper otherRequestMapper;
    @Autowired
    OtherRequestFormRepository otherRequestFormRepository;
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
    public boolean getOtherFormUser(SendOtherFormRequest sendOtherFormRequest) {
        try {
            if (sendOtherFormRequest.getContent() != null &&
                    sendOtherFormRequest.getDepartmentId() != null &&
                    sendOtherFormRequest.getTitle() != null
            ) {
                List<User> listUserReceiver= new ArrayList<>();
                Optional<User> send_user = userRepository.findByUserId(sendOtherFormRequest.getUserId());
                Optional<Department> department = departmentRepository.findByDepartmentId(sendOtherFormRequest.getDepartmentId());
                if(sendOtherFormRequest.getReceivedId()!=null) {
                    Optional<User> receive_user = userRepository.findByUserId(sendOtherFormRequest.getReceivedId());
                    listUserReceiver.add(receive_user.get());
                }else{
                    listUserReceiver= userRepository.findAllByDepartment(department.get());
                }
                if (send_user.isPresent() && department.isPresent()) {
                    String id_ticket = "OR_" + Until.generateId();
                    String id_request_ticket = "OR_" + Until.generateId();
                    //
                    Ticket ticket = Ticket.builder().ticketId(id_ticket).topic(OTHER_REQUEST).status(true).createDate(Until.generateRealTime())
                            .updateDate(Until.generateRealTime()).build();
                    ticketRepository.save(ticket);
                    //
                    saveOtherRequest(sendOtherFormRequest, send_user, department, id_request_ticket, ticket);
                    for(User receive_user:listUserReceiver) {
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
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
    }

    public boolean getOtherFormUserExistTicket(SendOtherFormRequest sendOtherFormRequest) {
        try {
            if (sendOtherFormRequest.getContent() != null &&
                    sendOtherFormRequest.getDepartmentId() != null &&
                    sendOtherFormRequest.getTitle() != null &&
                    sendOtherFormRequest.getTicketId() != null
            ) {
                Optional<User> send_user = userRepository.findByUserId(sendOtherFormRequest.getUserId());
                Optional<Department> department = departmentRepository.findByDepartmentId(sendOtherFormRequest.getDepartmentId());
                Optional<Ticket> ticket = ticketRepository.findByTicketId(sendOtherFormRequest.getTicketId());
                if (send_user.isPresent() && department.isPresent() && ticket.isPresent()) {
                    String id_request_ticket = "OR_" + Until.generateId();
                    saveOtherRequest(sendOtherFormRequest, send_user, department, id_request_ticket, ticket.get());
                    ticketRepository.updateTicketTime(Until.generateRealTime(), sendOtherFormRequest.getTicketId());
                    return true;
                } else {
                    throw new NotFound("not_found");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
    }

    public boolean getOtherFormUserExistRequest(SendOtherFormRequest sendOtherFormRequest) {
        try {
            if (sendOtherFormRequest.getContent() != null &&
                    sendOtherFormRequest.getDepartmentId() != null &&
                    sendOtherFormRequest.getRequestId() != null
            ) {
                Optional<User> send_user = userRepository.findByUserId(sendOtherFormRequest.getUserId());
                Optional<Department> department = departmentRepository.findByDepartmentId(sendOtherFormRequest.getDepartmentId());
                Optional<RequestTicket> requestTicket = requestTicketRepository.findByRequestId(sendOtherFormRequest.getRequestId());
                if (send_user.isPresent() && department.isPresent() && requestTicket.isPresent()) {
                    List<RequestMessage> requestMessageOptional = requestMessageRepository.findByRequest(requestTicket.get());
                    String senderId = requestMessageOptional.get(0).getSender().getUserId();
                    if (requestMessageOptional.get(0).getReceiver() != null) {
                        String receiverId = requestMessageOptional.get(0).getReceiver().getUserId();
                        if (Objects.equals(sendOtherFormRequest.getUserId(), senderId)) {
                            sendOtherFormRequest.setReceivedId(receiverId);
                        } else {
                            sendOtherFormRequest.setReceivedId(senderId);
                        }
                    }
                    RequestStatus status = requestTicket.get().getStatus();
                    if (!status.equals(ANSWERED) && !Objects.equals(senderId, sendOtherFormRequest.getUserId())) {
                        requestTicket.get().setStatus(ANSWERED);
                        requestTicketRepository.save(requestTicket.get());
                    }
                    Date time = Until.generateRealTime();
                    saveOtherMessage(sendOtherFormRequest, send_user, department, requestTicket.get());
                    ticketRepository.updateTicketTime(time, requestTicket.get().getTicketRequest().getTicketId());
                    requestTicketRepository.updateTicketRequestTime(time, sendOtherFormRequest.getRequestId());
                    return true;
                } else {
                    throw new NotFound("not_found");
                }
            } else {
                throw new BadRequest("request_fail");
            }
        } catch (ServerError e) {
            throw new ServerError("fail");
        }
    }

    private void saveOtherRequest(SendOtherFormRequest sendOtherFormRequest, Optional<User> send_user, Optional<Department> department, String id_request_ticket, Ticket ticket) {
        RequestTicket requestTicket = RequestTicket.builder().requestId(id_request_ticket).createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .status(PENDING).ticketRequest(ticket).title(sendOtherFormRequest.getTitle()).user(send_user.get()).build();
        saveOtherMessage(sendOtherFormRequest, send_user, department, requestTicket);
    }

    private void saveOtherMessage(SendOtherFormRequest sendOtherFormRequest, Optional<User> send_user, Optional<Department> department, RequestTicket requestTicket) {
        RequestMessage requestMessage = RequestMessage.builder().createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .sender(send_user.get()).request(requestTicket).department(department.get()).build();
        if (sendOtherFormRequest.getReceivedId() != null) {
            Optional<User> receive_user = userRepository.findByUserId(sendOtherFormRequest.getReceivedId());
            requestMessage.setReceiver(receive_user.get());
        }
        OtherRequest otherRequest = otherRequestMapper.convert(sendOtherFormRequest);
        otherRequest.setTopic(OTHER_REQUEST);
        otherRequest.setRequestMessage(requestMessage);
        otherRequest.setStatus(false);
        requestTicketRepository.save(requestTicket);
        requestMessageRepository.save(requestMessage);
        otherRequestFormRepository.save(otherRequest);
    }

    //other k co tin nhan
//    @Transactional
//    public boolean acceptOtherRequest(String otherRequestId) {
//        OtherRequest otherRequest = otherRequestFormRepository.findById(otherRequestId)
//                .orElseThrow(() -> new BadRequest("Not_found_form"));
//
//        RequestMessage requestMessage = requestMessageRepository.findById(otherRequest.getRequestMessage().getRequestMessageId())
//                .orElseThrow(() -> new BadRequest("Not_found_request_message"));
//
//        RequestTicket requestTicket = requestTicketRepository.findById(requestMessage.getRequest().getRequestId())
//                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));
//
//        Ticket ticket = ticketRepository.findById(requestTicket.getTicketRequest().getTicketId())
//                .orElseThrow(() -> new BadRequest("Not_found_ticket"));
//
//        ticket.setUpdateDate(Until.generateRealTime());
//        ticket.setStatus(true);
//        requestTicket.setUpdateDate(Until.generateRealTime());
//        requestTicket.setStatus(RequestStatus.CLOSED);
//        requestMessage.setUpdateDate(Until.generateRealTime());
//        try {
//            otherRequest.setStatus(true);
//            otherRequestFormRepository.save(otherRequest);
//            requestMessageRepository.saveAndFlush(requestMessage);
//            requestTicketRepository.saveAndFlush(requestTicket);
//            ticketRepository.save(ticket);
//            return true;
//        } catch (Exception e) {
//            throw new ServerError("Fail");
//        }
//    }

    public boolean closeOtherRequest(String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new BadRequest("Not_found_ticket"));
        List<RequestTicket> requestTickets = requestTicketRepository.findByTicketRequest(ticket);

        if (requestTickets.isEmpty()) {
            throw new BadRequest("Not_fount_request_in ticket");
        }
        requestTickets.forEach(request -> {
            request.setUpdateDate(Until.generateRealTime());
            request.setStatus(RequestStatus.CLOSED);
            request.setUpdateDate(Until.generateRealTime());
        });
        ticket.setUpdateDate(Until.generateRealTime());
        ticket.setStatus(false);
        try {
            requestTicketRepository.saveAll(requestTickets);
            ticketRepository.save(ticket);
            return true;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }
}
