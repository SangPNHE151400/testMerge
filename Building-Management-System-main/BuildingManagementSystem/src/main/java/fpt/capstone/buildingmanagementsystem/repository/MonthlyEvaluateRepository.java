package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.MonthlyEvaluate;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyEvaluateRepository extends JpaRepository<MonthlyEvaluate, String> {
    Optional<MonthlyEvaluate> findByEmployeeAndMonthAndYear(User user, int month, int year);
    Optional<MonthlyEvaluate> findByEvaluateId(String id);
    boolean existsByEmployeeAndMonthAndYear(User user, int month, int year);
    @Query(value = "SELECT me.*\n" +
            "FROM monthly_evaluate me\n" +
            "JOIN user u ON u.user_id = me.employee\n" +
            "JOIN department d ON d.department_id = u.department_id\n" +
            "WHERE d.department_id LIKE :departmentId\n" +
            "AND month = :month\n" +
            "AND year = :year", nativeQuery = true)
    List<MonthlyEvaluate> findByDepartmentAndMonthAndYear(@Param("departmentId") String departmentId, @Param("month") int month, @Param("year") int year);

    List<MonthlyEvaluate> findByEmployee(User employee);
}
