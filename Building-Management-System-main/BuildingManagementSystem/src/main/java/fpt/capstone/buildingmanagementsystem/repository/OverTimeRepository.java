package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.OvertimeLog;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;


@Repository
public interface OverTimeRepository extends JpaRepository<OvertimeLog, Long> {
    @Query(value = "select * from overtime_log where user_id = :user_id and month(date) = :month and year(date)  = :year", nativeQuery = true)
    List<OvertimeLog> getOvertimeLog(String user_id, String month, String year);

    List<OvertimeLog> findAllByUser(User user);

    Optional<OvertimeLog> findByUser_Account_UsernameAndDate(String username, Date date);

    @Query(value = "SELECT *\n" +
            "FROM overtime_log\n" +
            "WHERE user_id LIKE :userId \n" +
            "AND year(date) = :year \n" +
            "AND month(date) = :month", nativeQuery = true)
    List<OvertimeLog> findByUserAndMonthAndYear(String userId, int year, int month);
}
