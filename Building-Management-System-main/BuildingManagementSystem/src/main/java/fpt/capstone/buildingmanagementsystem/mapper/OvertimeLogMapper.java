package fpt.capstone.buildingmanagementsystem.mapper;

import fpt.capstone.buildingmanagementsystem.model.entity.OvertimeLog;
import fpt.capstone.buildingmanagementsystem.model.response.OverTimeDetailResponse;
import org.mapstruct.Mapper;
@Mapper(componentModel = "spring")
public abstract class OvertimeLogMapper {
    public abstract OverTimeDetailResponse convertGetAttendanceUserDetailResponse(OvertimeLog dailyLog);

}
