package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.ControlLogLcd;
import fpt.capstone.buildingmanagementsystem.model.entity.StrangerLogLcd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface StrangerLogLcdRepository extends JpaRepository<StrangerLogLcd, String> {
    @Query(value = "select * from stranger_log_lcd where time between :dateStart and :dateEnd and device_id = :device_id order by time desc", nativeQuery = true)
    List<StrangerLogLcd> getStrangerLogLcdListByDateAndDevice(Date dateStart, Date dateEnd, String device_id);
}
