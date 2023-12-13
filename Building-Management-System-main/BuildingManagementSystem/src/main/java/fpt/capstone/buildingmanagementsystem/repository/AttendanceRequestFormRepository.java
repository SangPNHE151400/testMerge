package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.AttendanceRequestForm;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRequestFormRepository extends CrudRepository<AttendanceRequestForm, String> {
    List<AttendanceRequestForm> findByRequestMessageIn(List<RequestMessage> requestMessages);
}
