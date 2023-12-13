package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    @Transactional
    @Modifying
    @Query(value = "UPDATE user SET first_name = :first_name" +
            ",last_name = :last_name" + ",gender = :gender" +
            ",date_of_birth = :date_of_birth" + ",telephone_number = :telephone_number" +
            ",country = :country" + ",city = :city" +
            ",address = :address" + ",accepted_by = :accepted_by" +",approved_date = :approved_date" +
            ",email = :email" + ",updated_date = :updated_date" +
            ",image = :image" +
            " where user_id = :user_id", nativeQuery = true)
    int updateAcceptUserInfo(@Param(value = "first_name") String first_name, @Param(value = "last_name") String last_name,
                             @Param(value = "gender") String gender, @Param(value = "date_of_birth") String date_of_birth,
                             @Param(value = "telephone_number") String telephone_number, @Param(value = "country") String country,
                             @Param(value = "city") String city,@Param(value = "address") String address,@Param(value = "accepted_by") String accepted_by,
                             @Param(value = "approved_date") Date approved_date
            , @Param(value = "email") String email, @Param(value = "image") String image
            , @Param(value = "updated_date") Date updated_date, @Param(value = "user_id") String user_id);

    Optional<User> findByUserId(String userId);
    List<User> findAllByAccount_Status_StatusName(String statusName);
    List<User> findAllByUserIdIn(List<String> userId);

    List<User> findAllByDepartment(Department department);

    @Query(value = "SELECT *\n" +
            "FROM user u\n" +
            "JOIN account a ON a.account_id = u.user_id\n" +
            "JOIN role r ON r.role_id = a.role_id\n" +
            "JOIN department d ON d.department_id = u.department_id\n" +
            "WHERE d.department_name LIKE :department AND role_name LIKE 'manager'", nativeQuery = true)
    List<User> getManagerByDepartment(@Param("department") String departmentName);

    @Query(value = "SELECT *\n" +
            "FROM user u\n" +
            "JOIN department d ON d.department_id = u.department_id\n" +
            "JOIN account a ON a.account_id = u.user_id\n" +
            "JOIN role r ON r.role_id = a.role_id\n" +
            "WHERE d.department_id = :departmentId AND a.role_id = 3;", nativeQuery = true)
    List<User> getManagerByDepartmentId(@Param("departmentId") String departmentId);
}
