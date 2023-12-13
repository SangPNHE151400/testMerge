package fpt.capstone.buildingmanagementsystem.repository;


import fpt.capstone.buildingmanagementsystem.model.entity.RequestMessage;
import fpt.capstone.buildingmanagementsystem.model.entity.requestForm.OtherRequest;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OtherRequestFormRepository extends CrudRepository<OtherRequest,String> {
    List<OtherRequest> findByRequestMessageIn(List<RequestMessage> requestMessages);
}
