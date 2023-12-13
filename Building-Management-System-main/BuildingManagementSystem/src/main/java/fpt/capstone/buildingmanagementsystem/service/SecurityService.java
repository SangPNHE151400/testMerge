package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.model.entity.*;
import fpt.capstone.buildingmanagementsystem.model.request.ControlLogAndStrangerLogSearchRequest;
import fpt.capstone.buildingmanagementsystem.model.response.*;
import fpt.capstone.buildingmanagementsystem.repository.*;
import fpt.capstone.buildingmanagementsystem.validate.Validate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SecurityService {
    @Autowired
    ControlLogLcdRepository controlLogLcdRepository;
    @Autowired
    StrangerLogLcdRepository strangerLogLcdRepository;
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    RoomRepository roomRepository;
    @Autowired
    DeviceRepository deviceRepository;

    public List<LoadDeviceResponse> listAllDevice() {
        List<LoadDeviceResponse> loadDeviceResponseList = new ArrayList<>();
        deviceRepository.findAll().forEach(device -> {
            LoadDeviceResponse loadDeviceResponse = LoadDeviceResponse.builder().deviceId(device.getId()).deviceName(device.getDeviceName()).build();
            loadDeviceResponseList.add(loadDeviceResponse);
        });
        return loadDeviceResponseList;
    }

    public List<ControlLogSecurityResponse> getListControlLogByDayAndDevice(ControlLogAndStrangerLogSearchRequest controlLogAndStrangerLogSearchRequest) throws ParseException {
        List<ControlLogSecurityResponse> controlLogSecurityResponseList = new ArrayList<>();
        String startTimeRequest = controlLogAndStrangerLogSearchRequest.getStartTime();
        String endTimeRequest = controlLogAndStrangerLogSearchRequest.getEndTime();
        String date = controlLogAndStrangerLogSearchRequest.getDate();
        if (Validate.validateStartTimeAndEndTime(startTimeRequest, endTimeRequest)) {
            Date startDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(date + " " + startTimeRequest);
            Date endDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(date + " " + endTimeRequest);
            List<ControlLogLcd> controlLogLcdList = controlLogLcdRepository.getControlLogLcdListByDateAndDevice(
                    startDate, endDate, controlLogAndStrangerLogSearchRequest.getDeviceId());
            controlLogLcdList.forEach(element -> {
                User user = accountRepository.findByUsername(element.getPersionName()).get().getUser();
                String room = element.getRoom().getRoomName();
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String formattedDate = dateFormat.format(element.getTime());
                ControlLogSecurityResponse controlLogSecurityResponse = ControlLogSecurityResponse.builder().ControlLogId(element.getControlLogId()).image(element.getPic()).timeRecord(formattedDate)
                        .username(element.getPersionName()).lastName(user.getLastName()).firstName(user.getFirstName()).department(user.getDepartment().getDepartmentName())
                        .room(room).verifyType(element.getStatus().toString()).build();
                controlLogSecurityResponseList.add(controlLogSecurityResponse);
            });
            return controlLogSecurityResponseList;
        } else {
            throw new BadRequest("end_date_must_be_greater_than_start_date");
        }
    }

    public List<StrangerLogSecurityResponse> getListStrangerLogByDayAndDevice(ControlLogAndStrangerLogSearchRequest controlLogAndStrangerLogSearchRequest) throws ParseException {
        List<StrangerLogSecurityResponse> strangerLogSecurityResponses = new ArrayList<>();
        String startTimeRequest = controlLogAndStrangerLogSearchRequest.getStartTime();
        String endTimeRequest = controlLogAndStrangerLogSearchRequest.getEndTime();
        String date = controlLogAndStrangerLogSearchRequest.getDate();
        if (Validate.validateStartTimeAndEndTime(startTimeRequest, endTimeRequest)) {
            Date startDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(date + " " + startTimeRequest);
            Date endDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(date + " " + endTimeRequest);
            List<StrangerLogLcd> strangerLogLcdList = strangerLogLcdRepository.getStrangerLogLcdListByDateAndDevice(
                    startDate, endDate, controlLogAndStrangerLogSearchRequest.getDeviceId());
            strangerLogLcdList.forEach(element -> {
                String room = element.getRoom().getRoomName();
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                String formattedDate = dateFormat.format(element.getTime());
                StrangerLogSecurityResponse strangerLogSecurityResponse = StrangerLogSecurityResponse.builder().strangerLogId(element.getStrangerLogId()).snapId(element.getSnapId()).time(formattedDate)
                        .deviceName(element.getDevice().getDeviceName()).deviceId(element.getDevice().getDeviceId()).image(element.getImage())
                        .temperature(element.getTemperature()).room(room).build();
                strangerLogSecurityResponses.add(strangerLogSecurityResponse);
            });
            return strangerLogSecurityResponses;
        } else {
            throw new BadRequest("end_date_must_be_greater_than_start_date");
        }
    }

    public ControlLogDetailResponse getControlLogDetail(String username, String controlLogId) {
        Optional<ControlLogLcd> controlLogLcdOptional = controlLogLcdRepository.findByControlLogId(controlLogId);
        Optional<Account> accountOptional = accountRepository.findByUsername(username);
        if (accountOptional.isPresent() && controlLogLcdOptional.isPresent()) {
            Account account = accountOptional.get();
            ControlLogLcd controlLogLcd = controlLogLcdOptional.get();
            SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
            SimpleDateFormat dateFormat1 = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            return ControlLogDetailResponse.builder().hireDate(dateFormat.format(account.getCreatedDate())).account(account.getUsername()).avatar(account.getUser().getImage())
                    .role(account.getRole().getRoleName()).department(account.getUser().getDepartment().getDepartmentName())
                    .image(controlLogLcd.getPic()).deviceId(controlLogLcd.getDevice().getDeviceId()).deviceName(controlLogLcd.getDevice().getDeviceName())
                    .time(dateFormat1.format(controlLogLcd.getTime())).similar(controlLogLcd.getSimilarity1()).
                    operator(controlLogLcd.getOperator()).personId(controlLogLcd.getPersonId())
                    .verifyStatus(controlLogLcd.getStatus().toString()).Temperature(controlLogLcd.getTemperature())
                    .build();
        } else {
            throw new NotFound("not_found_control_log_or_account");
        }
    }

    public List<ListAllControlLogByStaffResponse> listAllControlLogByStaff() {
        List<ListAllControlLogByStaffResponse> listAllControlLogByStaffResponses = new ArrayList<>();
        for (Account account : accountRepository.findAll()) {
            if (Objects.equals(account.getRole().getRoleName(), "employee") || Objects.equals(account.getRole().getRoleName(), "manager")) {
                SimpleDateFormat dateFormat1 = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                Optional<List<ControlLogLcd>> listAllControlLog = controlLogLcdRepository.getAll(account.getAccountId());
                String status = "NOT-FOUND";
                if (listAllControlLog.isPresent()) {
                    status = listAllControlLog.get().get(0).getStatus().toString();
                }
                ListAllControlLogByStaffResponse listAllControlLogByStaffResponse = ListAllControlLogByStaffResponse.builder()
                        .username(account.getUsername()).firstName(account.getUser().getFirstName()).lastName(account.getUser().getLastName())
                        .hireDate(dateFormat1.format(account.getCreatedDate())).
                        phone(account.getUser().getTelephoneNumber()).email(account.getUser().getEmail()).gender(account.getUser().getGender())
                        .verifyType(status)
                        .build();
                listAllControlLogByStaffResponses.add(listAllControlLogByStaffResponse);
            }
        }
        listAllControlLogByStaffResponses = listAllControlLogByStaffResponses.stream()
                .sorted((Comparator.comparing(ListAllControlLogByStaffResponse::getUsername)))
                .collect(Collectors.toList());
        return listAllControlLogByStaffResponses;
    }

    public ControlLogInfo getListControlLogByAccount(String username) {
        List<ControlLogByAccountResponse> controlLogByAccountResponseList = new ArrayList<>();
        Optional<List<ControlLogLcd>> controlLogLcdList = controlLogLcdRepository.findAllByPersionName(username);
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        if (controlLogLcdList.isPresent()) {
            List<ControlLogLcd> list = controlLogLcdList.get();
            list = list.stream()
                    .sorted((Comparator.comparing(ControlLogLcd::getTime)).reversed())
                    .collect(Collectors.toList());
            list.forEach(controlLogLcd -> {
                Room room = controlLogLcd.getRoom();
                SimpleDateFormat dateFormat1 = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                Account account = controlLogLcd.getAccount();
                ControlLogByAccountResponse controlLogSecurityResponse = ControlLogByAccountResponse.builder()
                        .image(controlLogLcd.getPic()).timeRecord(dateFormat1.format(controlLogLcd.getTime())).account(controlLogLcd.getPersionName())
                        .department(account.getUser().getDepartment().getDepartmentName())
                        .lastName(account.getUser().getLastName()).firstName(account.getUser().getFirstName())
                        .room(room.getRoomName()).verifyType(controlLogLcd.getStatus().toString())
                        .controlLogId(controlLogLcd.getControlLogId()).build();
                controlLogByAccountResponseList.add(controlLogSecurityResponse);
            });
            return ControlLogInfo.builder().avatar(list.get(0).getAccount().getUser().getImage()).hireDate(dateFormat.format(list.get(0).getAccount().getCreatedDate()))
                    .account(list.get(0).getPersionName()).department(list.get(0).getAccount().getUser().getDepartment().getDepartmentName()).role(list.get(0).getAccount().getRole().getRoleName())
                    .controlLogByAccountResponseList(controlLogByAccountResponseList)
                    .build();
        } else {
            throw new NotFound("user_do_not_have_control_log");
        }
    }
}
