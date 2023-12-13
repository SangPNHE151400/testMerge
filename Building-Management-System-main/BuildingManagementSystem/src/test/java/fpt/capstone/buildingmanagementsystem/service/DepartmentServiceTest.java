package fpt.capstone.buildingmanagementsystem.service;

import fpt.capstone.buildingmanagementsystem.mapper.DepartmentMapper;
import fpt.capstone.buildingmanagementsystem.model.response.DepartmentResponse;
import fpt.capstone.buildingmanagementsystem.repository.DepartmentRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.junit.Assert.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest
class DepartmentServiceTest {
    @Autowired
    DepartmentRepository departmentRepository;
    @Autowired
    DepartmentMapper departmentMapper;
    @Autowired
    DepartmentService departmentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllDepartment() {
        List<DepartmentResponse> result = departmentService.getAllDepartment();

        assertEquals(9, result.size());
    }
    //bug

    @Test
    void testGetDepartmentByManagerRole() {
        List<DepartmentResponse> result = departmentService.getDepartmentByManagerRole();
        assertEquals(3, result.size());
    }

    @Test
    void testGetDepartmentHaveManager() {
        List<DepartmentResponse> result = departmentService.getDepartmentHaveManager();
        Assertions.assertEquals(6, result.size());
    }
    //New
}