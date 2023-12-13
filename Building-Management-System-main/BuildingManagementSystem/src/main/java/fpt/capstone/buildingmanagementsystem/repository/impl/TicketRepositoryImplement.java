package fpt.capstone.buildingmanagementsystem.repository.impl;

import fpt.capstone.buildingmanagementsystem.model.dto.TicketDto;
import fpt.capstone.buildingmanagementsystem.model.dto.TicketRequestDto;
import fpt.capstone.buildingmanagementsystem.repository.TicketRepositoryv2;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class TicketRepositoryImplement implements TicketRepositoryv2 {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<TicketDto> getAllTicketRequest() {
        String query = "select t.ticket_id   as ticketId,\n" +
                "       t.create_date as createDate,\n" +
                "       t.update_date as updateDate,\n" +
                "       t.status      as status,\n" +
                "       t.topic       as topic,\n" +
                "       rt.request_id as requestId,\n" +
                "       rt.title as title,\n" +
                "       rt.create_date as requestCreateDate,\n" +
                "       rt.update_date as requestUpdateDate,\n" +
                "       rt.status as requestStatus,\n" +
                "       rt.user_id as userId\n" +
                "from ticket t\n" +
                "join request_ticket rt on t.ticket_id = rt.ticket_id;";

        return (List<TicketDto>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(TicketDto.class))
                .getResultList().stream()
                .collect(Collectors.toList());

    }

    @Override
    public List<TicketRequestDto> getTicketRequestBySenderId(String senderId) {
        String query = commonQuery()
        + "WHERE rm.sender_id LIKE :senderId";

        return (List<TicketRequestDto>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setParameter("senderId", senderId)
                .setResultTransformer(Transformers.aliasToBean(TicketRequestDto.class))
                .getResultList().stream()
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketRequestDto> getTicketRequestByHr() {
        String query = commonQuery() +
                "WHERE d.department_name LIKE 'human resources'";

        return (List<TicketRequestDto>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(TicketRequestDto.class))
                .getResultList().stream()
                .collect(Collectors.toList());

    }

    @Override
    public List<TicketRequestDto> getTicketRequestBySecurity() {
        String query = commonQuery() +
                "WHERE d.department_name LIKE 'security'";

        return (List<TicketRequestDto>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(TicketRequestDto.class))
                .getResultList().stream()
                .collect(Collectors.toList());

    }

    @Override
    public List<TicketRequestDto> getTicketRequestByAdmin() {
        String query = commonQuery() +
                "WHERE d.department_name LIKE 'Admin'";

        return (List<TicketRequestDto>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(TicketRequestDto.class))
                .getResultList().stream()
                .collect(Collectors.toList());

    }

    @Override
    public List<TicketRequestDto> getTicketRequestByDepartment(String departmentName) {
        String query = commonQuery() +
                "WHERE d.department_name LIKE :departmentName";

        return (List<TicketRequestDto>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setParameter("departmentName", departmentName)
                .setResultTransformer(Transformers.aliasToBean(TicketRequestDto.class))
                .getResultList().stream()
                .collect(Collectors.toList());
    }


    private String commonQuery() {
        return "SELECT t.ticket_id       AS ticketId,\n" +
                "       t.create_date     AS createDate,\n" +
                "       t.status          AS status,\n" +
                "       t.topic           AS topic,\n" +
                "       t.update_date     AS updateDate,\n" +
                "       rt.request_id     AS requestId,\n" +
                "       rt.title          AS title,\n" +
                "       rt.create_date    AS requestCreateDate,\n" +
                "       rt.update_date    AS requestUpdateDate,\n" +
                "       rt.status         AS requestStatus,\n" +
                "       rm.sender_id      AS senderId,\n" +
                "       rm.receiver_id    AS receiverId,\n" +
                "       rm.create_date    AS messageCreateDate,\n" +
                "       rm.request_message_id    AS messageId,\n" +
                "       rm.department_id  AS departmentId,\n" +
                "       d.department_name AS departmentName,\n" +
                "       u1.first_name     AS senderFirstName,\n" +
                "       u1.last_name      AS senderLastName,\n" +
                "       u.first_name      AS receiverFirstName,\n" +
                "       u.last_name       AS receiverLastName\n" +
                "FROM ticket t\n" +
                "         JOIN request_ticket rt ON t.ticket_id = rt.ticket_id\n" +
                "         JOIN (SELECT request_id,\n" +
                "                      MIN(create_date) AS min_create_date\n" +
                "               FROM request_message\n" +
                "               GROUP BY request_id) AS first_messages ON rt.request_id = first_messages.request_id\n" +
                "         JOIN request_message rm ON rt.request_id = rm.request_id\n" +
                "    AND rm.create_date = first_messages.min_create_date\n" +
                "         LEFT JOIN user u ON u.user_id = rm.receiver_id\n" +
                "         LEFT JOIN user u1 ON u1.user_id = rm.sender_id\n" +
                "         JOIN department d ON d.department_id = rm.department_id\n";
    }
}
