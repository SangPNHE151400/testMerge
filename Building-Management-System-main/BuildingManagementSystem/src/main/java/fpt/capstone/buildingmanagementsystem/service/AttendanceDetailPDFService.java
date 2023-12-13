package fpt.capstone.buildingmanagementsystem.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import fpt.capstone.buildingmanagementsystem.model.response.AttendanceDetailResponse;
import fpt.capstone.buildingmanagementsystem.model.response.ControlLogResponse;
import fpt.capstone.buildingmanagementsystem.model.response.FilePdfResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class AttendanceDetailPDFService {
    @Autowired
    AttendanceService attendanceService;
    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.getHSBColor(-0.5f,0.542f,0.525f));
        cell.setPadding(5);
        com.lowagie.text.Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.WHITE);
        cell.setPhrase(new Phrase("  User Name", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("  Full Name", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("  Date Time", font));
        table.addCell(cell);
    }


    public FilePdfResponse export(String userId, String date) throws DocumentException, IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, byteArrayOutputStream);
        AttendanceDetailResponse attendanceDetailResponse=attendanceService.getAttendanceDetail(userId,date);
        document.open();

        Font font = FontFactory.getFont(FontFactory.TIMES_ROMAN);
        font.setSize(23);
        font.setColor(Color.getHSBColor(0.5f,0.542f,0.525f));

        Font font2 = FontFactory.getFont(FontFactory.TIMES_ROMAN);
        font2.setSize(18);
        font2.setColor(Color.DARK_GRAY);

        Paragraph p = new Paragraph("Attendance Detail", font);
        p.setAlignment(Paragraph.ALIGN_CENTER);
        document.topMargin();
        document.add(p);

        Paragraph info = new Paragraph("1. Information", font2);
        info.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(info);
        document.add(new Paragraph("    Employee: "+attendanceDetailResponse.getName()));
        document.add(new Paragraph("    Account: "+attendanceDetailResponse.getUsername()));
        document.add(new Paragraph("    Department: "+attendanceDetailResponse.getDepartmentName()));

        Paragraph workingDetails = new Paragraph("2. Working Details", font2);
        workingDetails.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(workingDetails);
        document.add(new Paragraph("    Full Date: "+attendanceDetailResponse.getDateDaily()));
        document.add(new Paragraph("    Check In: "+attendanceDetailResponse.getCheckin()));
        document.add(new Paragraph("    Check Out: "+attendanceDetailResponse.getCheckout()));
        document.add(new Paragraph("    Total Attendance: "+attendanceDetailResponse.getTotalAttendance()));
        document.add(new Paragraph("    Total Morning: "+attendanceDetailResponse.getMorningTotal()));
        document.add(new Paragraph("    Total Afternoon: "+attendanceDetailResponse.getAfternoonTotal()));
        document.add(new Paragraph("    Permitted Leave: "+attendanceDetailResponse.getPermittedLeave()));
        document.add(new Paragraph("    Non Permitted Leave: "+attendanceDetailResponse.getNonPermittedLeave()));
        document.add(new Paragraph("    Out-side Work: "+attendanceDetailResponse.getOutsideWork()));

        Paragraph violate = new Paragraph("3. Violate", font2);
        violate.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(violate);
        document.add(new Paragraph("    Authorized late: "+attendanceDetailResponse.isLateCheckin()));
        document.add(new Paragraph("    Authorized early: "+attendanceDetailResponse.isEarlyCheckout()));
        document.add(new Paragraph("    Leave without notice: "+attendanceDetailResponse.isLeaveWithoutNotice()));

        Paragraph controlLog = new Paragraph("4. Control Log", font2);
        document.add(controlLog);
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100f);
        table.setWidths(new float[] {3.5f, 3.5f, 5f});
        table.setSpacingBefore(10);
        writeTableHeader(table);
        for (ControlLogResponse controlLogResponse : attendanceDetailResponse.getControlLogResponse()) {
            table.addCell("  "+controlLogResponse.getUsername());
            table.addCell("  "+attendanceDetailResponse.getName());
            table.addCell("  "+controlLogResponse.getLog());
        }
        document.add(table);
        document.close();

        byte[] byteArray = byteArrayOutputStream.toByteArray();
        String file = Base64.getEncoder().encodeToString(byteArray);
        String fileName="AttendanceDetail_"+attendanceDetailResponse.getUsername()+"_"+date+".pdf";
        String fileContent=MediaType.APPLICATION_PDF.toString();
        return FilePdfResponse.builder().file(file).fileName(fileName).fileContentType(fileContent).build();
    }
}
