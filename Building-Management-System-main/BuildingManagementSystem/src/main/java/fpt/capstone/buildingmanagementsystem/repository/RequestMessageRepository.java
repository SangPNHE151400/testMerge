package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.RequestTicket;
import fpt.capstone.buildingmanagementsystem.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Repository
public interface RequestMessageRepository extends JpaRepository<RequestMessage, String> {
//    RequestMessage
    List<RequestMessage> findByRequest(RequestTicket requestTicket);
    @Transactional
    @Modifying
    @Query(value = "UPDATE request_message SET receiver_id = :receiver_id,update_date = :update_date" +
            " where request_id = :request_id", nativeQuery = true)
    int updateTicketRequestTime(@Param(value = "receiver_id") String receiver_id, @Param(value = "update_date") Date update_date, @Param(value = "request_id") String request_id);
    List<RequestMessage> findAllByReceiver(User user);
    List<RequestMessage> findAllBySender(User user);

}
