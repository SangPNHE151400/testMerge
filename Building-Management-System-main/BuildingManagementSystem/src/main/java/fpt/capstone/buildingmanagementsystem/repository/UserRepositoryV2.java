package fpt.capstone.buildingmanagementsystem.repository;

import fpt.capstone.buildingmanagementsystem.model.response.UserAccountResponse;

import java.util.List;

public interface UserRepositoryV2 {
    List<UserAccountResponse> getUserAccount();
    List<UserAccountResponse> getUserAccountActive();
}
