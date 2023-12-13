package fpt.capstone.buildingmanagementsystem.mapper;


import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.OvertimeRequestForm;
import fpt.capstone.buildingmanagementsystem.model.request.SendOvertimeFormRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.text.ParseException;
@Mapper(componentModel = "spring")

public abstract class OvertimeRequestFormMapper {
    @Mappings({
            @Mapping(target = "overtimeDate", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToDate(sendOvertimeFormRequest.getOvertimeDate()))"),
            @Mapping(target = "fromTime", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToTime(sendOvertimeFormRequest.getFromTime()))"),
            @Mapping(target = "toTime", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToTime(sendOvertimeFormRequest.getToTime()))"),
            @Mapping(target = "topicOvertime", expression = "java(fpt.capstone.buildingmanagementsystem.model.enumEnitty.TopicOvertime.valueOf(sendOvertimeFormRequest.getTopicOvertime()))")

    })
        public abstract OvertimeRequestForm convert(SendOvertimeFormRequest sendOvertimeFormRequest) throws ParseException;
}
