package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.DayOff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DayOffRepository extends JpaRepository<DayOff, String> {
    Optional<DayOff> findByAccountAndYear(Account account, int year);

    Optional<DayOff> findByAccount(Account account);
}
