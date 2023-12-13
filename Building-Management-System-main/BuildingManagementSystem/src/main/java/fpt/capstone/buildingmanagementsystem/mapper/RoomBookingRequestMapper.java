package fpt.capstone.buildingmanagementsystem.mapper;

import fpt.capstone.buildingmanagementsystem.model.entity.RoomBookingFormRoom;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.LeaveRequestForm;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.RoomBookingRequestForm;
import fpt.capstone.buildingmanagementsystem.model.request.RoomBookingRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendLeaveFormRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendRoomBookingRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import javax.persistence.Column;
import java.sql.Date;
import java.sql.Time;
import java.text.ParseException;
@Mapper(componentModel = "spring")
public abstract class RoomBookingRequestMapper {
    @Mappings({
            @Mapping(target = "bookingDate", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToDate(sendRoomBookingRequest.getBookingDate()))"),
            @Mapping(target = "startTime", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToTime(sendRoomBookingRequest.getStartTime()))"),
            @Mapping(target = "endTime", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToTime(sendRoomBookingRequest.getEndTime()))")
    })
    public abstract RoomBookingRequestForm convert(SendRoomBookingRequest sendRoomBookingRequest) throws ParseException;
}
