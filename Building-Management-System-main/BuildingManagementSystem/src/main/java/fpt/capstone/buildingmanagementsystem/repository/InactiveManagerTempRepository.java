package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Department;
import fpt.capstone.buildingmanagementsystem.model.entity.InactiveManagerTemp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InactiveManagerTempRepository extends JpaRepository<InactiveManagerTemp, String> {
    Optional<InactiveManagerTemp> findByDepartment(Department department);
}
