package fpt.capstone.buildingmanagementsystem.mapper;

import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.LateRequestForm;
import fpt.capstone.buildingmanagementsystem.model.request.SendLateFormRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.text.ParseException;

@Mapper(componentModel = "spring")

public abstract class LateRequestMapper {
    @Mappings({
            @Mapping(target = "requestDate", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToDate(sendLateFormRequest.getRequestDate()))"),
            @Mapping(target = "lateDuration", expression = "java(Integer.valueOf(sendLateFormRequest.getLateDuration()))"),
            @Mapping(target = "lateType", expression = "java(fpt.capstone.buildingmanagementsystem.model.enumEnitty.LateType.valueOf(sendLateFormRequest.getLateType()))")
    })
    public abstract LateRequestForm convert(SendLateFormRequest sendLateFormRequest) throws ParseException;

}
