package fpt.capstone.buildingmanagementsystem.model.entity;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_pending_status")
public class UserPendingStatus {
    @Id
    @Column(name = "user_pending_status_id")
    public String userPendingStatusId;
    @NotNull
    @Column(name = "user_pending_status_name")
    public String userPendingStatusName;
}
