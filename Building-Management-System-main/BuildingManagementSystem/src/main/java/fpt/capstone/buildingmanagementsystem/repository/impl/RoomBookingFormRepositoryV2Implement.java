package fpt.capstone.buildingmanagementsystem.repository.impl;

import fpt.capstone.buildingmanagementsystem.model.response.RoomBookingResponse;
import fpt.capstone.buildingmanagementsystem.repository.RoomBookingFormRepositoryV2;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class RoomBookingFormRepositoryV2Implement implements RoomBookingFormRepositoryV2 {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<RoomBookingResponse> getPendingAndAcceptedRoom() {
        String query = "" +
                "SELECT rb.room_booking_request_id AS id,\n" +
                "       rb.end_time                AS endDate,\n" +
                "       rb.start_time              AS startDate,\n" +
                "       rb.title,\n" +
                "       rb.department_sender_id    AS departmentId,\n" +
                "       rb.booking_date            AS bookingDate,\n" +
                "       rr.room_id                 AS roomId,\n" +
                "       rb.status                  AS bookingStatus \n" +
                "FROM room_booking_request_form rb\n" +
                "         JOIN request_message rm ON rb.request_massage_id = rm.request_message_id\n" +
                "         JOIN room_booking_form_room rr ON rb.room_booking_request_id = rr.room_booking_request_id\n" +
                "WHERE rb.status like 'PENDING' or rb.status like 'ACCEPTED';";

        return (List<RoomBookingResponse>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(RoomBookingResponse.class))
                .getResultList().stream()
                .collect(Collectors.toList());
    }
}
