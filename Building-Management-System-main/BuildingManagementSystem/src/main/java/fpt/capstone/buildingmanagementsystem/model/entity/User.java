package fpt.capstone.buildingmanagementsystem.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.validator.constraints.UniqueElements;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user")
@Builder(toBuilder = true)
public class User {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "user_id",updatable = false, nullable = false)
    String userId;
    @NotNull
    @Column(name = "first_name")
    String firstName;
    @NotNull
    @Column(name = "last_name")
    String lastName;
    @NotNull
    @Column(name = "gender")
    String gender;
    @NotNull
    @Column(name = "date_of_birth")
    String dateOfBirth;
    @NotNull
    @Column(name = "telephone_number")
    String telephoneNumber;
    @NotNull
    @Column(name = "address")
    String address;
    @NotNull
    @Column(name = "country")
    String country;
    @NotNull
    @Column(name = "city")
    String city;
    @NotNull
    @Column(name = "email")
    String email;
    @Column(name = "accepted_by")
    String AcceptedBy;
    @Column(name = "approved_date")
    Date ApprovedDate;
    @NotNull
    @Column(name = "image")
    String image;
    @NotNull
    @Column(name = "created_date")
    public Date createdDate;
    @NotNull
    @Column(name = "updated_date")
    public Date updatedDate;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private Account account;
    @ManyToOne
    @JoinColumn(name = "departmentId")
    private Department department;
}
