package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.exception.NotFound;
import fpt.capstone.buildingmanagementsystem.exception.ServerError;
import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.Device;
import fpt.capstone.buildingmanagementsystem.model.entity.DeviceAccount;
import fpt.capstone.buildingmanagementsystem.model.entity.Room;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ControlLogStatus;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DeviceStatus;
import fpt.capstone.buildingmanagementsystem.model.request.AccountDeviceRequest;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeRecordStatusRequest;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeStatusRequest;
import fpt.capstone.buildingmanagementsystem.model.request.DeviceRequest;
import fpt.capstone.buildingmanagementsystem.model.request.DeviceRoomRequest;
import fpt.capstone.buildingmanagementsystem.model.request.DeviceStatusRequest;
import fpt.capstone.buildingmanagementsystem.model.response.AccountLcdResponse;
import fpt.capstone.buildingmanagementsystem.model.response.DeviceAccountResponse;
import fpt.capstone.buildingmanagementsystem.model.response.DeviceRoomResponse;
import fpt.capstone.buildingmanagementsystem.model.response.RoomResponse;
import fpt.capstone.buildingmanagementsystem.repository.AccountRepository;
import fpt.capstone.buildingmanagementsystem.repository.DeviceAccountRepository;
import fpt.capstone.buildingmanagementsystem.repository.DeviceRepository;
import fpt.capstone.buildingmanagementsystem.repository.RoomRepository;
import fpt.capstone.buildingmanagementsystem.until.Until;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    DeviceAccountRepository deviceAccountRepository;

    @Autowired
    DeviceRepository deviceRepository;

    @Autowired
    RoomRepository roomRepository;

    public List<DeviceRoomResponse> getAllDevice() {
        List<Room> rooms = roomRepository.findAll();
        return rooms.stream()
                .map(room -> new DeviceRoomResponse(
                        room.getRoomId(),
                        room.getRoomName(),
                        room.getDevice().getId(),
                        room.getDevice().getDeviceId(),
                        room.getDevice().getDeviceName(),
                        room.getDevice().getStatus(),
                        room.getDevice().getDeviceUrl(),
                        room.getDevice().getDeviceNote(),
                        room.getDevice().getUpdateDate()
                ))
                .collect(Collectors.toList());
    }

    public ResponseEntity<?> updateDevice(DeviceRoomRequest request) {
        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new NotFound("Not_found_device"));

        if (request.getDeviceLcdId() != null) {
            device.setDeviceId(request.getDeviceLcdId());
        }

        if (request.getDeviceName() != null) {
            device.setDeviceName(request.getDeviceName());
        }
        if (request.getDeviceUrl() != null) {
            device.setDeviceUrl(request.getDeviceUrl());
        }

        if (!device.getStatus().equals(DeviceStatus.INACTIVE)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Device_is_active");
        }
        int roomId = Integer.parseInt(request.getNewRoomId());
        List<Room> roomExist = roomRepository.getRoomByInActiveDevice(roomId);
        if (roomExist.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Room_contained_device_active");
        }
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new BadRequest("Not_found_room"));

        room.setDevice(device);
        roomRepository.save(room);
        try {
            Device deviceResponse = deviceRepository.save(device);
            DeviceRoomResponse response = new DeviceRoomResponse(
                room.getRoomId(),
                    room.getRoomName(),
                    deviceResponse.getId(),
                    deviceResponse.getDeviceId(),
                    deviceResponse.getDeviceName(),
                    deviceResponse.getStatus(),
                    deviceResponse.getDeviceUrl(),
                    deviceResponse.getDeviceNote(),
                    deviceResponse.getUpdateDate()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("fail");
        }
    }

    public ResponseEntity<?> updateDeviceStatus(DeviceStatusRequest request) {
        Device device = deviceRepository.findById(request.getId())
                .orElseThrow(() -> new BadRequest("Not_found_device"));
        device.setStatus(request.getStatus());
        device.setDeviceNote(request.getDeviceNote());
        try {
            return ResponseEntity.ok(deviceRepository.save(device));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getCause());
        }
    }

    @Deprecated
    public ResponseEntity<?> deleteDevice(DeviceRequest deviceRequest) {
        try {
            Device device = deviceRepository.findById(deviceRequest.getDeviceId())
                    .orElseThrow(() -> new BadRequest("Not_found_device"));
            List<DeviceAccount> deviceAccounts = deviceAccountRepository.findByDevice(device);

            List<DeviceAccount> whiteListAccount = deviceAccounts.stream()
                    .filter(deviceAccount -> deviceAccount.getStatus().equals(ControlLogStatus.WHITE_LIST))
                    .collect(Collectors.toList());
            if (whiteListAccount.isEmpty()) {
                //delete device account
                if (!deviceAccounts.isEmpty()) {
                    deviceAccountRepository.deleteAll(deviceAccounts);
                }

                List<Room> rooms = roomRepository.getRoomByDevice(device.getId());
                if (rooms.isEmpty()) {
//                    Room room = rooms.get();
//                    room.setDevice(null);
                    roomRepository.saveAll(rooms);
                }
                deviceRepository.delete(device);
                return ResponseEntity.ok(device);
            }
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(whiteListAccount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getCause());
        }
    }

    public DeviceAccountResponse getDeviceDetail(String deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new BadRequest("Not_found_device"));

        DeviceAccountResponse response = DeviceAccountResponse.builder()
                .deviceId(device.getId())
                .deviceLcdId(device.getDeviceId())
                .deviceName(device.getDeviceName())
                .createdDate(device.getCreatedDate())
                .status(device.getStatus())
                .build();

        List<Room> rooms = roomRepository.getRoomByDevice(device.getId());
        if (!rooms.isEmpty()) {
            List<RoomResponse> roomResponses = rooms.stream()
                    .map(room -> new RoomResponse(room.getRoomId(), room.getRoomName()))
                    .collect(Collectors.toList());
            response.setRooms(roomResponses);
        }
        List<AccountLcdResponse> deviceAccounts = deviceAccountRepository.findByDevice(device)
                .stream()
                .map(deviceAccount -> new AccountLcdResponse(
                        deviceAccount.getDeviceAccountId(),
                        deviceAccount.getAccount().accountId,
                        deviceAccount.getAccount().getUsername(),
                        deviceAccount.getAccount().getUser().getFirstName(),
                        deviceAccount.getAccount().getUser().getFirstName(),
                        deviceAccount.getAccount().getUser().getDepartment(),
                        deviceAccount.getStartDate(),
                        deviceAccount.getEndDate(),
                        deviceAccount.getStatus(),
                        ""
                ))
                .collect(Collectors.toList());

        response.setAccountLcdResponses(deviceAccounts);
        return response;
    }

    public ResponseEntity<?> registerNewAccount(AccountDeviceRequest request) {
        try {
            if (request.getAccountId() != null
                    || request.getRoomIdString() != null
                    || request.getStartDate() != null) {
                Account account = accountRepository.findById(request.getAccountId())
                        .orElseThrow(() -> new BadRequest("Not_found_user"));

                int roomId = Integer.parseInt(request.getRoomIdString());
                Room room = roomRepository.findById(roomId)
                        .orElseThrow(() -> new BadRequest("Not_found_room"));
                java.util.Date fromDate = Until.convertStringToDateTime(request.getStartDate());

                java.util.Date toDate = null;
                if (request.getEndDate() != null) {
                    toDate = Until.convertStringToDateTime(request.getEndDate());
                    if (fromDate.compareTo(toDate) > 0) {
                        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                                .body(request);
                    }
                }
                List<DeviceAccount> deviceAccounts = deviceAccountRepository.findByDeviceAndAccount(room.getDevice(), account);

                for (DeviceAccount deviceAccount : deviceAccounts) {
                    if (deviceAccount.getStartDate().compareTo(fromDate) == 0) {
                        if ((deviceAccount.getEndDate() == null && toDate == null)) {
                            if (deviceAccount.getStatus().equals(ControlLogStatus.BLACK_LIST)) {
                                deviceAccount.setStatus(ControlLogStatus.WHITE_LIST);
                                deviceAccountRepository.save(deviceAccount);
                                int status = deviceAccount.getStatus().equals(ControlLogStatus.WHITE_LIST) ? 1 : 0;
                                return ResponseEntity.ok(messageEditPerson(deviceAccount.getDevice().getDeviceId(), account.getAccountId(), status));
                            }
                            return ResponseEntity.status(HttpStatus.CONFLICT)
                                    .body(request);
                        }
                        if (deviceAccount.getEndDate() != null && toDate != null && deviceAccount.getEndDate().compareTo(toDate) == 0) {
                            if (deviceAccount.getStatus().equals(ControlLogStatus.BLACK_LIST)) {
                                deviceAccount.setStatus(ControlLogStatus.WHITE_LIST);
                                deviceAccountRepository.save(deviceAccount);
                                int status = deviceAccount.getStatus().equals(ControlLogStatus.WHITE_LIST) ? 1 : 0;
                                return ResponseEntity.ok(messageEditPerson(deviceAccount.getDevice().getDeviceId(), account.getAccountId(), status));
                            }
                            return ResponseEntity.status(HttpStatus.CONFLICT)
                                    .body(request);
                        }
                    }
                }

                DeviceAccount deviceAccount = DeviceAccount.builder()
                        .startDate(fromDate)
                        .createdDate(Until.generateRealTime())
                        .updateDate(Until.generateRealTime())
                        .status(ControlLogStatus.WHITE_LIST)
                        .device(room.getDevice())
                        .account(account)
                        .build();
                if (toDate != null) deviceAccount.setEndDate(toDate);
                DeviceAccount saveTo = deviceAccountRepository.save(deviceAccount);
                String messageSetupMqtt = messageSetupMqtt(saveTo.getAccount().getAccountId(), request.getStartDate(), request.getEndDate(), saveTo.getDevice().getDeviceId());
                AccountLcdResponse response = AccountLcdResponse.builder()
                        .deviceAccountId(saveTo.getDeviceAccountId())
                        .accountId(saveTo.getAccount().getAccountId())
                        .userName(saveTo.getAccount().getUsername())
                        .firstName(saveTo.getAccount().getUser().getFirstName())
                        .lastName(saveTo.getAccount().getUser().getLastName())
                        .department(saveTo.getAccount().getUser().getDepartment())
                        .startDate(saveTo.getStartDate())
                        .endDate(saveTo.getEndDate())
                        .status(saveTo.getStatus())
                        .messageSetupMqtt(messageSetupMqtt)
                        .build();
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(request);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getCause());
        }
    }

    public ResponseEntity<?> changeRecordStatus(ChangeRecordStatusRequest request) {
        DeviceAccount deviceAccount = deviceAccountRepository.findById(request.getDeviceAccountId())
                .orElseThrow(() -> new BadRequest("Not_found_record"));

        deviceAccount.setStatus(request.getStatus());
        try {
            deviceAccountRepository.save(deviceAccount);
            return ResponseEntity.ok(true);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getCause());
        }
    }

    public boolean changeAccountStatus(ChangeStatusRequest request) {
        try {
            Account account = accountRepository.findById(request.getAccountId())
                    .orElseThrow(() -> new BadRequest("Not_found_user"));

            List<DeviceAccount> deviceAccounts = deviceAccountRepository.findByAccount(account);

            deviceAccounts.forEach(deviceAccount -> deviceAccount.setStatus(request.getStatus()));

            deviceAccountRepository.saveAll(deviceAccounts);

            return true;
        } catch (Exception e) {
            throw new ServerError("fails");
        }
    }

    public void deleteAccountDevice(String accountId) {
        Account account = accountRepository.findByAccountId(accountId)
                .orElseThrow(() -> new BadRequest("Not_found_account"));

        List<DeviceAccount> deviceAccounts = deviceAccountRepository.findByAccount(account);

        try {
            deviceAccountRepository.deleteAll(deviceAccounts);
        } catch (Exception e) {
            throw new ServerError("fails");
        }
    }


    public String messageSetupMqtt(String accountId, String startDate, String endDate, String deviceLcdId) {
        return "{\n" +
                " \"DataBegin\":\"BeginFlag\",\n" +
                " \"operator\":\"AddPersons\", \n" +
                "\"PersonNum\":\"1000\", \n" +
                "\"info\":\n" +
                "[\n" +
                "\t{\n" +
                "\t\t\"customId\":\"" + accountId + "\", \n" +
                "\t\t\"name\":\"test000\",\n" +
                "\t\t\"nation\":1,\n" +
                "\t\t\"gender\":0,\n" +
                "\t\t\"birthday\":\"1992-06-13\", \n" +
                "\t\t\"address\":\" Baoan District, Shenzhen City, Guangdong Province \",\n" +
                "\t\t\"idCard\":\"" + deviceLcdId + "\", \n" +
                "\t\t\"tempCardType\":0, \n" +
                "\t\t\"EffectNumber\":3,\n" +
                "\t\t \"cardValidBegin\":\"" + startDate + "\", \n" +
                "\t\t\"cardValidEnd\":\"" + endDate + "\", \n" +
                "\t\t\"telnum1\":\"13690880000\",\n" +
                "\t\t \"native\":\" Shenzhen , Guangdong \", \n" +
                "\t\t\"cardType2\":0, \"notes\":\"\",\n" +
                "\t\t \"personType\":0, \n" +
                "\t\t\"cardType\":0,\n" +
                "\t\t\"picURI\":\"https://btgongpluss.oss-cn-beijing.aliyuncs.com/bigheadphoto/xxx.jpg\"\n" +
                "\t }\n" +
                "]\n" +
                "\n" +
                " \"DataEnd\":\"EndFlag\" \n" +
                "}\n";
    }

    public String messageEditPerson(String lcdDeviceId, String accountId, int status) {
        return "{ \n" +
                "\"operator\": \" EditPerson-Ac k \", \n" +
                "\"info\": \n" +
                "{ \n" +
                "\"facesluiceId\":\"" + lcdDeviceId + "\", \n" +
                "\"personId\":\"" + accountId + "\", \n" +
                " \t\t\"result\":\"ok\", \n" +
                "\"detail\":\"\" \n" +
                "\"personType\":\"" + status + "\"" +
                "}\n" +
                " }\n";
    }
}

