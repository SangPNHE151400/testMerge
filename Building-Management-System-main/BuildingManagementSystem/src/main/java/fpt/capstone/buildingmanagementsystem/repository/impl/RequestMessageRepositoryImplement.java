package fpt.capstone.buildingmanagementsystem.repository.impl;

import fpt.capstone.buildingmanagementsystem.model.dto.TicketDto;
import fpt.capstone.buildingmanagementsystem.repository.RequestMessageRepositoryV2;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

public class RequestMessageRepositoryImplement implements RequestMessageRepositoryV2 {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<?> getAllRequestMessage(String requestId, String table) {
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
}
