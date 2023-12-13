package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.OvertimeRequestForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OvertimeRequestFormRepository extends JpaRepository<OvertimeRequestForm, String> {
    List<OvertimeRequestForm> findByRequestMessageIn(List<RequestMessage> requestMessages);
}
