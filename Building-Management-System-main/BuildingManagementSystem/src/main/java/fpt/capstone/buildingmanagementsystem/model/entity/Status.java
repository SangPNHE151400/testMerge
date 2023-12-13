package fpt.capstone.buildingmanagementsystem.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "status")
public class Status {
    @Id
    @Column(name = "status_id")
    public String statusId;
    @NotNull
    @Column(name = "status_name")
    public String statusName;
}
