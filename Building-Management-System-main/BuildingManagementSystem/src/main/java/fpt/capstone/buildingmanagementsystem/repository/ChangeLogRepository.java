package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.ChangeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChangeLogRepository extends JpaRepository<ChangeLog, String> {

    @Query(value = "SELECT *\n" +
            "FROM change_log\n" +
            "WHERE employee_id LIKE :userId AND MONTH(date) = :month",nativeQuery = true)
    List<ChangeLog> getChangeLogByUserIdAndMonth(@Param("userId") String userId, @Param("month")int month);

    @Query(value = "SELECT *\n" +
            "FROM change_log\n" +
            "WHERE employee_id LIKE :userId AND date = :date",nativeQuery = true)
    List<ChangeLog> getChangeLogByUserIdAndDate(@Param("userId") String userId, @Param("date") Date date);

    @Query(value = "select * from change_log where employee_id = :employee_id and date = :date", nativeQuery = true)
    Optional<ChangeLog> getChangeLogDetailByUserIdAndDate(String employee_id, String date);
    Optional<ChangeLog> findChangeLogByChangeLogId(String changeLogId);
}
