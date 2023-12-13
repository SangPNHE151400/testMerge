package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestTicket;
import fpt.capstone.buildingmanagementsystem.model.entity.RoomBookingFormRoom;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.RoomBookingRequestForm;
import fpt.capstone.buildingmanagementsystem.model.response.AttendanceFormResponse;
import fpt.capstone.buildingmanagementsystem.model.response.LateRequestFormResponse;
import fpt.capstone.buildingmanagementsystem.model.response.LeaveRequestResponse;
import fpt.capstone.buildingmanagementsystem.model.response.OtherRequestResponse;
import fpt.capstone.buildingmanagementsystem.model.response.OvertimeRequestResponse;
import fpt.capstone.buildingmanagementsystem.model.response.RequestFormResponse;
import fpt.capstone.buildingmanagementsystem.model.response.RequestMessageResponse;
import fpt.capstone.buildingmanagementsystem.model.response.RoomBookingResponseV2;
import fpt.capstone.buildingmanagementsystem.model.response.WorkingOutsideFormResponse;
import fpt.capstone.buildingmanagementsystem.repository.AttendanceRequestFormRepository;
import fpt.capstone.buildingmanagementsystem.repository.LateRequestFormRepository;
import fpt.capstone.buildingmanagementsystem.repository.LeaveRequestFormRepository;
import fpt.capstone.buildingmanagementsystem.repository.OtherRequestFormRepository;
import fpt.capstone.buildingmanagementsystem.repository.OvertimeRequestFormRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestMessageRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestTicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.RoomBookingFormRepository;
import fpt.capstone.buildingmanagementsystem.repository.RoomBookingFormRoomRepository;
import fpt.capstone.buildingmanagementsystem.repository.WorkingOutsideFormRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RequestMessageService {

    @Autowired
    private RequestTicketRepository requestTicketRepository;

    @Autowired
    private RequestMessageRepository requestMessageRepository;

    @Autowired
    private OtherRequestFormRepository otherRequestFormRepository;

    @Autowired
    private AttendanceRequestFormRepository attendanceRequestFormRepository;

    @Autowired
    private RoomBookingFormRepository roomBookingFormRepository;

    @Autowired
    private RoomBookingFormRoomRepository roomFormRoomRepository;

    @Autowired
    private LeaveRequestFormRepository leaveRequestFormRepository;

    @Autowired
    private OvertimeRequestFormRepository overtimeRequestFormRepository;

    @Autowired
    private WorkingOutsideFormRepository workingOutsideFormRepository;

    @Autowired
    private LateRequestFormRepository lateRequestFormRepository;

    //    List<Map<RequestMessageResponse, Object>>
    public List<Object> getAllAttendanceMessageByRequestId(String requestId) {
        RequestTicket requestTicket = requestTicketRepository.findById(requestId)
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        List<RequestMessage> requestMessages = requestMessageRepository.findByRequest(requestTicket);

        List<RequestMessageResponse> messageResponses = new ArrayList<>();
        requestMessages.forEach(requestMessage -> {
            RequestMessageResponse messageResponse = new RequestMessageResponse();
            messageResponse.setRequestMessageId(requestMessage.getRequestMessageId());
            messageResponse.setCreateDate(requestMessage.getCreateDate().toString());
            messageResponse.setAttachmentMessageId(requestMessage.getAttachmentMessageId());
            messageResponse.setSenderId(requestMessage.getSender().getUserId());
            messageResponse.setImageSender(requestMessage.getSender().getImage());
            messageResponse.setTitle(requestTicket.getTitle());
            messageResponse.setRequestTicketStatus(requestTicket.getStatus());
            messageResponse.setSenderFirstName(requestMessage.getSender().getFirstName());
            messageResponse.setSenderLastName(requestMessage.getSender().getLastName());
            messageResponse.setRequestId(requestMessage.getRequest().getRequestId());
            messageResponse.setReceiverDepartment(requestMessage.getDepartment());
            if (requestMessage.getReceiver() != null) {
                messageResponse.setReceiverId(requestMessage.getReceiver().getUserId());
                messageResponse.setReceiverFirstName(requestMessage.getReceiver().getFirstName());
                messageResponse.setReceiverLastName(requestMessage.getReceiver().getLastName());
                messageResponse.setImageReceiver(requestMessage.getReceiver().getImage());
            }
            messageResponses.add(messageResponse);
        });

        List<OtherRequestResponse> otherRequests = otherRequestFormRepository.findByRequestMessageIn(requestMessages)
                .stream().map(form -> new OtherRequestResponse(
                        form.getOtherRequestId(),
                        form.getContent(),
                        form.getRequestMessage().getRequestMessageId(),
                        form.getTopic()
                )).collect(Collectors.toList());

        List<AttendanceFormResponse> attendanceRequests = attendanceRequestFormRepository.findByRequestMessageIn(requestMessages)
                .stream().map(form -> new AttendanceFormResponse(
                        form.getAttendanceRequestId(),
                        form.getManualDate().toString(),
                        form.getManualFirstEntry() != null ? form.getManualFirstEntry().toString() : null,
                        form.getManualLastExit() != null ? form.getManualLastExit().toString() : null,
                        form.getContent(),
                        form.isStatus(),
                        form.getRequestMessage().getRequestMessageId(),
                        form.getTopic()
                ))
                .collect(Collectors.toList());

        Map<String, AttendanceFormResponse> attendanceMap = attendanceRequests.stream()
                .collect(Collectors.toMap(AttendanceFormResponse::getRequestMessageId, Function.identity()));

        Map<String, OtherRequestResponse> otherMap = otherRequests.stream()
                .collect(Collectors.toMap(OtherRequestResponse::getRequestMessageId, Function.identity()));

        Map<RequestMessageResponse, Object> responseObjectMap = messageResponses.stream()
                .collect(Collectors.toMap(Function.identity(), messageResponse -> messageResponse));

        responseObjectMap = responseObjectMap.keySet().stream()
                .sorted(Comparator.comparing(RequestMessageResponse::getCreateDate))
                .map(o -> {
                    if (attendanceMap.containsKey(o.getRequestMessageId())) {
                        return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, attendanceMap.get(o.getRequestMessageId())));
                    }
                    return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, otherMap.get(o.getRequestMessageId())));
                }).collect(Collectors.toMap(Map.Entry::getKey,
                        Map.Entry::getValue,
                        (left, right) -> right,
                        LinkedHashMap::new
                ));
        return new ArrayList<>(responseObjectMap.values());
    }

    public List<Object> getAllRoomBookingMessageByRequestId(String requestId) {
        RequestTicket requestTicket = requestTicketRepository.findById(requestId)
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        List<RequestMessage> requestMessages = requestMessageRepository.findByRequest(requestTicket);

        List<RequestMessageResponse> messageResponses = new ArrayList<>();

        requestMessages.forEach(requestMessage -> {
            RequestMessageResponse messageResponse = new RequestMessageResponse();
            messageResponse.setRequestMessageId(requestMessage.getRequestMessageId());
            messageResponse.setCreateDate(requestMessage.getCreateDate().toString());
            messageResponse.setAttachmentMessageId(requestMessage.getAttachmentMessageId());
            messageResponse.setTitle(requestTicket.getTitle());
            messageResponse.setRequestTicketStatus(requestTicket.getStatus());
            messageResponse.setSenderId(requestMessage.getSender().getUserId());
            messageResponse.setImageSender(requestMessage.getSender().getImage());
            messageResponse.setSenderFirstName(requestMessage.getSender().getFirstName());
            messageResponse.setSenderLastName(requestMessage.getSender().getLastName());
            messageResponse.setRequestId(requestMessage.getRequest().getRequestId());
            messageResponse.setReceiverDepartment(requestMessage.getDepartment());
            if (requestMessage.getReceiver() != null) {
                messageResponse.setReceiverId(requestMessage.getReceiver().getUserId());
                messageResponse.setReceiverFirstName(requestMessage.getReceiver().getFirstName());
                messageResponse.setReceiverLastName(requestMessage.getReceiver().getLastName());
                messageResponse.setImageReceiver(requestMessage.getReceiver().getImage());
            }
            messageResponses.add(messageResponse);
        });

        List<OtherRequestResponse> otherRequests = otherRequestFormRepository.findByRequestMessageIn(requestMessages)
                .stream().map(form -> new OtherRequestResponse(
                        form.getOtherRequestId(),
                        form.getContent(),
                        form.getRequestMessage().getRequestMessageId(),
                        form.getTopic()
                )).collect(Collectors.toList());


        List<RoomBookingRequestForm> roomBookingRequestForms = roomBookingFormRepository.findByRequestMessageIn(requestMessages);

        List<RoomBookingFormRoom> roomBookingFormRooms = roomFormRoomRepository.findByRoomRequestFormIn(roomBookingRequestForms);

        Map<String, RoomBookingFormRoom> mapRoomForm = roomBookingFormRooms.stream()
                .collect(Collectors.toMap(rr -> rr.getRoomRequestForm().getRoomBookingRequestId(), Function.identity()));

        Map<RoomBookingFormRoom, RoomBookingRequestForm> requestFormMap = roomBookingRequestForms.stream()
                .collect(Collectors.toMap(rqForm -> mapRoomForm.get(rqForm.getRoomBookingRequestId()), Function.identity()));

        List<RoomBookingResponseV2> roomBookingResponses = new ArrayList<>();
        requestFormMap.forEach((k, v) -> {
            RoomBookingResponseV2 roomBookingResponse = RoomBookingResponseV2.builder()
                    .roomBookingRequestId(v.getRoomBookingRequestId())
                    .title(v.getTitle())
                    .content(v.getContent())
                    .bookingDate(v.getBookingDate().toString())
                    .startDate(v.getStartTime().toString())
                    .endDate(v.getEndTime().toString())
                    .senderDepartment(v.getDepartmentSender())
                    .topic(v.getTopic())
                    .roomId(k.getRoom().getRoomId())
                    .roomName(k.getRoom().getRoomName())
                    .requestMessageId(v.getRequestMessage().getRequestMessageId())
                    .status(v.getStatus())
                    .build();
            roomBookingResponses.add(roomBookingResponse);

        });

        Map<String, RoomBookingResponseV2> roomBookingMap = roomBookingResponses.stream()
                .collect(Collectors.toMap(RoomBookingResponseV2::getRequestMessageId, Function.identity()));

        Map<String, OtherRequestResponse> otherMap = otherRequests.stream()
                .collect(Collectors.toMap(OtherRequestResponse::getRequestMessageId, Function.identity()));

        Map<RequestMessageResponse, Object> responseObjectMap = messageResponses.stream()
                .collect(Collectors.toMap(Function.identity(), messageResponse -> messageResponse));

        responseObjectMap = responseObjectMap.keySet().stream()
                .sorted(Comparator.comparing(RequestMessageResponse::getCreateDate))
                .map(o -> {
                    if (roomBookingMap.containsKey(o.getRequestMessageId())) {
                        return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, roomBookingMap.get(o.getRequestMessageId())));
                    }
                    return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, otherMap.get(o.getRequestMessageId())));
                }).collect(Collectors.toMap(Map.Entry::getKey,
                        Map.Entry::getValue,
                        (left, right) -> right,
                        LinkedHashMap::new
                ));
        return new ArrayList<>(responseObjectMap.values());

    }

    public List<Object> getAllLateRequestMessageByRequestId(String requestId) {
        RequestTicket requestTicket = requestTicketRepository.findById(requestId)
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        List<RequestMessage> requestMessages = requestMessageRepository.findByRequest(requestTicket);

        List<RequestMessageResponse> messageResponses = new ArrayList<>();
        requestMessages.forEach(requestMessage -> {
            RequestMessageResponse messageResponse = new RequestMessageResponse();
            messageResponse.setRequestMessageId(requestMessage.getRequestMessageId());
            messageResponse.setCreateDate(requestMessage.getCreateDate().toString());
            messageResponse.setAttachmentMessageId(requestMessage.getAttachmentMessageId());
            messageResponse.setSenderId(requestMessage.getSender().getUserId());
            messageResponse.setImageSender(requestMessage.getSender().getImage());
            messageResponse.setTitle(requestTicket.getTitle());
            messageResponse.setRequestTicketStatus(requestTicket.getStatus());
            messageResponse.setSenderFirstName(requestMessage.getSender().getFirstName());
            messageResponse.setSenderLastName(requestMessage.getSender().getLastName());
            messageResponse.setRequestId(requestMessage.getRequest().getRequestId());
            messageResponse.setReceiverDepartment(requestMessage.getDepartment());
            if (requestMessage.getReceiver() != null) {
                messageResponse.setReceiverId(requestMessage.getReceiver().getUserId());
                messageResponse.setReceiverFirstName(requestMessage.getReceiver().getFirstName());
                messageResponse.setReceiverLastName(requestMessage.getReceiver().getLastName());
                messageResponse.setImageReceiver(requestMessage.getReceiver().getImage());
            }
            messageResponses.add(messageResponse);
        });

        List<OtherRequestResponse> otherRequests = otherRequestFormRepository.findByRequestMessageIn(requestMessages)
                .stream().map(form -> new OtherRequestResponse(
                        form.getOtherRequestId(),
                        form.getContent(),
                        form.getRequestMessage().getRequestMessageId(),
                        form.getTopic()
                )).collect(Collectors.toList());

        Map<String, OtherRequestResponse> otherMap = otherRequests.stream()
                .collect(Collectors.toMap(OtherRequestResponse::getRequestMessageId, Function.identity()));

        List<LateRequestFormResponse> lateRequestFormResponses = lateRequestFormRepository.findByRequestMessageIn(requestMessages)
                .stream().map(lateRequest -> new LateRequestFormResponse(
                        lateRequest.getLateRequestId(),
                        lateRequest.getLateType(),
                        lateRequest.getLateDuration(),
                        lateRequest.getRequestDate(),
                        lateRequest.getContent(),
                        lateRequest.isStatus(),
                        lateRequest.getRequestMessage().getRequestMessageId(),
                        lateRequest.getTopic()
                )).collect(Collectors.toList());

        Map<RequestMessageResponse, Object> responseObjectMap = messageResponses.stream()
                .collect(Collectors.toMap(Function.identity(), messageResponse -> messageResponse));

        Map<String, LateRequestFormResponse> stringLateRequestFormResponseMap = lateRequestFormResponses.stream()
                .collect(Collectors.toMap(LateRequestFormResponse::getRequestMessageId, Function.identity()));

        responseObjectMap = responseObjectMap.keySet().stream()
                .sorted(Comparator.comparing(RequestMessageResponse::getCreateDate))
                .map(o -> {
                    if (stringLateRequestFormResponseMap.containsKey(o.getRequestMessageId())) {
                        return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, stringLateRequestFormResponseMap.get(o.getRequestMessageId())));
                    }
                    return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, otherMap.get(o.getRequestMessageId())));
                }).collect(Collectors.toMap(Map.Entry::getKey,
                        Map.Entry::getValue,
                        (left, right) -> right,
                        LinkedHashMap::new
                ));
        return new ArrayList<>(responseObjectMap.values());
    }

    public List<Object> getAllOvertimeRequestMessageByRequestId(String requestId) {
        RequestTicket requestTicket = requestTicketRepository.findById(requestId)
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        List<RequestMessage> requestMessages = requestMessageRepository.findByRequest(requestTicket);

        List<RequestMessageResponse> messageResponses = new ArrayList<>();
        requestMessages.forEach(requestMessage -> {
            RequestMessageResponse messageResponse = new RequestMessageResponse();
            messageResponse.setRequestMessageId(requestMessage.getRequestMessageId());
            messageResponse.setCreateDate(requestMessage.getCreateDate().toString());
            messageResponse.setAttachmentMessageId(requestMessage.getAttachmentMessageId());
            messageResponse.setSenderId(requestMessage.getSender().getUserId());
            messageResponse.setImageSender(requestMessage.getSender().getImage());
            messageResponse.setTitle(requestTicket.getTitle());
            messageResponse.setRequestTicketStatus(requestTicket.getStatus());
            messageResponse.setSenderFirstName(requestMessage.getSender().getFirstName());
            messageResponse.setSenderLastName(requestMessage.getSender().getLastName());
            messageResponse.setRequestId(requestMessage.getRequest().getRequestId());
            messageResponse.setReceiverDepartment(requestMessage.getDepartment());
            if (requestMessage.getReceiver() != null) {
                messageResponse.setReceiverId(requestMessage.getReceiver().getUserId());
                messageResponse.setReceiverFirstName(requestMessage.getReceiver().getFirstName());
                messageResponse.setReceiverLastName(requestMessage.getReceiver().getLastName());
                messageResponse.setImageReceiver(requestMessage.getReceiver().getImage());
            }
            messageResponses.add(messageResponse);
        });

        List<OtherRequestResponse> otherRequests = otherRequestFormRepository.findByRequestMessageIn(requestMessages)
                .stream().map(form -> new OtherRequestResponse(
                        form.getOtherRequestId(),
                        form.getContent(),
                        form.getRequestMessage().getRequestMessageId(),
                        form.getTopic()
                )).collect(Collectors.toList());

        Map<String, OtherRequestResponse> otherMap = otherRequests.stream()
                .collect(Collectors.toMap(OtherRequestResponse::getRequestMessageId, Function.identity()));

        List<OvertimeRequestResponse> overtimeRequestResponses = overtimeRequestFormRepository.findByRequestMessageIn(requestMessages)
                .stream().map(ot -> new OvertimeRequestResponse(
                        ot.getOvertimeRequestId(),
                        ot.getOvertimeDate(),
                        ot.getFromTime(),
                        ot.getToTime(),
                        ot.getTopicOvertime(),
                        ot.getContent(),
                        ot.isStatus(),
                        ot.getRequestMessage().getRequestMessageId(),
                        ot.getTopic()
                ))
                .collect(Collectors.toList());

        Map<String, OvertimeRequestResponse> overtimeRequestResponseMap = overtimeRequestResponses.stream()
                .collect(Collectors.toMap(OvertimeRequestResponse::getRequestMessageId, Function.identity()));

        Map<RequestMessageResponse, Object> responseObjectMap = messageResponses.stream()
                .collect(Collectors.toMap(Function.identity(), messageResponse -> messageResponse));

        responseObjectMap = responseObjectMap.keySet().stream()
                .sorted(Comparator.comparing(RequestMessageResponse::getCreateDate))
                .map(o -> {
                    if (overtimeRequestResponseMap.containsKey(o.getRequestMessageId())) {
                        return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, overtimeRequestResponseMap.get(o.getRequestMessageId())));
                    }
                    return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, otherMap.get(o.getRequestMessageId())));
                }).collect(Collectors.toMap(Map.Entry::getKey,
                        Map.Entry::getValue,
                        (left, right) -> right,
                        LinkedHashMap::new
                ));
        return new ArrayList<>(responseObjectMap.values());
    }

    public List<Object> getAllWorkingOutsideRequestMessageByRequestId(String requestId) {
        RequestTicket requestTicket = requestTicketRepository.findById(requestId)
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        List<RequestMessage> requestMessages = requestMessageRepository.findByRequest(requestTicket);

        List<RequestMessageResponse> messageResponses = new ArrayList<>();
        requestMessages.forEach(requestMessage -> {
            RequestMessageResponse messageResponse = new RequestMessageResponse();
            messageResponse.setRequestMessageId(requestMessage.getRequestMessageId());
            messageResponse.setCreateDate(requestMessage.getCreateDate().toString());
            messageResponse.setAttachmentMessageId(requestMessage.getAttachmentMessageId());
            messageResponse.setSenderId(requestMessage.getSender().getUserId());
            messageResponse.setImageSender(requestMessage.getSender().getImage());
            messageResponse.setTitle(requestTicket.getTitle());
            messageResponse.setRequestTicketStatus(requestTicket.getStatus());
            messageResponse.setSenderFirstName(requestMessage.getSender().getFirstName());
            messageResponse.setSenderLastName(requestMessage.getSender().getLastName());
            messageResponse.setRequestId(requestMessage.getRequest().getRequestId());
            messageResponse.setReceiverDepartment(requestMessage.getDepartment());
            if (requestMessage.getReceiver() != null) {
                messageResponse.setReceiverId(requestMessage.getReceiver().getUserId());
                messageResponse.setReceiverFirstName(requestMessage.getReceiver().getFirstName());
                messageResponse.setReceiverLastName(requestMessage.getReceiver().getLastName());
                messageResponse.setImageReceiver(requestMessage.getReceiver().getImage());
            }
            messageResponses.add(messageResponse);
        });

        List<OtherRequestResponse> otherRequests = otherRequestFormRepository.findByRequestMessageIn(requestMessages)
                .stream().map(form -> new OtherRequestResponse(
                        form.getOtherRequestId(),
                        form.getContent(),
                        form.getRequestMessage().getRequestMessageId(),
                        form.getTopic()
                )).collect(Collectors.toList());

        Map<String, OtherRequestResponse> otherMap = otherRequests.stream()
                .collect(Collectors.toMap(OtherRequestResponse::getRequestMessageId, Function.identity()));

        List<WorkingOutsideFormResponse> workingOutsideFormResponses = workingOutsideFormRepository.findByRequestMessageIn(requestMessages)
                .stream().map(wo -> new WorkingOutsideFormResponse(
                        wo.getWorkingOutsideId(),
                        wo.getDate(),
                        wo.getType(),
                        wo.getContent(),
                        wo.getRequestMessage().getRequestMessageId(),
                        wo.getTopic()
                ))
                .collect(Collectors.toList());

        Map<String, WorkingOutsideFormResponse> workingOutsideFormResponseMap = workingOutsideFormResponses.stream()
                .collect(Collectors.toMap(WorkingOutsideFormResponse::getRequestMessageId, Function.identity()));

        Map<RequestMessageResponse, Object> responseObjectMap = messageResponses.stream()
                .collect(Collectors.toMap(Function.identity(), messageResponse -> messageResponse));

        responseObjectMap = responseObjectMap.keySet().stream()
                .sorted(Comparator.comparing(RequestMessageResponse::getCreateDate))
                .map(o -> {
                    if (workingOutsideFormResponseMap.containsKey(o.getRequestMessageId())) {
                        return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, workingOutsideFormResponseMap.get(o.getRequestMessageId())));
                    }
                    return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, otherMap.get(o.getRequestMessageId())));
                }).collect(Collectors.toMap(Map.Entry::getKey,
                        Map.Entry::getValue,
                        (left, right) -> right,
                        LinkedHashMap::new
                ));
        return new ArrayList<>(responseObjectMap.values());
    }

    public List<Object> getAllLeaveMessageByRequestId(String requestId) {
        RequestTicket requestTicket = requestTicketRepository.findById(requestId)
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        List<RequestMessage> requestMessages = requestMessageRepository.findByRequest(requestTicket);

        List<RequestMessageResponse> messageResponses = new ArrayList<>();
        requestMessages.forEach(requestMessage -> {
            RequestMessageResponse messageResponse = new RequestMessageResponse();
            messageResponse.setRequestMessageId(requestMessage.getRequestMessageId());
            messageResponse.setCreateDate(requestMessage.getCreateDate().toString());
            messageResponse.setAttachmentMessageId(requestMessage.getAttachmentMessageId());
            messageResponse.setSenderId(requestMessage.getSender().getUserId());
            messageResponse.setImageSender(requestMessage.getSender().getImage());
            messageResponse.setTitle(requestTicket.getTitle());
            messageResponse.setRequestTicketStatus(requestTicket.getStatus());
            messageResponse.setSenderFirstName(requestMessage.getSender().getFirstName());
            messageResponse.setSenderLastName(requestMessage.getSender().getLastName());
            messageResponse.setRequestId(requestMessage.getRequest().getRequestId());
            messageResponse.setReceiverDepartment(requestMessage.getDepartment());
            if (requestMessage.getReceiver() != null) {
                messageResponse.setReceiverId(requestMessage.getReceiver().getUserId());
                messageResponse.setReceiverFirstName(requestMessage.getReceiver().getFirstName());
                messageResponse.setReceiverLastName(requestMessage.getReceiver().getLastName());
                messageResponse.setImageReceiver(requestMessage.getReceiver().getImage());
            }
            messageResponses.add(messageResponse);
        });

        List<OtherRequestResponse> otherRequests = otherRequestFormRepository.findByRequestMessageIn(requestMessages)
                .stream().map(form -> new OtherRequestResponse(
                        form.getOtherRequestId(),
                        form.getContent(),
                        form.getRequestMessage().getRequestMessageId(),
                        form.getTopic()
                )).collect(Collectors.toList());

        List<LeaveRequestResponse> leaveRequestResponses = new ArrayList<>();
        leaveRequestFormRepository.findByRequestMessageIn(requestMessages)
                .forEach(leave -> {
                    LeaveRequestResponse leaveRequestResponse = LeaveRequestResponse.builder()
                            .leaveRequestId(leave.getLeaveRequestId())
                            .fromDate(leave.getFromDate().toString())
                            .toDate(leave.getToDate().toString())
                            .halfDay(leave.isHalfDay())
                            .durationEvaluation(leave.getDurationEvaluation())
                            .content(leave.getContent())
                            .requestMessageId(leave.getRequestMessage().getRequestMessageId())
                            .topic(leave.getTopic())
                            .build();
                    leaveRequestResponses.add(leaveRequestResponse);
                });


        Map<String, LeaveRequestResponse> attendanceMap = leaveRequestResponses.stream()
                .collect(Collectors.toMap(LeaveRequestResponse::getRequestMessageId, Function.identity()));

        Map<String, OtherRequestResponse> otherMap = otherRequests.stream()
                .collect(Collectors.toMap(OtherRequestResponse::getRequestMessageId, Function.identity()));

        Map<RequestMessageResponse, Object> responseObjectMap = messageResponses.stream()
                .collect(Collectors.toMap(Function.identity(), messageResponse -> messageResponse));

        responseObjectMap = responseObjectMap.keySet().stream()
                .sorted(Comparator.comparing(RequestMessageResponse::getCreateDate))
                .map(o -> {
                    if (attendanceMap.containsKey(o.getRequestMessageId())) {
                        return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, attendanceMap.get(o.getRequestMessageId())));
                    }
                    return new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, otherMap.get(o.getRequestMessageId())));
                }).collect(Collectors.toMap(Map.Entry::getKey,
                        Map.Entry::getValue,
                        (left, right) -> right,
                        LinkedHashMap::new
                ));
        return new ArrayList<>(responseObjectMap.values());
    }

    public List<Object> getAllOtherMessageByRequestId(String requestId) {
        RequestTicket requestTicket = requestTicketRepository.findById(requestId)
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        List<RequestMessage> requestMessages = requestMessageRepository.findByRequest(requestTicket);

        List<RequestMessageResponse> messageResponses = new ArrayList<>();

        requestMessages.forEach(requestMessage -> {
            RequestMessageResponse messageResponse = new RequestMessageResponse();
            messageResponse.setRequestMessageId(requestMessage.getRequestMessageId());
            messageResponse.setCreateDate(requestMessage.getCreateDate().toString());
            messageResponse.setAttachmentMessageId(requestMessage.getAttachmentMessageId());
            messageResponse.setRequestTicketStatus(requestTicket.getStatus());
            messageResponse.setTitle(requestTicket.getTitle());
            messageResponse.setSenderId(requestMessage.getSender().getUserId());
            messageResponse.setImageSender(requestMessage.getSender().getImage());
            messageResponse.setSenderFirstName(requestMessage.getSender().getFirstName());
            messageResponse.setSenderLastName(requestMessage.getSender().getLastName());
            messageResponse.setRequestId(requestMessage.getRequest().getRequestId());
            messageResponse.setReceiverDepartment(requestMessage.getDepartment());
            if (requestMessage.getReceiver() != null) {
                messageResponse.setReceiverId(requestMessage.getReceiver().getUserId());
                messageResponse.setReceiverFirstName(requestMessage.getReceiver().getFirstName());
                messageResponse.setReceiverLastName(requestMessage.getReceiver().getLastName());
                messageResponse.setImageReceiver(requestMessage.getReceiver().getImage());
            }
            messageResponses.add(messageResponse);
        });

        List<OtherRequestResponse> otherRequests = otherRequestFormRepository.findByRequestMessageIn(requestMessages)
                .stream().map(form -> new OtherRequestResponse(
                        form.getOtherRequestId(),
                        form.getContent(),
                        form.getRequestMessage().getRequestMessageId(),
                        form.getTopic()
                )).collect(Collectors.toList());

        Map<String, OtherRequestResponse> otherMap = otherRequests.stream()
                .collect(Collectors.toMap(OtherRequestResponse::getRequestMessageId, Function.identity()));

        Map<RequestMessageResponse, Object> responseObjectMap = messageResponses.stream()
                .collect(Collectors.toMap(Function.identity(), messageResponse -> messageResponse));

        responseObjectMap = responseObjectMap.keySet().stream()
                .sorted(Comparator.comparing(RequestMessageResponse::getCreateDate))
                .map(o -> new AbstractMap.SimpleImmutableEntry<>(o, new RequestFormResponse(o, otherMap.get(o.getRequestMessageId()))))
                .collect(Collectors.toMap(Map.Entry::getKey,
                        Map.Entry::getValue,
                        (left, right) -> right,
                        LinkedHashMap::new
                ));
        return new ArrayList<>(responseObjectMap.values());
    }

}
