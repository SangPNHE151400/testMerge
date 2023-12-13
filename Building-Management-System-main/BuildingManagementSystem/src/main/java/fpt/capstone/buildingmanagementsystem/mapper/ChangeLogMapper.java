package fpt.capstone.buildingmanagementsystem.mapper;

import fpt.capstone.buildingmanagementsystem.model.entity.ChangeLog;
import fpt.capstone.buildingmanagementsystem.model.request.SaveChangeLogRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.text.ParseException;

@Mapper(componentModel = "spring")
public abstract class ChangeLogMapper {
    @Mappings({
            @Mapping(target = "date", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToDate(saveChangeLogRequest.getDate()))"),
            @Mapping(target = "checkin", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToTime(saveChangeLogRequest.getManualCheckIn()))"),
            @Mapping(target = "checkout", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToTime(saveChangeLogRequest.getManualCheckOut()))"),
            @Mapping(target = "createdDate", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.generateRealTime())")

    })
    public abstract ChangeLog convert(SaveChangeLogRequest saveChangeLogRequest) throws ParseException;
}
