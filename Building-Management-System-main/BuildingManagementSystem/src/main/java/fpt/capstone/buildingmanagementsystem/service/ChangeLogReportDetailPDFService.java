package fpt.capstone.buildingmanagementsystem.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.response.ChangeLogDetailResponse;
import fpt.capstone.buildingmanagementsystem.model.response.ControlLogResponse;
import fpt.capstone.buildingmanagementsystem.model.response.FilePdfResponse;
import fpt.capstone.buildingmanagementsystem.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.Objects;

@Service
public class ChangeLogReportDetailPDFService {
    @Autowired
    AccountRepository accountRepository;
    @Autowired
    RequestChangeLogService requestChangeLogService;
    private void writeTableHeader(PdfPTable table) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.getHSBColor(-0.5f,0.542f,0.525f));
        cell.setPadding(5);
        com.lowagie.text.Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.WHITE);
        cell.setPhrase(new Phrase("  User Name", font));
        table.addCell(cell);
        cell.setPhrase(new Phrase("  Date Time", font));
        table.addCell(cell);
    }

    public FilePdfResponse export(String changeLogId, String userId, String date) throws DocumentException, IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, byteArrayOutputStream);
        ChangeLogDetailResponse changeLogDetailResponse=requestChangeLogService.getChangeLogDetail(changeLogId,userId,date);
        document.open();

        Font font = FontFactory.getFont(FontFactory.TIMES_ROMAN);
        font.setSize(23);
        font.setColor(Color.getHSBColor(0.5f,0.542f,0.525f));

        Font font2 = FontFactory.getFont(FontFactory.TIMES_ROMAN);
        font2.setSize(18);
        font2.setColor(Color.DARK_GRAY);

        Paragraph p = new Paragraph("Change Log Report Detail", font);
        p.setAlignment(Paragraph.ALIGN_CENTER);
        document.topMargin();
        document.add(p);

        Paragraph info = new Paragraph("1. Information", font2);
        info.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(info);
        document.add(new Paragraph("    Employee: "+changeLogDetailResponse.getName()));
        document.add(new Paragraph("    Account: "+changeLogDetailResponse.getUsername()));
        document.add(new Paragraph("    Department: "+changeLogDetailResponse.getDepartmentName()));

        Paragraph systemLog = new Paragraph("2. System Log", font2);
        systemLog.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(systemLog);
        document.add(new Paragraph("    Date: "+changeLogDetailResponse.getDateDaily()));
        document.add(new Paragraph("    Check In: "+changeLogDetailResponse.getCheckin()));
        document.add(new Paragraph("    Check Out: "+changeLogDetailResponse.getCheckout()));

        Paragraph attendanceChange = new Paragraph("3. Attendance Change", font2);
        attendanceChange.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(attendanceChange);

        if(changeLogDetailResponse.getCheckinChange()==null){
            document.add(new Paragraph("    Check In Change: "+"none"));
        }else{
            document.add(new Paragraph("    Check In Change: "+changeLogDetailResponse.getCheckinChange()));
        }
        if(changeLogDetailResponse.getCheckoutChange()==null){
            document.add(new Paragraph("    Check Out Change: "+"none"));
        }else{
            document.add(new Paragraph("    Check Out Change: "+changeLogDetailResponse.getCheckoutChange()));
        }
        document.add(new Paragraph("    Date Change: "+changeLogDetailResponse.getDateDailyChange()));
        if(Objects.equals(changeLogDetailResponse.getChangeFrom(), "FROM_REQUEST")) {
            document.add(new Paragraph("    Change from: Employee request"));
        }else if(Objects.equals(changeLogDetailResponse.getChangeFrom(), "FROM_EDIT")) {
            document.add(new Paragraph("    Change from: Manager edit"));
        }else if(Objects.equals(changeLogDetailResponse.getChangeFrom(), "OTHER")) {
            document.add(new Paragraph("    Change from: Other"));
        }


        Paragraph log = new Paragraph("4. Log", font2);
        log.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(log);
        if(changeLogDetailResponse.getOutSideWork()==-1){
            document.add(new Paragraph("    Outside Work: none"));
        }else {
            document.add(new Paragraph("    Outside Work: "+changeLogDetailResponse.getOutSideWork()));
        }
        document.add(new Paragraph("    Violate: "+changeLogDetailResponse.isViolate()));

        Paragraph reason = new Paragraph("5. Reason", font2);
        reason.setAlignment(Paragraph.ALIGN_LEFT);
        document.add(reason);
        document.add(new Paragraph("    +) "+changeLogDetailResponse.getReason()));

        Paragraph controlLog = new Paragraph("6. Control Log", font2);
        document.add(controlLog);
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100f);
        table.setWidths(new float[] {3.5f, 5f});
        table.setSpacingBefore(10);
        writeTableHeader(table);
        for (ControlLogResponse controlLogResponse : changeLogDetailResponse.getControlLogResponse()) {
            table.addCell("  "+controlLogResponse.getUsername());
            table.addCell("  "+controlLogResponse.getLog());
        }
        document.add(table);
        document.close();

        byte[] byteArray = byteArrayOutputStream.toByteArray();
        String file = Base64.getEncoder().encodeToString(byteArray);
        String fileName="ChangeLogReportDetail_"+changeLogDetailResponse.getUsername()+"_"+date+".pdf";
        String fileContent=MediaType.APPLICATION_PDF.toString();
        return FilePdfResponse.builder().file(file).fileName(fileName).fileContentType(fileContent).build();
    }

}
