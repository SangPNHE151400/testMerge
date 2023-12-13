package fpt.capstone.buildingmanagementsystem.mapper;

import fpt.capstone.buildingmanagementsystem.model.entity.Notification;
import fpt.capstone.buildingmanagementsystem.model.request.SaveNotificationRequest;
import fpt.capstone.buildingmanagementsystem.model.request.UpdateNotificationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.text.ParseException;

@Mapper(componentModel = "spring")
public abstract class NotificationMapper {
    @Mappings({
            @Mapping(target = "createDate", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.generateRealTime())"),
            @Mapping(target = "updateDate", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.generateRealTime())")
    })
    public abstract Notification convert(SaveNotificationRequest saveNotificationRequest) throws ParseException;
    @Mappings({
            @Mapping(target = "updateDate", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.generateRealTime())")
    })
    public abstract Notification convert(UpdateNotificationRequest updateNotificationRequest) throws ParseException;
}
