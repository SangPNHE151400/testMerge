package fpt.capstone.buildingmanagementsystem.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.util.Base64;
import fpt.capstone.buildingmanagementsystem.exception.BadRequest;
import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.ControlLogLcd;
import fpt.capstone.buildingmanagementsystem.model.entity.Device;
import fpt.capstone.buildingmanagementsystem.model.entity.Room;
import fpt.capstone.buildingmanagementsystem.model.entity.StrangerLogLcd;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.ControlLogStatus;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.DeviceStatus;
import fpt.capstone.buildingmanagementsystem.repository.AccountRepository;
import fpt.capstone.buildingmanagementsystem.repository.ControlLogLcdRepository;
import fpt.capstone.buildingmanagementsystem.repository.DeviceRepository;
import fpt.capstone.buildingmanagementsystem.repository.RoomRepository;
import fpt.capstone.buildingmanagementsystem.repository.StrangerLogLcdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

@Component
public class LcdService {
    //    private static final Logger logger = LoggerFactory.getLogger(LcdService.class);
    private static final String CONTROL_LOG = "RecPush";

    private static final String STRANGER_LOG = "StrSnapPush";

    private static final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Autowired
    ControlLogLcdRepository controlLogLcdRepository;

    @Autowired
    DailyLogService dailyLogService;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    DeviceRepository deviceRepository;

    @Autowired
    StrangerLogLcdRepository strangerLogLcdRepository;

    @Autowired
    RoomRepository roomRepository;

    public void ExtractJsonLcdLog(String jsonStr) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonStr);
            JsonNode infoNode = rootNode.path("info");

            String operator = rootNode.get("operator").asText();

            if (operator.equals(CONTROL_LOG)) {
                String time = infoNode.path("time").asText();
                ControlLogLcd controlLogLcd = ControlLogLcd.builder()
                        .operator(rootNode.path("operator").asText())
                        .personId(infoNode.path("personId").asText())
                        .status(infoNode.path("PersonType").asInt() == 0 ? ControlLogStatus.WHITE_LIST : ControlLogStatus.BLACK_LIST)
                        .recordId(infoNode.path("RecordID").asInt())
                        .verifyStatus(infoNode.path("VerifyStatus").asInt())
                        .similarity1(infoNode.path("similarity1").asDouble())
                        .similarity2(infoNode.path("similarity2").asDouble())
                        .persionName(infoNode.path("persionName").asText())
                        .telnum(infoNode.path("telnum").asText())
                        .temperature(infoNode.path("temperature").asDouble())
                        .temperatureAlarm(infoNode.path("temperatureAlarm").asDouble())
                        .time(formatter.parse(time))
                        .pic(convertBase64ToByteArray(infoNode.path("pic").asText()))
                        .build();
                String deviceId = infoNode.path("facesluiceId").asText();

                Device device = deviceRepository.findByDeviceIdAndStatus(deviceId, DeviceStatus.ACTIVE)
                        .orElseThrow(() -> new BadRequest("Not_found"));
                List<Room> rooms = roomRepository.getRoomByDevice(device.getId());
                Account account = accountRepository.findByUsername(controlLogLcd.getPersionName())
                        .orElseThrow(() -> new BadRequest("Not_found"));
                controlLogLcd.setAccount(account);
                controlLogLcd.setDevice(device);
                if (!rooms.isEmpty()) {
                    controlLogLcd.setRoom(rooms.get(0));
                }
                controlLogLcdRepository.save(controlLogLcd);
                if (controlLogLcd.getStatus().equals(ControlLogStatus.WHITE_LIST)) {
                    dailyLogService.mapControlLogToDailyLog(controlLogLcd);
                }

            } else if (operator.equals(STRANGER_LOG)) {
                String time = infoNode.path("time").asText();
                StrangerLogLcd strangerLogLcd = StrangerLogLcd.builder()
                        .snapId(infoNode.path("SnapID").asInt())
                        .direction(infoNode.path("direction").asText())
                        .time(formatter.parse(time))
                        .temperature(infoNode.path("temperature").asDouble())
                        .temperatureAlarm(infoNode.path("temperatureAlarm").asDouble())
                        .image(convertBase64ToByteArray(infoNode.path("pic").asText()))
                        .build();

                String deviceId = infoNode.path("facesluiceId").asText();
                Device device = deviceRepository.findByDeviceIdAndStatus(deviceId, DeviceStatus.ACTIVE)
                        .orElseThrow(() -> new BadRequest("Not_found"));
                List<Room> rooms = roomRepository.getRoomByDevice(device.getId());
                if (!rooms.isEmpty()) {
                    strangerLogLcd.setRoom(rooms.get(0));
                }
                strangerLogLcd.setDevice(device);
                strangerLogLcdRepository.save(strangerLogLcd);
            }
        } catch (IOException | ParseException e) {
            throw new RuntimeException(e);
        }
    }

    private static byte[] convertBase64ToByteArray(String base64Str) {
        String image = base64Str.substring("data:image/jpeg;base64,".length());
        return Base64.decodeBase64(image);
    }
}
