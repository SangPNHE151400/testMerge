package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.LeaveRequestForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface LeaveRequestFormRepository extends JpaRepository<LeaveRequestForm,String> {
    List<LeaveRequestForm> findByRequestMessageIn(List<RequestMessage> requestMessages);

    @Query(value = "SELECT lrf.*\n" +
            "FROM request_ticket rt\n" +
            "JOIN request_message rm ON rt.request_id = rm.request_id\n" +
            "JOIN leave_request_form lrf ON rm.request_message_id = lrf.request_massage_id\n" +
            "WHERE rt.user_id LIKE :userId\n" +
            "AND lrf.status IS TRUE\n" +
            "AND :date BETWEEN lrf.from_date AND lrf.to_date", nativeQuery = true)
    List<LeaveRequestForm> findRequestByUserIdAndDate(@Param("userId") String userId,@Param("date") Date date);
}
