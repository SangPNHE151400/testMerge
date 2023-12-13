package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.model.dto.RequestTicketDto;
import fpt.capstone.buildingmanagementsystem.model.dto.TicketDto;
import fpt.capstone.buildingmanagementsystem.model.dto.TicketRequestDto;
import fpt.capstone.buildingmanagementsystem.model.entity.*;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicEnum;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeReceiveIdRequest;
import fpt.capstone.buildingmanagementsystem.model.response.RequestTicketResponse;
import fpt.capstone.buildingmanagementsystem.model.response.TicketRequestResponse;
import fpt.capstone.buildingmanagementsystem.model.response.TicketRequestResponseV2;
import fpt.capstone.buildingmanagementsystem.repository.RequestMessageRepository;
import fpt.capstone.buildingmanagementsystem.repository.RequestTicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.TicketRepository;
import fpt.capstone.buildingmanagementsystem.repository.TicketRepositoryv2;
import fpt.capstone.buildingmanagementsystem.repository.UserRepository;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.RequestStatus.*;
import static java.util.stream.Collectors.groupingBy;

@Service
public class TicketManageService {

    @Autowired
    private TicketRepositoryv2 ticketRepositoryv2;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    TicketRepository ticketRepository;
    @Autowired
    RequestTicketRepository requestTicketRepository;
    @Autowired
    RequestMessageRepository requestMessageRepository;

    @Deprecated
    public List<TicketRequestResponse> getAllTickets() {
        List<TicketRequestResponse> ticketRequestResponses = new ArrayList<>();
        Map<String, List<TicketDto>> ticketDtos = ticketRepositoryv2.getAllTicketRequest()
                .stream()
                .collect(groupingBy(TicketDto::getTicketId, Collectors.toList()));

        ticketDtos.forEach((s, tickets) -> {
            List<RequestTicketDto> requestTicketDtos = new ArrayList<>();
            TicketRequestResponse ticketResponse = new TicketRequestResponse();
            BeanUtils.copyProperties(tickets.get(0), ticketResponse);
            tickets.forEach(ticketDto -> {
                RequestTicketDto requestTicketDto = new RequestTicketDto();
                BeanUtils.copyProperties(ticketDto, requestTicketDto);
                requestTicketDto.setRequestStatus(ticketDto.getRequestStatus());
                requestTicketDtos.add(requestTicketDto);
            });
            ticketResponse.setRequestTicketDtos(requestTicketDtos);
            ticketRequestResponses.add(ticketResponse);
        });
        return ticketRequestResponses;
    }

    public List<TicketRequestResponseV2> getAllTicketsBySenderId(String senderId) {
        List<TicketRequestResponseV2> responseV2s = new ArrayList<>();
        Map<String, List<TicketRequestDto>> ticketDtos = ticketRepositoryv2.getTicketRequestBySenderId(senderId)
                .stream()
                .collect(groupingBy(TicketRequestDto::getTicketId, Collectors.toList()));

        executeListTicketResponse(responseV2s, ticketDtos);
        return responseV2s.stream()
                .sorted((Comparator.comparing(TicketRequestResponseV2::getUpdateDate).reversed()))
                .collect(Collectors.toList());
    }

    private void executeListTicketResponse(List<TicketRequestResponseV2> responseV2s, Map<String, List<TicketRequestDto>> ticketDtos) {
        ticketDtos.forEach((s, tickets) -> {
            List<RequestTicketResponse> requestTickets = new ArrayList<>();
            TicketRequestResponseV2 ticketResponse = new TicketRequestResponseV2();
            BeanUtils.copyProperties(tickets.get(0), ticketResponse);
            tickets.forEach(ticketDto -> {
                RequestTicketResponse requestTicket = new RequestTicketResponse();
                BeanUtils.copyProperties(ticketDto, requestTicket);
                requestTicket.setRequestStatus(ticketDto.getRequestStatus());
                requestTickets.add(requestTicket);
            });
            ticketResponse.setRequestTickets(requestTickets);
            responseV2s.add(ticketResponse);
        });
    }

    public List<TicketRequestResponseV2> getAllTicketsByHr() {
        List<TicketRequestResponseV2> responseV2s = new ArrayList<>();
        Map<String, List<TicketRequestDto>> ticketDtos = ticketRepositoryv2.getTicketRequestByHr()
                .stream()
                .collect(groupingBy(TicketRequestDto::getTicketId, Collectors.toList()));

        return getTicketRequestResponse(responseV2s, ticketDtos);
    }

    public List<TicketRequestResponseV2> getAllTicketsBySecurity() {
        List<TicketRequestResponseV2> responseV2s = new ArrayList<>();
        Map<String, List<TicketRequestDto>> ticketDtos = ticketRepositoryv2.getTicketRequestBySecurity()
                .stream()
                .collect(groupingBy(TicketRequestDto::getTicketId, Collectors.toList()));
        return getTicketRequestResponse(responseV2s, ticketDtos);
    }

    public List<TicketRequestResponseV2> getAllTicketsByAdmin() {
        List<TicketRequestResponseV2> responseV2s = new ArrayList<>();
        Map<String, List<TicketRequestDto>> ticketDtos = ticketRepositoryv2.getTicketRequestByAdmin()
                .stream()
                .collect(groupingBy(TicketRequestDto::getTicketId, Collectors.toList()));
        return getTicketRequestResponse(responseV2s, ticketDtos);
    }

    public List<TicketRequestResponseV2> getAllTicketByDepartmentManager(String departmentName) {
        List<TicketRequestResponseV2> responseV2s = new ArrayList<>();
//        List<User> manager = userRepository.getManagerByDepartment(departmentName);
//        if (manager.isEmpty()) return new ArrayList<>();
        Map<String, List<TicketRequestDto>> ticketDtos = ticketRepositoryv2.getTicketRequestByDepartment(departmentName)
                .stream()
                .collect(groupingBy(TicketRequestDto::getTicketId, Collectors.toList()));
        return getTicketRequestResponse(responseV2s, ticketDtos);
    }


    private List<TicketRequestResponseV2> getTicketRequestResponse(List<TicketRequestResponseV2> responseV2s, Map<String, List<TicketRequestDto>> ticketDtos) {
        executeListTicketResponse(responseV2s, ticketDtos);
        return responseV2s.stream()
                .sorted((Comparator.comparing(TicketRequestResponseV2::getUpdateDate)).reversed())
                .sorted((Comparator.comparing(TicketRequestResponseV2::isStatus)).reversed())
                .collect(Collectors.toList());

    }

    @Transactional
    public boolean changeReceiveId(ChangeReceiveIdRequest changeReceiveIdRequest) {
        if (changeReceiveIdRequest.getReceiverId() != null &&
                changeReceiveIdRequest.getRequestId() != null) {
            if (!userRepository.findByUserId(changeReceiveIdRequest.getReceiverId()).isPresent()) {
                throw new NotFound("receiver_id_not_found");
            }
            Date time = Until.generateRealTime();
            requestMessageRepository.updateTicketRequestTime(changeReceiveIdRequest.getReceiverId(), time, changeReceiveIdRequest.getRequestId());
            RequestTicket requestTicket = requestTicketRepository.findByRequestId(changeReceiveIdRequest.getRequestId()).get();
            requestTicket.setStatus(EXECUTING);
            requestTicket.setUpdateDate(time);
            requestTicket.setRequestId(changeReceiveIdRequest.getRequestId());
            requestTicketRepository.save(requestTicket);
            if (requestTicketRepository.findByRequestId(changeReceiveIdRequest.getRequestId()).isPresent()) {
                String ticketId = requestTicketRepository.findByRequestId(changeReceiveIdRequest.getRequestId()).get().getTicketRequest().getTicketId();
                ticketRepository.updateTicketTime(time, ticketId);
                return true;
            } else {
                throw new NotFound("request_ticket_not_found");
            }
        } else {
            throw new BadRequest("request_fail");
        }
    }

    public void updateTicketOfNewManager(Account account, InactiveManagerTemp inactiveManager) {
        Map<String, List<TicketRequestDto>> ticketReceives = ticketRepositoryv2.getTicketRequestByDepartment(inactiveManager.getDepartment().getDepartmentName())
                .stream()
                .collect(groupingBy(TicketRequestDto::getTicketId, Collectors.toList()));

        ticketReceives.forEach((key, messages) -> {
            Ticket ticket = ticketRepository.findById(key)
                    .orElseThrow(() -> new BadRequest("Not_found_ticket"));
            if (ticket.isStatus()) {
                RequestMessage firstMessage = requestMessageRepository.findById(messages.get(0).getMessageId())
                        .orElseThrow(() -> new BadRequest("Not_found_message"));
                firstMessage.setReceiver(account.getUser());
                requestMessageRepository.save(firstMessage);
            }
        });

        //close all tickets are send of old manager
        Map<String, List<TicketRequestDto>> ticketSends = ticketRepositoryv2.getTicketRequestBySenderId(inactiveManager.getManager().getAccountId())
                .stream()
                .collect(groupingBy(TicketRequestDto::getTicketId, Collectors.toList()));

        ticketSends.forEach((key, messages) -> {
            Ticket ticket = ticketRepository.findById(key)
                    .orElseThrow(() -> new BadRequest("Not_found_ticket"));

            List<RequestTicket> requestTickets = requestTicketRepository.findByRequestIdIn(
                    messages.stream()
                            .map(TicketRequestDto::getRequestId)
                            .collect(Collectors.toList())
            );

            ticket.setStatus(false);
            ticket.setUpdateDate(Until.generateRealTime());
            requestTickets.forEach(requestTicket -> {
                requestTicket.setStatus(RequestStatus.CLOSED);
                requestTicket.setUpdateDate(Until.generateRealTime());
            });
            ticketRepository.save(ticket);
            requestTicketRepository.saveAll(requestTickets);
        });

    }
    public void resetTicketData(User user) {
        List<RequestMessage> requestMessageR = requestMessageRepository.findAllByReceiver(user);
        List<RequestMessage> requestMessageS = requestMessageRepository.findAllBySender(user);
        requestMessageR.forEach(requestMessage1 -> {
            if (requestMessage1.getRequest().getTicketRequest().isStatus()) {
                requestMessage1.setReceiver(null);
                requestMessage1.setUpdateDate(Until.generateRealTime());
                requestMessageRepository.save(requestMessage1);
                RequestTicket requestTicket = requestMessage1.getRequest();
                requestTicket.setUpdateDate(Until.generateRealTime());
                requestTicket.setStatus(PENDING);
                requestTicketRepository.save(requestTicket);
                Ticket ticket = requestMessage1.getRequest().getTicketRequest();
                ticket.setUpdateDate(Until.generateRealTime());
                ticketRepository.save(ticket);
            }
        });
        requestMessageS.forEach(requestMessage -> {
            if (requestMessage.getRequest().getTicketRequest().isStatus()) {
                RequestTicket requestTicket = requestMessage.getRequest();
                requestTicket.setUpdateDate(Until.generateRealTime());
                requestTicket.setStatus(CLOSED);
                requestTicketRepository.save(requestTicket);
                Ticket ticket = requestMessage.getRequest().getTicketRequest();
                ticket.setStatus(false);
                ticket.setUpdateDate(Until.generateRealTime());
                ticketRepository.save(ticket);
            }
        });
    }
    public void closeAllTicketWhenAcceptEvaluate(String employeeId, int month, int year) {
        List<Ticket> tickets = ticketRepository.findByUserIdAndMonthAndYear(employeeId, month, year)
                .stream()
                .filter(ticket -> !ticket.getTopic().equals(TopicEnum.OTHER_REQUEST) ||
                        !ticket.getTopic().equals(TopicEnum.ROOM_REQUEST))
                .collect(Collectors.toList());

        if (tickets.isEmpty()) return;
        List<RequestTicket> requestTickets = requestTicketRepository.findByTicketRequestIn(tickets);
        tickets.forEach(ticket -> ticket.setStatus(false));
        requestTickets.forEach(requestTicket -> requestTicket.setStatus(RequestStatus.CLOSED));
        try {
            ticketRepository.saveAll(tickets);
            requestTicketRepository.saveAll(requestTickets);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
