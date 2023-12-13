package fpt.capstone.buildingmanagementsystem.mapper;

import fpt.capstone.buildingmanagementsystem.model.dto.RoleDto;
import fpt.capstone.buildingmanagementsystem.model.entity.Role;
import org.mapstruct.Mapper;

import java.util.Optional;

@Mapper(componentModel = "spring")
public abstract class RoleMapper{
    public abstract RoleDto convertRegisterAccount(Role role);

}
