package fpt.capstone.buildingmanagementsystem.mapper;

import fpt.capstone.buildingmanagementsystem.model.entity.User;
import fpt.capstone.buildingmanagementsystem.model.request.ChangeUserInfoRequest;
import fpt.capstone.buildingmanagementsystem.model.response.GetUserInfoResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class UserMapper {
    public abstract User convertUser(ChangeUserInfoRequest changeUserInfoRequest);
    public abstract GetUserInfoResponse convertGetUserInfo(User user);

}
