package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
    Optional<Department> findByDepartmentId(String departmentId);

    Optional<Department> findByDepartmentName(String departmentName);

    @Query(value = "SELECT d.department_id, d.department_name\n" +
            "FROM department d\n" +
            "JOIN user u ON d.department_id = u.department_id\n" +
            "JOIN account a ON a.account_id = u.user_id\n" +
            "JOIN role r ON r.role_id = a.role_id\n" +
            "WHERE a.role_id = 3\n" +
            "GROUP BY d.department_id, d.department_name;", nativeQuery = true)
    List<Department> getDepartmentWithManagerRole();

    List<Department> findAll();

    @Query(value = "SELECT *\n" +
            "FROM department d \n" +
            "JOIN user u ON d.department_id = u.department_id\n" +
            "WHERE user_id LIKE :userId", nativeQuery = true)
    Optional<Department> findByUserId(String userId);
}
