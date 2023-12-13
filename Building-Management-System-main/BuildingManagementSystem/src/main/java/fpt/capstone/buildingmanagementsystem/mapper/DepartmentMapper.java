package fpt.capstone.buildingmanagementsystem.mapper;


import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.response.DepartmentResponse;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")

public abstract class DepartmentMapper {
    public abstract List<DepartmentResponse> convert(List<Department> department);

}
