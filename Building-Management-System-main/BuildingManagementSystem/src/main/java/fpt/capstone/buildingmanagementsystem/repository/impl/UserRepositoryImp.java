package fpt.capstone.buildingmanagementsystem.repository.impl;

import fpt.capstone.buildingmanagementsystem.model.response.UserAccountResponse;
import fpt.capstone.buildingmanagementsystem.repository.UserRepositoryV2;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class UserRepositoryImp implements UserRepositoryV2 {

    @PersistenceContext
    EntityManager entityManager;

    @Override
    public List<UserAccountResponse> getUserAccount() {
        String query = "" +
                "SELECT a.account_id      AS accountId,\n" +
                "       a.username,\n" +
                "       d.department_id AS departmentId,\n" +
                "       d.department_name AS departmentName\n" +
                "FROM account a\n" +
                "         JOIN user u ON a.account_id = u.user_id\n" +
                "         JOIN department d ON d.department_id = u.department_id;";

        return (List<UserAccountResponse>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(UserAccountResponse.class))
                .getResultList()
                .stream()
                .collect(Collectors.toList());
    }
    @Override
    public List<UserAccountResponse> getUserAccountActive() {
        String query = "SELECT a.account_id AS accountId,\n" +
                "                      a.username,\n" +
                "                       d.department_id AS departmentId,\n" +
                "                       d.department_name AS departmentName\n" +
                "                FROM account a \n" +
                "                        JOIN user u ON a.account_id = u.user_id\n" +
                "                        JOIN department d ON d.department_id = u.department_id\n" +
                "                        join status s on s.status_id=a.status_id where status_name='active';";

        return (List<UserAccountResponse>) entityManager.createNativeQuery(query).unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(UserAccountResponse.class))
                .getResultList()
                .stream()
                .collect(Collectors.toList());
    }
}
