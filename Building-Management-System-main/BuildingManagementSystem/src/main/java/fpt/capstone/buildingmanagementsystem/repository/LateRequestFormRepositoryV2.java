package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.enumEnitty.LateType;
import fpt.capstone.buildingmanagementsystem.model.response.LateFormResponse;

import java.sql.Date;
import java.util.List;

public interface LateRequestFormRepositoryV2 {
    List<LateFormResponse> findLateAndEarlyViolateByUserIdAndDate(String userId, Date date, LateType lateType);


}
