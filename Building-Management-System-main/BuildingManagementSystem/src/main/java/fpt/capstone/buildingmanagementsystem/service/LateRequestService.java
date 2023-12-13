package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.model.entity.*;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.LateRequestForm;
import fpt.capstone.buildingmanagementsystem.model.request.ApprovalNotificationRequest;
import fpt.capstone.buildingmanagementsystem.model.request.LateMessageRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendOtherFormRequest;
import fpt.capstone.buildingmanagementsystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LateRequestService {
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
    LateRequestFormRepository lateRequestFormRepository;

    @Autowired
    AttendanceService attendanceService;

    @Autowired
    DailyLogRepository dailyLogRepository;

    @Autowired
    LateRequestFormRepositoryV2 lateRequestFormRepositoryV2;

    @Autowired
    DailyLogService dailyLogService;

    public boolean acceptLateRequest(String acceptLateRequestId) {
        LateRequestForm lateRequestForm = lateRequestFormRepository.findById(acceptLateRequestId)
                .orElseThrow(() -> new BadRequest("Not_found_late_request"));

        RequestMessage requestMessage = requestMessageRepository.findById(lateRequestForm.getRequestMessage().getRequestMessageId())
                .orElseThrow(() -> new BadRequest("Not_found_request_message"));

        RequestTicket requestTicket = requestTicketRepository.findById(requestMessage.getRequest().getRequestId())
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        Ticket ticket = ticketRepository.findById(requestTicket.getTicketRequest().getTicketId())
                .orElseThrow(() -> new BadRequest("Not_found_ticket"));

        SendOtherFormRequest sendOtherFormRequest = SendOtherFormRequest.builder()
                .userId(requestMessage.getReceiver().getUserId())
                .ticketId(ticket.getTicketId())
                .requestId(requestTicket.getRequestId())
                .title("Approve late request")
                .content("Approve late request")
                .departmentId(requestMessage.getDepartment().getDepartmentId())
                .receivedId(requestMessage.getSender().getUserId())
                .build();
        List<RequestTicket> requestTickets = requestTicketRepository.findByTicketRequest(ticket);

        executeRequestDecision(requestTickets, ticket, sendOtherFormRequest);
        try {
            lateRequestForm.setStatus(true);
            lateRequestFormRepository.saveAndFlush(lateRequestForm);
            requestMessageRepository.saveAndFlush(requestMessage);
            requestTicketRepository.saveAll(requestTickets);
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
            updateLateRequest(lateRequestForm.getRequestDate(), requestTicket.getUser(), lateRequestForm.getContent());
            return true;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    @javax.transaction.Transactional
    public boolean rejectLateRequest(LateMessageRequest lateMessageRequest) {
        LateRequestForm lateRequestForm = lateRequestFormRepository.findById(lateMessageRequest.getLateMessageRequestId())
                .orElseThrow(() -> new BadRequest("Not_found_late_request"));

        RequestMessage requestMessage = requestMessageRepository.findById(lateRequestForm.getRequestMessage().getRequestMessageId())
                .orElseThrow(() -> new BadRequest("Not_found_request_message"));

        RequestTicket requestTicket = requestTicketRepository.findById(requestMessage.getRequest().getRequestId())
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        Ticket ticket = ticketRepository.findById(requestTicket.getTicketRequest().getTicketId())
                .orElseThrow(() -> new BadRequest("Not_found_ticket"));

        SendOtherFormRequest sendOtherFormRequest = SendOtherFormRequest.builder()
                .userId(requestMessage.getReceiver().getUserId())
                .ticketId(ticket.getTicketId())
                .requestId(requestTicket.getRequestId())
                .title("Reject late request")
                .content(lateRequestForm.getContent())
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
                            lateRequestForm.getContent()
                    ));
            return true;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    private void executeRequestDecision(List<RequestTicket> requestTickets, Ticket ticket, SendOtherFormRequest sendOtherFormRequest) {
        RequestAttendanceFromService.executeDuplicate(requestTickets, ticket, sendOtherFormRequest, requestOtherService);
    }

    public void updateLateRequest(Date date, User user, String reasons) {
        Optional<DailyLog> dailyLog = dailyLogRepository.findByUserAndDate(user, date);
        if(!dailyLog.isPresent()) return;
        dailyLogService.checkViolate(dailyLog.get(), user,reasons);
        dailyLogRepository.save(dailyLog.get());
    }
}
