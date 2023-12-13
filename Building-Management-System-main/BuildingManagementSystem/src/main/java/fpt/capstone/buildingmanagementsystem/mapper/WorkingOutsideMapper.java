package fpt.capstone.buildingmanagementsystem.mapper;

import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.WorkingOutsideRequestForm;
import fpt.capstone.buildingmanagementsystem.model.request.SendWorkingOutSideRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.text.ParseException;

@Mapper(componentModel = "spring")
public abstract class WorkingOutsideMapper {
    @Mappings({
            @Mapping(target = "date", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.convertStringToDate(sendWorkingOutSideRequest.getDate()))"),
    })
    public abstract WorkingOutsideRequestForm convert(SendWorkingOutSideRequest sendWorkingOutSideRequest) throws ParseException;
}
