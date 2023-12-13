package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.Status;
import fpt.capstone.buildingmanagementsystem.model.entity.UserPendingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserPendingStatusRepository extends JpaRepository<UserPendingStatus,String> {
    Optional<UserPendingStatus> findByUserPendingStatusId(String statusId);
    List<UserPendingStatus> findAll();

}
