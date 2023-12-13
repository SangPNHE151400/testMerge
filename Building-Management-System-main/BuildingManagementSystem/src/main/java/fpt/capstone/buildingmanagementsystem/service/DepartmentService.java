package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.mapper.DepartmentMapper;
import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.response.DepartmentResponse;
import fpt.capstone.buildingmanagementsystem.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {
    @Autowired
    DepartmentRepository departmentRepository;
    @Autowired
    DepartmentMapper departmentMapper;

    public List<DepartmentResponse> getAllDepartment() {
        List<Department> departmentList = departmentRepository.findAll();
        return departmentMapper.convert(departmentList);
    }

    public List<DepartmentResponse> getDepartmentByManagerRole() {
        return departmentRepository.getDepartmentWithManagerRole()
                .stream()
                .map(department -> new DepartmentResponse(
                        department.getDepartmentId(),
                        department.getDepartmentName()
                )).collect(Collectors.toList());

    }

    public List<DepartmentResponse> getDepartmentHaveManager() {
        return departmentRepository.findAll()
                .stream().filter(department ->
                        !department.getDepartmentName().equals("security") &&
                                !department.getDepartmentName().equals("human resources") &&
                                !department.getDepartmentName().equals("Admin")
                ).map(department -> new DepartmentResponse(department.getDepartmentId(), department.getDepartmentName()))
                .collect(Collectors.toList());
    }
}
