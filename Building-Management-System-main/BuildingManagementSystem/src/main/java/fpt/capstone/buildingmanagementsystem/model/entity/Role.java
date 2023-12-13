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
@Table(name = "role")
public class Role {
    @Id
    @Column(name = "role_id")
    public String roleId;
    @NotNull
    @Column(name = "role_name")
    public String roleName;
}