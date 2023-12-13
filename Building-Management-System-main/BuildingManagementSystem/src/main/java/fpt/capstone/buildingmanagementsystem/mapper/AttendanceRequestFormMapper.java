package fpt.capstone.buildingmanagementsystem.mapper;


import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.AttendanceRequestForm;
import fpt.capstone.buildingmanagementsystem.model.request.SendAttendanceFormRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import javax.persistence.Column;
import java.sql.Date;
import java.sql.Time;
import java.text.ParseException;

@Mapper(componentModel = "spring")

public abstract class AttendanceRequestFormMapper {

    @Mappings({
            @Mapping(target = "manualDate", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToDate(sendAttendanceFormRequest.getManualDate()))"),
            @Mapping(target = "manualFirstEntry", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToTime(sendAttendanceFormRequest.getManualFirstEntry()))"),
            @Mapping(target = "manualLastExit", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToTime(sendAttendanceFormRequest.getManualLastExit()))")
    })
    public abstract AttendanceRequestForm convert(SendAttendanceFormRequest sendAttendanceFormRequest) throws ParseException;
}
