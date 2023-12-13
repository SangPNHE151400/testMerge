package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.WorkingOutsideRequestForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface WorkingOutsideFormRepository extends JpaRepository<WorkingOutsideRequestForm, String> {
    List<WorkingOutsideRequestForm> findByRequestMessageIn(List<RequestMessage> requestMessages);

    @Query(value = "SELECT worf.*\n" +
            "FROM request_ticket rt\n" +
            "JOIN request_message rm ON rt.request_id = rm.request_id\n" +
            "JOIN working_outside_request_form worf ON rm.request_message_id = worf.request_massage_id\n" +
            "WHERE rt.user_id LIKE :userId\n" +
            "AND worf.status IS TRUE\n" +
            "AND worf.date LIKE :date", nativeQuery = true)
    List<WorkingOutsideRequestForm> findByUserIdAndDate(@Param("userId") String userId, @Param("date") Date date);
}
