package fpt.capstone.buildingmanagementsystem.mapper;

import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.LeaveRequestForm;
import fpt.capstone.buildingmanagementsystem.model.request.SendLeaveFormRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.text.ParseException;

@Mapper(componentModel = "spring")
public abstract class LeaveRequestFormMapper {
    @Mappings({
            @Mapping(target = "fromDate", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToDate(sendLeaveFormRequest.getFromDate()))"),
            @Mapping(target = "toDate", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToDate(sendLeaveFormRequest.getToDate()))")
    })
    public abstract LeaveRequestForm convert(SendLeaveFormRequest sendLeaveFormRequest) throws ParseException;
}
