package fpt.capstone.buildingmanagementsystem.repository;

import java.util.List;

public interface RequestMessageRepositoryV2 {

    List<?> getAllRequestMessage(String requestId, String table);
}
