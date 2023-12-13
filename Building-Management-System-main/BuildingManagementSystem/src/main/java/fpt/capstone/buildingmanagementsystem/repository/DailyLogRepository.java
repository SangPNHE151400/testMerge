package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.DailyLog;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyLogRepository extends JpaRepository<DailyLog, String> {
    @Query(value = "select * from daily_log where user_id = :user_id and month = :month and year(date)  = :year", nativeQuery = true)
    List<DailyLog> getByUserIdAndMonthAndYear(String user_id, int month, String year);

    @Query(value = "select * from daily_log where user_id = :user_id and date = :date", nativeQuery = true)
    Optional<DailyLog> getAttendanceDetailByUserIdAndDate(String user_id, String date);

    List<DailyLog> findAllByUser(User user);

    List<DailyLog> findAllByUserAndMonth(User user, int month);

    Optional<DailyLog> findByUserAndDate(User user, Date date);
    @Query(value = "SELECT *\n" +
            "FROM daily_log\n" +
            "WHERE user_id LIKE :accountId AND date LIKE :date\n" +
            "ORDER BY checkout DESC LIMIT 1;", nativeQuery = true)
    Optional<DailyLog> getLastCheckoutOfDateByUserId(@Param("accountId") String accountId, @Param("date") Date date);

    List<DailyLog> findByDate(Date date);

    @Query(value = "SELECT *\n" +
            "FROM daily_log\n" +
            "WHERE user_id LIKE :userId AND month = :month AND year(date) = :year;", nativeQuery = true)
    List<DailyLog> getMonthlyDailyLog(@Param("userId") String userId, @Param("month") int month, @Param("year") int year);

    @Query(value = "SELECT *\n" +
            "FROM daily_log\n" +
            "WHERE user_id LIKE :userId\n" +
            "AND date BETWEEN :fromDate AND :toDate", nativeQuery = true)
    List<DailyLog> getDailyLogsByUserAndFromDateAndToDate(@Param("userId") String userId, @Param("fromDate") Date fromDate, @Param("toDate") Date toDate);
    @Query(value = "SELECT *\n" +
            "FROM daily_log\n" +
            "WHERE date BETWEEN :fromDate AND :toDate", nativeQuery = true)
    List<DailyLog> getDailyLogsByFromDateAndToDate( @Param("fromDate") Date fromDate, @Param("toDate") Date toDate);
}
