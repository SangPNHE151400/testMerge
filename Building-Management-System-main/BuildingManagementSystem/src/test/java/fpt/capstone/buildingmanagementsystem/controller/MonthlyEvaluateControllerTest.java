package fpt.capstone.buildingmanagementsystem.controller;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.enumEnitty.EvaluateEnum;
import fpt.capstone.buildingmanagementsystem.model.request.EditEvaluateRequest;
import fpt.capstone.buildingmanagementsystem.model.request.EmployeeEvaluateRequest;
import fpt.capstone.buildingmanagementsystem.model.request.EvaluateByHrRequest;
import fpt.capstone.buildingmanagementsystem.model.request.MonthlyEvaluateRequest;
import fpt.capstone.buildingmanagementsystem.model.response.*;
import fpt.capstone.buildingmanagementsystem.service.EmployeeEvaluateDetailPDFService;
import fpt.capstone.buildingmanagementsystem.service.MonthlyEvaluateService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

import static org.mockito.Mockito.*;

class MonthlyEvaluateControllerTest {
    @Mock
    EmployeeEvaluateDetailPDFService employeeEvaluateDetailPDFService;
    @Mock
    MonthlyEvaluateService monthlyEvaluateService;
    @InjectMocks
    MonthlyEvaluateController monthlyEvaluateController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateEmployeeEvaluate() {
        when(monthlyEvaluateService.createEvaluate(any())).thenReturn(null);

        ResponseEntity<?> result = monthlyEvaluateController.createEmployeeEvaluate(new EmployeeEvaluateRequest("employeeId", "managerId", 0, 0, "note", EvaluateEnum.GOOD));
        Assertions.assertEquals(null, result);
    }
    //pass round1

    @Test
    void testExportEvaluate() throws IOException {
        when(employeeEvaluateDetailPDFService.export(any())).thenReturn(new FilePdfResponse("fileName", "fileContentType", "file"));

        FilePdfResponse result = monthlyEvaluateController.exportEvaluate(new MonthlyEvaluateRequest("userId", 0, 0));
        Assertions.assertEquals(new FilePdfResponse("fileName", "fileContentType", "file"), result);
    }
    //pass round1

    @Test
    void testUpdateEvaluate() {
        when(monthlyEvaluateService.updateEvaluate(any())).thenReturn(null);

        ResponseEntity<?> result = monthlyEvaluateController.updateEvaluate(new EditEvaluateRequest("evaluateId", "note", EvaluateEnum.GOOD));
        Assertions.assertEquals(null, result);
    }
    //pass round 1



    @Test
    void testCheckEvaluateExisted() {
        when(monthlyEvaluateService.checkEvaluateExisted(anyString(), anyInt(), anyInt())).thenReturn(true);

        boolean result = monthlyEvaluateController.checkEvaluateExisted("employeeId", 0, 0);
        Assertions.assertEquals(true, result);
    }
    //pass round 1

}
