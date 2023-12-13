package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.RoomBookingRequestForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Repository
public interface RoomBookingFormRepository extends JpaRepository<RoomBookingRequestForm, String> {

    List<RoomBookingRequestForm> findByRequestMessageIn(List<RequestMessage> requestMessages);
    List<RoomBookingRequestForm> findByStartTimeAndEndTime(Date startTime, Date endTime);

}
