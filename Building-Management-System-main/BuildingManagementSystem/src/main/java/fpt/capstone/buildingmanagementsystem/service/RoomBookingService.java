package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.mapper.RoomBookingRequestMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestTicket;
import fpt.capstone.buildingmanagementsystem.model.entity.Room;
import fpt.capstone.buildingmanagementsystem.model.entity.RoomBookingFormRoom;
import fpt.capstone.buildingmanagementsystem.model.entity.Ticket;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.RoomBookingRequestForm;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RoomBookingStatus;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import fpt.capstone.buildingmanagementsystem.model.request.ApprovalNotificationRequest;
import fpt.capstone.buildingmanagementsystem.model.request.RoomBookingRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendOtherFormRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendRoomBookingRequest;
import fpt.capstone.buildingmanagementsystem.model.response.RoomBookingResponse;
import fpt.capstone.buildingmanagementsystem.repository.DepartmentRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestMessageRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestTicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.RoomBookingFormRepository;
import fpt.capstone.buildingmanagementsystem.repository.RoomBookingFormRepositoryV2;
import fpt.capstone.buildingmanagementsystem.repository.RoomBookingFormRoomRepository;
import fpt.capstone.buildingmanagementsystem.repository.RoomRepository;
import fpt.capstone.buildingmanagementsystem.repository.TicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.until.Until;
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
import static fpt.capstone.buildingmanagementsystem.validate.Validate.checkDateBookingRoom;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.validateDateFormat;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.validateDateTime;
import static fpt.capstone.buildingmanagementsystem.validate.Validate.validateStartTimeAndEndTime;

@Service
public class RoomBookingService {

    @Autowired
    RoomBookingRequestMapper roomBookingRequestMapper;
    @Autowired
    private RoomRepository roomRepository;
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
    RoomBookingFormRepository roomBookingFormRepository;
    @Autowired
    TicketManageService ticketManageService;
    @Autowired
    RoomBookingFormRepositoryV2 roomFormRepositoryV2;

    @Autowired
    RoomBookingFormRoomRepository roomBookingRoomRepository;

    @Autowired
    RequestOtherService requestOtherService;

    @Autowired
    AutomaticNotificationService automaticNotificationService;

//    private static final TopicEnum ROOM_BOOKING = TopicEnum.ROOM_REQUEST;

    @Transactional
    public boolean getRoomBookingForm(SendRoomBookingRequest sendRoomBookingRequest) {
        try {
            if (sendRoomBookingRequest.getUserId() != null
                    && sendRoomBookingRequest.getDepartmentSenderId() != null
                    && sendRoomBookingRequest.getTitle() != null
                    && sendRoomBookingRequest.getStartTime() != null
                    && sendRoomBookingRequest.getEndTime() != null
                    && sendRoomBookingRequest.getDepartmentReceiverId() != null) {
                if (checkValidate(sendRoomBookingRequest)) {
                    List<User> listUserReceiver = new ArrayList<>();
                    Room room = roomRepository.findById(sendRoomBookingRequest.getRoomId())
                            .orElseThrow(() -> new BadRequest("not_found_room"));
                    User user = userRepository.findByUserId(sendRoomBookingRequest.getUserId())
                            .orElseThrow(() -> new BadRequest("not_found_user"));
                    Department receiverDepartment = departmentRepository.findByDepartmentId(sendRoomBookingRequest.getDepartmentReceiverId())
                            .orElseThrow(() -> new BadRequest("not_found_receiver_department"));
                    Department senderDepartment = departmentRepository.findByDepartmentId(sendRoomBookingRequest.getDepartmentSenderId())
                            .orElseThrow(() -> new BadRequest("not_found_sender_department"));

                    String ticketId = "RB_" + Until.generateId();
                    String requestTicketId = "RB_" + Until.generateId();
                    if (sendRoomBookingRequest.getReceiverId() != null) {
                        Optional<User> receive_user = userRepository.findByUserId(sendRoomBookingRequest.getReceiverId());
                        listUserReceiver.add(receive_user.get());
                    } else {
                        listUserReceiver = userRepository.findAllByDepartment(receiverDepartment);
                    }
                    Ticket ticket = Ticket.builder()
                            .ticketId(ticketId)
                            .topic(TopicEnum.ROOM_REQUEST)
                            .status(true)
                            .createDate(Until.generateRealTime())
                            .updateDate(Until.generateRealTime())
                            .build();
                    ticketRepository.save(ticket);
                    saveRoomBookingRequest(sendRoomBookingRequest, room, user, receiverDepartment, senderDepartment, requestTicketId, ticket);
                    for (User receive_user : listUserReceiver) {
                        automaticNotificationService.sendApprovalTicketNotification(new ApprovalNotificationRequest(
                                ticket.getTicketId(),
                                user,
                                receive_user,
                                ticket.getTopic(),
                                true,
                                null
                        ));
                    }
                    return true;
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


    public boolean getRoomBookingFormExistTicket(SendRoomBookingRequest sendRoomBookingRequest) {
        try {
            if (sendRoomBookingRequest.getUserId() != null
                    && sendRoomBookingRequest.getDepartmentSenderId() != null
                    && sendRoomBookingRequest.getTitle() != null
                    && sendRoomBookingRequest.getStartTime() != null
                    && sendRoomBookingRequest.getEndTime() != null
                    && sendRoomBookingRequest.getDepartmentReceiverId() != null
                    && sendRoomBookingRequest.getTicketId() != null) {
                if (checkValidate(sendRoomBookingRequest)) {
                    Room room = roomRepository.findById(sendRoomBookingRequest.getRoomId())
                            .orElseThrow(() -> new BadRequest("not_found_room"));
                    User user = userRepository.findByUserId(sendRoomBookingRequest.getUserId())
                            .orElseThrow(() -> new BadRequest("not_found_user"));
                    Department receiverDepartment = departmentRepository.findByDepartmentId(sendRoomBookingRequest.getDepartmentReceiverId())
                            .orElseThrow(() -> new BadRequest("not_found_receiver_department"));
                    Department senderDepartment = departmentRepository.findByDepartmentId(sendRoomBookingRequest.getDepartmentSenderId())
                            .orElseThrow(() -> new BadRequest("not_found_sender_department"));
                    Optional<Ticket> ticket = ticketRepository.findByTicketId(sendRoomBookingRequest.getTicketId());
                    if (ticket.isPresent()) {
                        String requestTicketId = "RB_" + Until.generateId();
                        saveRoomBookingRequest(sendRoomBookingRequest, room, user, receiverDepartment, senderDepartment, requestTicketId, ticket.get());
                        ticketRepository.updateTicketTime(Until.generateRealTime(), sendRoomBookingRequest.getTicketId());
                        return true;
                    } else {
                        throw new BadRequest("not_found_ticket");
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

    public boolean getRoomBookingFormExistRequest(SendRoomBookingRequest sendRoomBookingRequest) {
        try {
            if (sendRoomBookingRequest.getUserId() != null
                    && sendRoomBookingRequest.getDepartmentSenderId() != null
                    && sendRoomBookingRequest.getStartTime() != null
                    && sendRoomBookingRequest.getEndTime() != null
                    && sendRoomBookingRequest.getDepartmentReceiverId() != null
                    && sendRoomBookingRequest.getRequestId() != null) {
                if (checkValidate(sendRoomBookingRequest)) {
                    Room room = roomRepository.findById(sendRoomBookingRequest.getRoomId())
                            .orElseThrow(() -> new BadRequest("not_found_room"));
                    User user = userRepository.findByUserId(sendRoomBookingRequest.getUserId())
                            .orElseThrow(() -> new BadRequest("not_found_user"));
                    Department receiverDepartment = departmentRepository.findByDepartmentId(sendRoomBookingRequest.getDepartmentReceiverId())
                            .orElseThrow(() -> new BadRequest("not_found_receiver_department"));
                    Department senderDepartment = departmentRepository.findByDepartmentId(sendRoomBookingRequest.getDepartmentSenderId())
                            .orElseThrow(() -> new BadRequest("not_found_sender_department"));
                    Optional<RequestTicket> requestTicket = requestTicketRepository.findByRequestId(sendRoomBookingRequest.getRequestId());
                    if (requestTicket.isPresent()) {
                        List<RequestMessage> requestMessageOptional = requestMessageRepository.findByRequest(requestTicket.get());
                        String sender_id = requestMessageOptional.get(0).getSender().getUserId();
                        if (requestMessageOptional.get(0).getReceiver() != null) {
                            String receiverId = requestMessageOptional.get(0).getReceiver().getUserId();
                            if (Objects.equals(sendRoomBookingRequest.getUserId(), sender_id)) {
                                sendRoomBookingRequest.setReceiverId(receiverId);
                            } else {
                                sendRoomBookingRequest.setReceiverId(sender_id);
                            }
                        }
                        RequestStatus status = requestTicket.get().getStatus();
                        if (!status.equals(ANSWERED) && !Objects.equals(sender_id, sendRoomBookingRequest.getUserId())) {
                            requestTicket.get().setStatus(ANSWERED);
                            requestTicketRepository.save(requestTicket.get());
                        }
                        Date time = Until.generateRealTime();
                        saveRoomBookingMessage(sendRoomBookingRequest, room, user, receiverDepartment, senderDepartment, requestTicket.get());
                        ticketRepository.updateTicketTime(time, requestTicket.get().getTicketRequest().getTicketId());
                        requestTicketRepository.updateTicketRequestTime(time, sendRoomBookingRequest.getRequestId());
                        return true;
                    } else {
                        throw new BadRequest("not_found_request");
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

    private static boolean checkValidate(SendRoomBookingRequest sendRoomBookingRequest) throws ParseException {
        return validateDateFormat(sendRoomBookingRequest.getBookingDate()) &&
                validateDateTime(sendRoomBookingRequest.getStartTime()) &&
                validateDateTime(sendRoomBookingRequest.getEndTime()) &&
                validateStartTimeAndEndTime(sendRoomBookingRequest.getStartTime(), sendRoomBookingRequest.getEndTime()) &&
                checkDateBookingRoom(sendRoomBookingRequest.getBookingDate(), sendRoomBookingRequest.getStartTime());
    }

    private void saveRoomBookingRequest(SendRoomBookingRequest sendRoomBookingRequest, Room room, User user, Department receiverDepartment, Department senderDepartment, String requestTicketId, Ticket ticket) throws ParseException {
        RequestTicket requestTicket = RequestTicket.builder()
                .requestId(requestTicketId)
                .createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .status(RequestStatus.PENDING)
                .ticketRequest(ticket)
                .title(sendRoomBookingRequest.getTitle())
                .user(user)
                .build();

        saveRoomBookingMessage(sendRoomBookingRequest, room, user, receiverDepartment, senderDepartment, requestTicket);
    }

    private void saveRoomBookingMessage(SendRoomBookingRequest sendRoomBookingRequest, Room room, User user, Department receiverDepartment, Department senderDepartment, RequestTicket requestTicket) throws ParseException {
        RequestMessage requestMessage = RequestMessage.builder()
                .createDate(Until.generateRealTime())
                .updateDate(Until.generateRealTime())
                .sender(user)
                .request(requestTicket)
                .department(receiverDepartment)
                .build();

        if (sendRoomBookingRequest.getReceiverId() != null) {
            User receiver = userRepository.findByUserId(sendRoomBookingRequest.getReceiverId())
                    .orElseThrow(() -> new NotFound("not_found_receiver"));
            requestMessage.setReceiver(receiver);
        }

        RoomBookingRequestForm roomBookingForm = roomBookingRequestMapper.convert(sendRoomBookingRequest);
        roomBookingForm.setStatus(RoomBookingStatus.PENDING);
        roomBookingForm.setDepartmentSender(senderDepartment);
        roomBookingForm.setRequestMessage(requestMessage);
        roomBookingForm.setTopic(TopicEnum.ROOM_REQUEST);
        requestTicketRepository.saveAndFlush(requestTicket);
        requestMessageRepository.saveAndFlush(requestMessage);
        roomBookingFormRepository.save(roomBookingForm);

        RoomBookingFormRoom roomBookingFormRoom = new RoomBookingFormRoom();
        roomBookingFormRoom.setRoomRequestForm(roomBookingForm);
        roomBookingFormRoom.setRoom(room);
        roomBookingRoomRepository.save(roomBookingFormRoom);
    }

    public List<RoomBookingResponse> getPendingAndAcceptedRoom() {
        return roomFormRepositoryV2.getPendingAndAcceptedRoom();
    }

    @Transactional
    public boolean acceptBooking(String roomBookingFormRoomId) {
        RoomBookingRequestForm roomBookingRequestForm = roomBookingFormRepository.findById(roomBookingFormRoomId)
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
                .title("Approve Booking Room")
                .content("Approve Booking Room")
                .departmentId(requestMessage.getDepartment().getDepartmentId())
                .receivedId(requestMessage.getSender().getUserId())
                .build();

        List<RequestTicket> requestTickets = requestTicketRepository.findByTicketRequest(ticket);
        executeRequestDecision(requestTickets, ticket, sendOtherFormRequest);
        try {
            roomBookingRequestForm.setStatus(RoomBookingStatus.ACCEPTED);
            roomBookingFormRepository.saveAndFlush(roomBookingRequestForm);
            requestMessageRepository.saveAndFlush(requestMessage);
            requestTicketRepository.saveAndFlush(requestTicket);
            ticketRepository.save(ticket);
            automaticNotificationService.sendApprovalRequestNotification(
                    new ApprovalNotificationRequest(
                            ticket.getTicketId(),
                            requestMessage.getReceiver(),
                            requestMessage.getSender(),
                            ticket.getTopic(),
                            true,
                            null
                    ));
            Room room = roomBookingRoomRepository.findByRoomRequestForm(roomBookingRequestForm).getRoom();
            Date startTime = roomBookingRequestForm.getStartTime();
            Date endTime = roomBookingRequestForm.getEndTime();
            List<RoomBookingRequestForm> listBooking = roomBookingFormRepository.findByStartTimeAndEndTime(startTime, endTime);
            listBooking.remove(roomBookingRequestForm);
            List<RoomBookingFormRoom> list = roomBookingRoomRepository.findByRoomRequestFormInAndRoom(listBooking, room);
            List<RoomBookingRequest> newlist = new ArrayList<>();
            list.forEach(element -> newlist.add(new RoomBookingRequest(element.getRoomRequestForm().getRoomBookingRequestId(), "Reject Because This Room Is Already Booked")));
            newlist.forEach(element -> rejectRoomBooking2(element, requestMessage.getReceiver().getUserId()));
            return true;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    public void rejectRoomBooking2(RoomBookingRequest roomBookingFormRoom, String receiverId) {
        RoomBookingRequestForm roomBookingRequestForm = roomBookingFormRepository.findById(roomBookingFormRoom.getRoomBookingFormRoomId())
                .orElseThrow(() -> new BadRequest("Not_found_form"));

        RequestMessage requestMessage = requestMessageRepository.findById(roomBookingRequestForm.getRequestMessage().getRequestMessageId())
                .orElseThrow(() -> new BadRequest("Not_found_request_message"));

        RequestTicket requestTicket = requestTicketRepository.findById(requestMessage.getRequest().getRequestId())
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        Ticket ticket = ticketRepository.findById(requestTicket.getTicketRequest().getTicketId())
                .orElseThrow(() -> new BadRequest("Not_found_ticket"));

        SendOtherFormRequest sendOtherFormRequest = SendOtherFormRequest.builder()
                .userId(receiverId)
                .ticketId(ticket.getTicketId())
                .requestId(requestTicket.getRequestId())
                .title("Reject Booking Room")
                .content(roomBookingFormRoom.getContent())
                .departmentId(requestMessage.getDepartment().getDepartmentId())
                .receivedId(requestMessage.getSender().getUserId())
                .build();
        List<RequestTicket> requestTickets = requestTicketRepository.findByTicketRequest(ticket);

        executeRequestDecision(requestTickets, ticket, sendOtherFormRequest);
        try {
            roomBookingRequestForm.setStatus(RoomBookingStatus.REJECTED);
            roomBookingFormRepository.saveAndFlush(roomBookingRequestForm);
            requestMessageRepository.saveAndFlush(requestMessage);
            requestTicketRepository.saveAndFlush(requestTicket);
            ticketRepository.save(ticket);
            automaticNotificationService.sendApprovalRequestNotification(
                    new ApprovalNotificationRequest(
                            ticket.getTicketId(),
                            requestMessage.getReceiver(),
                            requestMessage.getSender(),
                            ticket.getTopic(),
                            false,
                            roomBookingFormRoom.getContent()
                    ));
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    @Transactional
    public boolean rejectRoomBooking(RoomBookingRequest roomBookingFormRoom) {
        RoomBookingRequestForm roomBookingRequestForm = roomBookingFormRepository.findById(roomBookingFormRoom.getRoomBookingFormRoomId())
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
                .title("Reject Booking Room")
                .content(roomBookingFormRoom.getContent())
                .departmentId(requestMessage.getDepartment().getDepartmentId())
                .receivedId(requestMessage.getSender().getUserId())
                .build();
        List<RequestTicket> requestTickets = requestTicketRepository.findByTicketRequest(ticket);

        executeRequestDecision(requestTickets, ticket, sendOtherFormRequest);
        try {
            roomBookingRequestForm.setStatus(RoomBookingStatus.REJECTED);
            roomBookingFormRepository.saveAndFlush(roomBookingRequestForm);
            requestMessageRepository.saveAndFlush(requestMessage);
            requestTicketRepository.saveAndFlush(requestTicket);
            ticketRepository.save(ticket);
            automaticNotificationService.sendApprovalRequestNotification(
                    new ApprovalNotificationRequest(
                            ticket.getTicketId(),
                            requestMessage.getReceiver(),
                            requestMessage.getSender(),
                            ticket.getTopic(),
                            false,
                            roomBookingFormRoom.getContent()
                    ));
            return true;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    private void executeRequestDecision(List<RequestTicket> requestTickets, Ticket ticket, SendOtherFormRequest sendOtherFormRequest) {
        RequestAttendanceFromService.executeDuplicate(requestTickets, ticket, sendOtherFormRequest, requestOtherService);
    }
}
