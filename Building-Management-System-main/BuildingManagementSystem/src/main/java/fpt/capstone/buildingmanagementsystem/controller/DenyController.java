package fpt.capstone.buildingmanagementsystem.controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@CrossOrigin
public class DenyController {
    @RequestMapping({ "/deny" })
    public String firstPage() {
        return "deny access";
    }
}