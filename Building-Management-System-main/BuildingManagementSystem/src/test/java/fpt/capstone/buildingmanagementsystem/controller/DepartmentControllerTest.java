package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.response.DepartmentResponse;
import fpt.capstone.buildingmanagementsystem.service.DepartmentService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

class DepartmentControllerTest {
    @Mock
    DepartmentService departmentService;
    @InjectMocks
    DepartmentController departmentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllDepartment() {
        DepartmentResponse responseA = new DepartmentResponse("1", "Department A");
        DepartmentResponse responseB = new DepartmentResponse("2", "Department B");

        Mockito.when(departmentService.getAllDepartment()).thenReturn(List.of(responseA, responseB));

        ResponseEntity<?> responseEntity = departmentController.getAllDepartment();

        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        List<DepartmentResponse> departmentResponses = (List<DepartmentResponse>) responseEntity.getBody();
        assertEquals(2, departmentResponses.size());
        assertEquals(responseA, departmentResponses.get(0));
        assertEquals(responseB, departmentResponses.get(1));
    }
    //note fixed

    @Test
    void testGetDepartmentByManagerRole() {
        when(departmentService.getDepartmentByManagerRole()).thenReturn(List.of(new DepartmentResponse("1", "departmentName")));

        List<DepartmentResponse> result = departmentController.getDepartmentByManagerRole();
        assertEquals(List.of(new DepartmentResponse("1", "departmentName")), result);
    }

    @Test
    void testGetDepartmentHaveManager() {
        when(departmentService.getDepartmentHaveManager()).thenReturn(List.of(new DepartmentResponse("departmentId", "departmentName")));

        List<DepartmentResponse> result = departmentController.getDepartmentHaveManager();
        Assertions.assertEquals(List.of(new DepartmentResponse("departmentId", "departmentName")), result);
    }
}