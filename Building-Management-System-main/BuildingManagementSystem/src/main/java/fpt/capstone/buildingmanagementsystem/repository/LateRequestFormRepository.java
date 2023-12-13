package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.LateRequestForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LateRequestFormRepository extends JpaRepository<LateRequestForm, String> {
    List<LateRequestForm> findByRequestMessageIn(List<RequestMessage> requestMessages);
}
