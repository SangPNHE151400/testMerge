package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.response.DepartmentResponse;
import fpt.capstone.buildingmanagementsystem.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DepartmentController {
    @Autowired
    DepartmentService departmentService;
    @RequestMapping(value = "/getAllDepartment", method = RequestMethod.GET)
    public ResponseEntity<?> getAllDepartment() {
        return ResponseEntity.ok(departmentService.getAllDepartment());
    }

    @GetMapping("/getManagerDepartment")
    public List<DepartmentResponse> getDepartmentByManagerRole() {
        return departmentService.getDepartmentByManagerRole();
    }

    @GetMapping("/getDepartmentWithManager")
    public List<DepartmentResponse> getDepartmentHaveManager() {
        return departmentService.getDepartmentHaveManager();
    }
}
