package fpt.capstone.buildingmanagementsystem.repository.impl;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.LateType;
import fpt.capstone.buildingmanagementsystem.model.response.LateFormResponse;
import fpt.capstone.buildingmanagementsystem.repository.LateRequestFormRepositoryV2;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class LateRequestFormRepositoryV2Impl implements LateRequestFormRepositoryV2 {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<LateFormResponse> findLateAndEarlyViolateByUserIdAndDate(String userId, Date date, LateType lateType) {
        String query = "SELECT rt.user_id as userId ,\n" +
                "       lrf.late_duration as lateDuration ,\n" +
                "       lrf.request_date as requestDate ,\n" +
                "       lrf.late_type as lateType \n" +
                "FROM request_ticket rt\n" +
                "JOIN request_message rm ON rt.request_id = rm.request_id\n" +
                "join late_request_form lrf ON rm.request_message_id = lrf.request_massage_id\n" +
                "WHERE rt.user_id LIKE :userId \n" +
                "  AND lrf.request_date LIKE :date \n" +
                "  AND lrf.late_type LIKE :lateType\n" +
                "  AND lrf.status is TRUE;";
        return (List<LateFormResponse>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setParameter("userId", userId)
                .setParameter("date", date)
                .setParameter("lateType", lateType.toString())
                .setResultTransformer(Transformers.aliasToBean(LateFormResponse.class))
                .getResultList()
                .stream()
                .collect(Collectors.toList());

    }
}
