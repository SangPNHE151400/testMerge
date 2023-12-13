package fpt.capstone.buildingmanagementsystem.mapper;

import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.UserPending;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeUserInfoRequest;
import fpt.capstone.buildingmanagementsystem.model.response.GetAllAccountResponse;
import fpt.capstone.buildingmanagementsystem.model.response.GetAllUserInfoPending;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public abstract class UserPendingMapper {
    @Mappings({
            @Mapping(target = "createdDate", expression = "java(fpt.capstone.buildingmanagementsystem.until.Until.generateRealTime())")
    })
    public abstract UserPending convertRegisterAccount(ChangeUserInfoRequest changeUserInfoRequest);
    @Mapping(target = "accountId", source = "userId")
    public abstract GetAllUserInfoPending convertGetUserInfoPending(UserPending userPending);
}
