package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.Account;
import fpt.capstone.buildingmanagementsystem.model.entity.ControlLogLcd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ControlLogLcdRepository extends JpaRepository<ControlLogLcd, String> {
    @Query(value = "select * from control_log_lcd where persion_name = :persion_name and DATE(time) = :date order by time desc", nativeQuery = true)
    List<ControlLogLcd> getControlLogLcdList(String persion_name, String date);
    @Query(value = "select * from control_log_lcd where time between :dateStart and :dateEnd and device_id = :device_id order by time desc", nativeQuery = true)
    List<ControlLogLcd> getControlLogLcdListByDateAndDevice(Date dateStart, Date dateEnd, String device_id);
    Optional<ControlLogLcd> findByControlLogId(String id);
    @Query(value = "select * from control_log_lcd where account_id = :account_id order by time desc", nativeQuery = true)
    Optional<List<ControlLogLcd>> getAll(String account_id);
    Optional<List<ControlLogLcd>> findAllByPersionName(String username);
}
