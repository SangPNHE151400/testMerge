package fpt.capstone.buildingmanagementsystem.mapper;

import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.OtherRequest;
import fpt.capstone.buildingmanagementsystem.model.request.SendOtherFormRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class OtherRequestMapper {
    public abstract OtherRequest convert(SendOtherFormRequest sendOtherFormRequest);
}
