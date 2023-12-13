package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Role;
import fpt.capstone.buildingmanagementsystem.model.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StatusRepository extends JpaRepository<Status,String> {
    Optional<Status> findByStatusId(String roleId);
    Optional<Status> findByStatusName(String roleName);
    List<Status> findAll();
}
