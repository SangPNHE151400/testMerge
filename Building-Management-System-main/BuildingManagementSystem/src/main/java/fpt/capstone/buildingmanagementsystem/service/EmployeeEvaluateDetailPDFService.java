package fpt.capstone.buildingmanagementsystem.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import fpt.capstone.buildingmanagementsystem.model.request.MonthlyEvaluateRequest;
import fpt.capstone.buildingmanagementsystem.model.response.FilePdfResponse;
import fpt.capstone.buildingmanagementsystem.model.response.MonthlyEvaluateResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Base64;

import static fpt.capstone.buildingmanagementsystem.model.enumEnitty.EvaluateEnum.*;

@Service
public class EmployeeEvaluateDetailPDFService {
    @Autowired
    MonthlyEvaluateService monthlyEvaluateService;

    public FilePdfResponse export(MonthlyEvaluateRequest monthlyEvaluateRequest) throws DocumentException, IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, byteArrayOutputStream);
        MonthlyEvaluateResponse monthlyEvaluateOfEmployee = monthlyEvaluateService.getMonthlyEvaluateOfEmployee(monthlyEvaluateRequest);
        document.open();

        com.lowagie.text.Font font = FontFactory.getFont(FontFactory.TIMES_ROMAN);
        font.setSize(23);
        font.setColor(Color.getHSBColor(0.5f, 0.542f, 0.525f));

        com.lowagie.text.Font font2 = FontFactory.getFont(FontFactory.TIMES_ROMAN);
        font2.setSize(18);
        font2.setColor(Color.DARK_GRAY);


        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String formattedHireDate = dateFormat.format(monthlyEvaluateOfEmployee.getHireDate());

        Font font3 = FontFactory.getFont(FontFactory.TIMES_ROMAN);
        if (monthlyEvaluateOfEmployee.getEvaluateEnum() == GOOD) {
            font3.setColor(Color.getHSBColor(0.333f, 1f, 0.39f));
        } else if (monthlyEvaluateOfEmployee.getEvaluateEnum() == NORMAL) {
            font3.setColor(Color.getHSBColor(0.0639f, 1f, 1f));
        } else if (monthlyEvaluateOfEmployee.getEvaluateEnum() == BAD) {
            font3.setColor(Color.RED);
        }

        Paragraph p = new Paragraph("Employee Evaluate Detail", font);
        p.setAlignment(Paragraph.ALIGN_CENTER);
        document.topMargin();
        document.add(p);

        Paragraph info = new Paragraph("1. Information", font2);
        info.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(info);
        document.add(new Paragraph("    Employee: " + monthlyEvaluateOfEmployee.getFirstNameEmp() + " " + monthlyEvaluateOfEmployee.getLastNameEmp()));
        document.add(new Paragraph("    Account: " + monthlyEvaluateOfEmployee.getEmployeeUserName()));
        document.add(new Paragraph("    Department: " + monthlyEvaluateOfEmployee.getDepartment().getDepartmentName()));
        document.add(new Paragraph("    Hire date: " + formattedHireDate));

        Paragraph workingDetails = new Paragraph("2. Working Details", font2);
        workingDetails.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(workingDetails);
        document.add(new Paragraph("    Month and year: " + monthlyEvaluateRequest.getMonth() + "-" + monthlyEvaluateOfEmployee.getYear()));
        document.add(new Paragraph("    Working day(day): " + monthlyEvaluateOfEmployee.getWorkingDay()));
        document.add(new Paragraph("    Total attendance(h): " + monthlyEvaluateOfEmployee.getTotalAttendance()));
        document.add(new Paragraph("    Late(h): " + monthlyEvaluateOfEmployee.getLateCheckin()));
        document.add(new Paragraph("    Permitted leave: " + monthlyEvaluateOfEmployee.getPermittedLeave()));
        document.add(new Paragraph("    Non-permitted leave: " + monthlyEvaluateOfEmployee.getNonPermittedLeave()));
        document.add(new Paragraph("    Overtime (h): " + monthlyEvaluateOfEmployee.getOverTime()));
        document.add(new Paragraph("    Violate (times): " + monthlyEvaluateOfEmployee.getViolate()));
        document.add(new Paragraph("    Paid day(day): " + monthlyEvaluateOfEmployee.getPaidDay()));

        Paragraph violate = new Paragraph("3. Evaluate", font2);
        violate.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(violate);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100f);
        table.setWidths(new float[]{6f, 15f});
        table.setSpacingBefore(10);
        for (int i = 0; i <= 1; i++) {
            if (i == 0) {
                table.addCell(new Paragraph("  Evaluate of Manager: "));
                table.addCell(new Paragraph("  " + monthlyEvaluateOfEmployee.getEvaluateEnum(), font3));
            } else {
                table.addCell(new Paragraph("  Note:"));
                table.addCell(new Paragraph("  " + monthlyEvaluateOfEmployee.getNote()));
            }
        }
        document.add(table);
        document.close();
        byte[] byteArray = byteArrayOutputStream.toByteArray();
        String file = Base64.getEncoder().encodeToString(byteArray);
        String fileName="EmployeeEvaluateDetail_" + monthlyEvaluateOfEmployee.getEmployeeUserName() + "_" + monthlyEvaluateRequest.getMonth() + "/" + monthlyEvaluateOfEmployee.getYear() + ".pdf";
        String fileContent=MediaType.APPLICATION_PDF.toString();
        return FilePdfResponse.builder().file(file).fileName(fileName).fileContentType(fileContent).build();

    }
}
