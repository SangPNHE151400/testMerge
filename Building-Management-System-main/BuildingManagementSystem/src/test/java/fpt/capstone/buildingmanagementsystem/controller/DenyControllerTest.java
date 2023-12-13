package fpt.capstone.buildingmanagementsystem.controller;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class DenyControllerTest {
    DenyController denyController = new DenyController();

    @Test
    void testFirstPage() {
        String result = denyController.firstPage();
        Assertions.assertEquals("deny access", result);
    }
    //note
}
