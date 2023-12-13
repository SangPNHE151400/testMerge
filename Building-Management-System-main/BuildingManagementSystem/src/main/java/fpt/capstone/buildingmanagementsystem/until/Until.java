package fpt.capstone.buildingmanagementsystem.until;

import fpt.capstone.buildingmanagementsystem.security.PasswordEncode;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
public class Until {
    public static String generateId() {
        return UUID.randomUUID().toString();
    }

    public static Date generateRealTime() {
        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime localDate = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
            String dateString = dtf.format(localDate);
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(dateString);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
    public static Date generateDate() {
        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDateTime localDate = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
            String dateString = dtf.format(localDate);
            return new SimpleDateFormat("yyyy-MM-dd").parse(dateString);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
    public static Date generateTime() {
        try {
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm:ss");
            LocalDateTime localDate = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
            String dateString = dtf.format(localDate);
            return new SimpleDateFormat("HH:mm:ss").parse(dateString);
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
    }
    public static java.sql.Date convertStringToDate(String date) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        java.util.Date dateConvert = sdf.parse(date);
        return new java.sql.Date(dateConvert.getTime());
    }
    public static Date convertStringToDateTime(String date) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        sdf.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        return sdf.parse(date);
    }
    public static Calendar convertDateToCalender(Date date) throws ParseException {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar;
    }
    // cần check lại khi deploy lên host
    public static java.sql.Time convertStringToTime(String time) throws ParseException {
        if(time!=null) {
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
            sdf.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
            Date date = sdf.parse(time);
            long timeInMillis = date.getTime();
            Time oldTime = new Time(timeInMillis);
            LocalTime localTime = oldTime.toLocalTime();
            return Time.valueOf(localTime);
        }else {
            return null;
        }
    }

    public static String encodePassword(String password) {
        return new PasswordEncode().passwordEncoder().encode(password);
    }

    public static String getRandomString(int n) {
        String AlphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                + "0123456789"
                + "abcdefghijklmnopqrstuvxyz";
        StringBuilder sb = new StringBuilder(n);
        for (int i = 0; i < n; i++) {
            int index
                    = (int) (AlphaNumericString.length()
                    * Math.random());
            sb.append(AlphaNumericString
                    .charAt(index));
        }
        return sb.toString();
    }

    public static double roundDouble(double value) {
        BigDecimal bd = new BigDecimal(Double.toString(value));
        bd = bd.setScale(2, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }

    public static int getYear(java.sql.Date date) {
        return date.toLocalDate().getYear();
    }
}
