package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.UserPending;
import fpt.capstone.buildingmanagementsystem.model.entity.UserPendingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserPendingRepository extends JpaRepository<UserPending,String> {
    @Transactional
    @Modifying
    @Query(value = "UPDATE user_pending SET user_pending_status_id = :user_pending_status_id"+
            " where user_pending_id = :user_pending_id", nativeQuery = true)
    int updateStatus( @Param(value = "user_pending_status_id") String user_pending_status_id, @Param(value = "user_pending_id") String user_pending_id);

    List<UserPending> findAllByUserPendingStatus(UserPendingStatus status);
}
