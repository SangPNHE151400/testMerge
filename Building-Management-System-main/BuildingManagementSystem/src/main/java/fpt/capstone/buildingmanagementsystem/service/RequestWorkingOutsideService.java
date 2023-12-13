package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.model.entity.DailyLog;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestTicket;
import fpt.capstone.buildingmanagementsystem.model.entity.Ticket;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.WorkingOutsideRequestForm;
import fpt.capstone.buildingmanagementsystem.model.request.ApprovalNotificationRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendOtherFormRequest;
import fpt.capstone.buildingmanagementsystem.model.request.WorkingOutsideRequest;
import fpt.capstone.buildingmanagementsystem.repository.DailyLogRepository;
import fpt.capstone.buildingmanagementsystem.repository.DepartmentRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestMessageRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestTicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.TicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.TicketRepositoryv2;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.repository.WorkingOutsideFormRepository;
import fpt.capstone.buildingmanagementsystem.service.schedule.CheckoutAnalyzeSchedule;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RequestWorkingOutsideService {
    @Autowired
    DailyLogRepository dailyLogRepository;
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
    WorkingOutsideFormRepository workingOutsideRepository;

    @Autowired
    CheckoutAnalyzeSchedule checkoutAnalyzeSchedule;


    public boolean acceptWorkingOutsideRequest(String acceptWorkingOutsideRequestId) {
        WorkingOutsideRequestForm workingOutsideForm = workingOutsideRepository.findById(acceptWorkingOutsideRequestId)
                .orElseThrow(() -> new BadRequest("Not_found_working_outside_request"));

        RequestMessage requestMessage = requestMessageRepository.findById(workingOutsideForm.getRequestMessage().getRequestMessageId())
                .orElseThrow(() -> new BadRequest("Not_found_request_message"));

        RequestTicket requestTicket = requestTicketRepository.findById(requestMessage.getRequest().getRequestId())
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        Ticket ticket = ticketRepository.findById(requestTicket.getTicketRequest().getTicketId())
                .orElseThrow(() -> new BadRequest("Not_found_ticket"));

        SendOtherFormRequest sendOtherFormRequest = SendOtherFormRequest.builder()
                .userId(requestMessage.getReceiver().getUserId())
                .ticketId(ticket.getTicketId())
                .requestId(requestTicket.getRequestId())
                .title("Approve working outside request")
                .content("Approve working outside request")
                .departmentId(requestMessage.getDepartment().getDepartmentId())
                .receivedId(requestMessage.getSender().getUserId())
                .build();
        List<RequestTicket> requestTickets = requestTicketRepository.findByTicketRequest(ticket);

        executeRequestDecision(requestTickets, ticket, sendOtherFormRequest);
        try {
            workingOutsideForm.setStatus(true);
            workingOutsideRepository.saveAndFlush(workingOutsideForm);
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
            updateWorkingOutside(requestTicket.getUser(), workingOutsideForm.getDate(), workingOutsideForm.getContent());
            return true;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    @javax.transaction.Transactional
    public boolean rejectWorkingOutside(WorkingOutsideRequest workingOutsideRequest) {
        WorkingOutsideRequestForm workingOutsideForm = workingOutsideRepository.findById(workingOutsideRequest.getWorkOutsideRequestId())
                .orElseThrow(() -> new BadRequest("Not_found_working_outside_request"));

        RequestMessage requestMessage = requestMessageRepository.findById(workingOutsideForm.getRequestMessage().getRequestMessageId())
                .orElseThrow(() -> new BadRequest("Not_found_request_message"));

        RequestTicket requestTicket = requestTicketRepository.findById(requestMessage.getRequest().getRequestId())
                .orElseThrow(() -> new BadRequest("Not_found_request_ticket"));

        Ticket ticket = ticketRepository.findById(requestTicket.getTicketRequest().getTicketId())
                .orElseThrow(() -> new BadRequest("Not_found_ticket"));

        SendOtherFormRequest sendOtherFormRequest = SendOtherFormRequest.builder()
                .userId(requestMessage.getReceiver().getUserId())
                .ticketId(ticket.getTicketId())
                .requestId(requestTicket.getRequestId())
                .title("Reject working outside request")
                .content(workingOutsideForm.getContent())
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
                            workingOutsideForm.getContent()
                    ));
            return true;
        } catch (Exception e) {
            throw new ServerError("Fail");
        }
    }

    private void executeRequestDecision(List<RequestTicket> requestTickets, Ticket ticket, SendOtherFormRequest sendOtherFormRequest) {
        RequestAttendanceFromService.executeDuplicate(requestTickets, ticket, sendOtherFormRequest, requestOtherService);
    }

    private void updateWorkingOutside(User user, Date date, String reasons) {
        Optional<DailyLog> dailyLogOptional = dailyLogRepository.findByUserAndDate(user, date);
        if (!dailyLogOptional.isPresent()) return;
        DailyLog dailyLog = dailyLogOptional.get();
        double workingOutsideChange = checkoutAnalyzeSchedule.checkWorkingOutside(dailyLog, user.getAccount(), date);
        boolean isViolate = checkoutAnalyzeSchedule.checkViolate(dailyLog, user.getAccount(), date);
        //change log check
        Date instanceDate = new Date(Until.generateDate().getTime());
        if (instanceDate.compareTo(dailyLog.getDate()) > 0) {
            checkoutAnalyzeSchedule.saveToChangeLog(user.getAccount(), date, workingOutsideChange, isViolate, reasons);
        }
        try {
            dailyLogRepository.save(dailyLog);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
